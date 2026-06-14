import Redis from 'ioredis';
import { __prod__ } from '@utils/constants';
import logger from './logger';

export const redis = __prod__
  ? new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    })
  : new Redis();

redis.on('connect', () => logger.info('Redis Connected'));
redis.on('error', err => logger.error('Redis Error', { error: err }));
