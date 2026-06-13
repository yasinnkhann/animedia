import Redis from 'ioredis';
import { __prod__, REDIS_MB_THRESHOLD } from '@utils/constants';
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

async function monitorRedisMemory() {
  try {
    const info = await redis.info('memory');
    const usedMemoryLine = info.split('\n').find(line => line.startsWith('used_memory:'));
    if (!usedMemoryLine) return;

    const usedBytes = parseInt(usedMemoryLine.split(':')[1], 10);
    const usedMB = usedBytes / (1024 * 1024);

    if (usedMB > REDIS_MB_THRESHOLD) {
      logger.warn('Redis memory usage is high', { usedMB: usedMB.toFixed(2) });
      try {
        await redis.flushdb();
        logger.info('Redis database flushed due to high memory usage');
      } catch (flushErr) {
        logger.error('Failed to flush Redis database', { error: flushErr });
        return;
      }
    }
  } catch (err) {
    logger.error('Error monitoring Redis memory', { error: err });
  }
}

if (__prod__) {
  setInterval(monitorRedisMemory, 30 * 1000);
}
