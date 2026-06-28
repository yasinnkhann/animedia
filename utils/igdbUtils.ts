import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IGDB_ACCESS_TOKEN_PREFIX, IGDB_BASE_API_URL, __prod__ } from '@utils/constants';
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

export const postIGDB = async (
  url: string,
  body = '',
  maxRetries = 10,
  initialRetryDelayMs = 500
) => {
  interface AccessTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
  }

  try {
    let accessToken = await redis.get(IGDB_ACCESS_TOKEN_PREFIX);

    if (accessToken === null) {
      const accessTokenRes = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const accessTokenData: AccessTokenResponse = await accessTokenRes.json();
      accessToken = accessTokenData.access_token;

      if (!accessToken) {
        throw new Error('Could not fetch newest access token.');
      }

      await redis.set(IGDB_ACCESS_TOKEN_PREFIX, accessToken, 'EX', accessTokenData.expires_in);
    }

    let retries = 0;
    let retryDelayMs = initialRetryDelayMs;

    while (retries < maxRetries) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-ID': process.env.IGDB_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
        body,
        next: {
          revalidate: 3600, // Cache globally for 1 hour
        },
      });
      if (response.ok) {
        return await response.json();
      } else {
        await sleep(retryDelayMs);
        retryDelayMs *= 2;
        retries++;
      }
    }
    throw new Error('Could not fetch after max retries');
  } catch (err) {
    logger.error('postIGDB failed', { error: getErrorMsg(err), url });
    throw err;
  }
};

export const addIGDBCoverUrl = async (res: any[], imageSize: TIGDBImageSizes) => {
  await Promise.all(
    res.map(async (result: any) => {
      try {
        if (result.cover) {
          const coverResponse = await postIGDB(
            `${IGDB_BASE_API_URL}/covers`,
            `fields url; where id=${result.cover};`
          );

          if (coverResponse && coverResponse.length > 0) {
            let coverUrl: string = coverResponse[0].url;
            if (imageSize !== 'thumb') {
              coverUrl = coverUrl.replace('thumb', imageSize);
            }
            result.coverUrl = coverUrl;
          } else {
            result.coverUrl = null;
          }
        } else {
          result.coverUrl = null;
        }
      } catch (err) {
        console.error(err);
        result.coverUrl = null;
      }
      return result;
    })
  );
};

export const addIGDBMugShotUrl = async (res: any[], imageSize: TIGDBImageSizes) => {
  await Promise.all(
    res.map(async (result: any) => {
      try {
        if (result.mug_shot) {
          const mugShotResponse = await postIGDB(
            `${IGDB_BASE_API_URL}/character_mug_shots`,
            `fields url; where id=${result.mug_shot};`
          );

          if (mugShotResponse && mugShotResponse.length > 0) {
            let mugShotUrl: string = mugShotResponse[0].url;
            if (imageSize !== 'thumb') {
              mugShotUrl = mugShotUrl.replace('thumb', imageSize);
            }
            result.mugShotUrl = mugShotUrl;
          } else {
            result.mugShotUrl = null;
          }
        } else {
          result.mugShotUrl = null;
        }
      } catch (err) {
        console.error(err);
        result.mugShotUrl = null;
      }
      return result;
    })
  );
};
