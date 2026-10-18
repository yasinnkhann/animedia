import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IGDB_ACCESS_TOKEN_PREFIX, IGDB_BASE_API_URL, __prod__ } from '@utils/constants';
import { unstable_cache } from 'next/cache';
import { redis } from '../lib/redis';
import logger from '../lib/logger';
import { TIGDBImageSizes } from '@ts/types';

export const sleep = async (ms: number) => {
  await new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const sendEmail = async (payload: Mail.Options) => {
  if (!__prod__) {
    // createTestAccount is callback-based; promisify it so errors are propagated
    const createTestAccount = (): Promise<nodemailer.TestAccount> =>
      new Promise((resolve, reject) =>
        nodemailer.createTestAccount((err, account) => {
          if (err) reject(err);
          else resolve(account);
        })
      );

    const account = await createTestAccount().catch(err => {
      console.error('Failed to create Ethereal test account (API may be down):', err.message);
      return null;
    });

    if (!account) {
      console.log('--- Ethereal Mail Down. Mocking Email ---');
      console.log(payload);
      console.log('-------------------------------------------');
      return;
    }

    const transporterConfig: SMTPTransport.Options = {
      host: 'smtp.ethereal.email',
      port: +process.env.TURBO_SMTP_UNSECURE_PORT,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    };

    const transporter = nodemailer.createTransport(transporterConfig);
    const info = await transporter.sendMail(payload);
    console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
  } else {
    const transporterConfig: SMTPTransport.Options = {
      host: process.env.TURBO_SMTP_HOST,
      port: +process.env.TURBO_SMTP_SECURE_PORT,
      secure: true,
      auth: {
        user: process.env.TURBO_SMTP_USERNAME,
        pass: process.env.TURBO_SMTP_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(transporterConfig);
    await transporter.sendMail(payload);
  }
};

export const getErrorMsg = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return JSON.stringify(error);
  }
};

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let memoryCachedToken: { token: string; expiresAt: number } | null = null;
let tokenPromise: Promise<string> | null = null;

export const getIGDBAccessToken = async (): Promise<string> => {
  if (memoryCachedToken && Date.now() < memoryCachedToken.expiresAt - 60000) {
    return memoryCachedToken.token;
  }

  if (tokenPromise) {
    return tokenPromise;
  }

  tokenPromise = (async () => {
    try {
      try {
        const redisToken = await redis.get(IGDB_ACCESS_TOKEN_PREFIX);
        if (redisToken) {
          memoryCachedToken = { token: redisToken, expiresAt: Date.now() + 5 * 60 * 1000 };
          return redisToken;
        }
      } catch {
        // Redis unavailable; fall back to fetching fresh token
      }

      const clientId = process.env.IGDB_CLIENT_ID;
      const clientSecret = process.env.IGDB_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        throw new Error('IGDB_CLIENT_ID or IGDB_CLIENT_SECRET environment variable is missing.');
      }

      const accessTokenRes = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!accessTokenRes.ok) {
        throw new Error(`Failed to fetch Twitch access token: HTTP ${accessTokenRes.status}`);
      }

      const accessTokenData: AccessTokenResponse = await accessTokenRes.json();
      const accessToken = accessTokenData.access_token;

      if (!accessToken) {
        throw new Error('Could not fetch newest access token.');
      }

      const expiresInMs = (accessTokenData.expires_in || 3600) * 1000;
      memoryCachedToken = { token: accessToken, expiresAt: Date.now() + expiresInMs };

      try {
        await redis.set(IGDB_ACCESS_TOKEN_PREFIX, accessToken, 'EX', accessTokenData.expires_in);
      } catch {
        // Non-fatal if Redis is down
      }

      return accessToken;
    } finally {
      tokenPromise = null;
    }
  })();

  return tokenPromise;
};

export const invalidateIGDBAccessToken = async () => {
  memoryCachedToken = null;
  try {
    await redis.del(IGDB_ACCESS_TOKEN_PREFIX);
  } catch {
    // Non-fatal if Redis is down
  }
};

const executeIGDBFetch = async (url: string, reqBody: string, token: string) => {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-ID': process.env.IGDB_CLIENT_ID || '',
      Authorization: `Bearer ${token}`,
    },
    body: reqBody,
  });
};

const getCachedIGDB = unstable_cache(
  async (urlToFetch: string, reqBody: string) => {
    let token = await getIGDBAccessToken();
    let response = await executeIGDBFetch(urlToFetch, reqBody, token);

    if (response.status === 401) {
      await invalidateIGDBAccessToken();
      token = await getIGDBAccessToken();
      response = await executeIGDBFetch(urlToFetch, reqBody, token);
    }

    if (!response.ok) {
      throw new Error(`IGDB fetch failed with status: ${response.status}`);
    }

    return await response.json();
  },
  ['igdb-query-cache'],
  { revalidate: 3600 }
);

export const postIGDB = async (
  url: string,
  body = '',
  maxRetries = 3,
  initialRetryDelayMs = 400
) => {
  try {
    let retries = 0;
    let retryDelayMs = initialRetryDelayMs;

    while (retries < maxRetries) {
      try {
        return await getCachedIGDB(url, body);
      } catch (err) {
        retries++;
        if (retries >= maxRetries) {
          throw err;
        }
        await sleep(retryDelayMs);
        retryDelayMs = Math.min(retryDelayMs * 2, 2000);
      }
    }
    throw new Error('Could not fetch after max retries');
  } catch (err) {
    logger.error('postIGDB failed', { error: getErrorMsg(err), url });
    throw err;
  }
};

export const addIGDBCoverUrl = async (res: any[], imageSize: TIGDBImageSizes) => {
  if (!Array.isArray(res) || res.length === 0) return;

  const coverIds = Array.from(
    new Set(
      res
        .map((r: any) => (typeof r?.cover === 'number' ? r.cover : r?.cover?.id))
        .filter((id): id is number => typeof id === 'number')
    )
  );

  const coverMap = new Map<number, string>();

  if (coverIds.length > 0) {
    try {
      const coverResponse = await postIGDB(
        `${IGDB_BASE_API_URL}/covers`,
        `fields id, url; where id = (${coverIds.join(',')}); limit 500;`
      );
      if (Array.isArray(coverResponse)) {
        for (const cover of coverResponse) {
          if (cover?.id && typeof cover.url === 'string') {
            const url = imageSize !== 'thumb' ? cover.url.replace('thumb', imageSize) : cover.url;
            coverMap.set(cover.id, url);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  for (const result of res) {
    const coverId = typeof result?.cover === 'number' ? result.cover : result?.cover?.id;
    result.coverUrl = coverId ? (coverMap.get(coverId) ?? null) : null;
  }
};

export const addIGDBMugShotUrl = async (res: any[], imageSize: TIGDBImageSizes) => {
  if (!Array.isArray(res) || res.length === 0) return;

  const mugShotIds = Array.from(
    new Set(
      res
        .map((r: any) => (typeof r?.mug_shot === 'number' ? r.mug_shot : r?.mug_shot?.id))
        .filter((id): id is number => typeof id === 'number')
    )
  );

  const mugShotMap = new Map<number, string>();

  if (mugShotIds.length > 0) {
    try {
      const mugShotResponse = await postIGDB(
        `${IGDB_BASE_API_URL}/character_mug_shots`,
        `fields id, url; where id = (${mugShotIds.join(',')}); limit 500;`
      );
      if (Array.isArray(mugShotResponse)) {
        for (const shot of mugShotResponse) {
          if (shot?.id && typeof shot.url === 'string') {
            const url = imageSize !== 'thumb' ? shot.url.replace('thumb', imageSize) : shot.url;
            mugShotMap.set(shot.id, url);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  for (const result of res) {
    const shotId = typeof result?.mug_shot === 'number' ? result.mug_shot : result?.mug_shot?.id;
    result.mugShotUrl = shotId ? (mugShotMap.get(shotId) ?? null) : null;
  }
};
