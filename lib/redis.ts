import Redis, { RedisOptions } from 'ioredis';
import { __prod__ } from '@utils/constants';
import logger from './logger';

const getRedisConfig = (): { url?: string; options: RedisOptions } => {
  const options: RedisOptions = {
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        return null;
      }
      return Math.min(times * 100, 1000);
    },
  };

  if (process.env.REDIS_URL) {
    return { url: process.env.REDIS_URL, options };
  }

  if (process.env.REDIS_HOST) {
    return {
      options: {
        ...options,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      },
    };
  }

  return { url: 'redis://localhost:6379', options };
};

const createRedisClient = () => {
  const { url, options } = getRedisConfig();
  const client = url ? new Redis(url, options) : new Redis(options);

  let hasLoggedRefused = false;

  client.on('connect', () => {
    hasLoggedRefused = false;
    logger.info('Redis Connected');
  });

  client.on('error', (err: any) => {
    if (err?.code === 'ECONNREFUSED' || err?.message?.includes('ECONNREFUSED')) {
      if (!hasLoggedRefused) {
        hasLoggedRefused = true;
        logger.warn('Redis is offline or unreachable. Using fallbacks where available.');
      }
      return;
    }
    logger.error('Redis Error', { error: err });
  });

  return client;
};

declare global {
  var redisClient: Redis | undefined;
}

export const redis = global.redisClient || createRedisClient();

if (!__prod__) {
  global.redisClient = redis;
}
