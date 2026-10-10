import Redis from 'ioredis';
import { __prod__ } from '@utils/constants';
import logger from './logger';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => logger.info('Redis Connected'));
redis.on('error', err => logger.error('Redis Error', { error: err }));
