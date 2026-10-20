import Redis, { RedisOptions } from 'ioredis';
import { __prod__ } from '@utils/constants';
import logger from './logger';

const getRedisConfig = (): { url?: string; options: RedisOptions } => {
  const hasExplicitUrl = Boolean(process.env.REDIS_URL || process.env.REDIS_HOST);
  const options: RedisOptions = {
    lazyConnect: true,
    enableOfflineQueue: hasExplicitUrl,
    connectTimeout: 3000,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > (hasExplicitUrl ? 2 : 0)) {
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

class MemoryCache {
  private store = new Map<string, { value: string; expiresAt: number | null }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt !== null && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ...args: any[]): Promise<'OK'> {
    let expiresAt: number | null = null;
    if (args.length >= 2 && args[0] === 'EX') {
      const seconds = typeof args[1] === 'number' ? args[1] : parseInt(args[1], 10);
      if (!isNaN(seconds)) {
        expiresAt = Date.now() + seconds * 1000;
      }
    } else if (args.length >= 2 && args[0] === 'PX') {
      const ms = typeof args[1] === 'number' ? args[1] : parseInt(args[1], 10);
      if (!isNaN(ms)) {
        expiresAt = Date.now() + ms;
      }
    }
    this.store.set(key, { value, expiresAt });
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const key of keys) {
      if (this.store.delete(key)) count++;
    }
    return count;
  }
}

class ResilientRedis {
  private client: Redis | null = null;
  private memoryStore = new MemoryCache();

  constructor() {
    const isVercelOrProd = Boolean(process.env.VERCEL || __prod__);
    const hasExplicitUrl = Boolean(process.env.REDIS_URL || process.env.REDIS_HOST);

    // On Vercel or production without explicit Redis URL/HOST, do not attempt to dial localhost:6379
    if (isVercelOrProd && !hasExplicitUrl) {
      return;
    }

    try {
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
            logger.warn('Redis is unreachable at 127.0.0.1:6379. Using memory fallback store.');
          }
          return;
        }
        logger.error('Redis Error', { error: err });
      });

      this.client = client;
    } catch {
      logger.warn('Failed to initialize Redis client, falling back to memory store.');
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.client) {
      try {
        const val = await this.client.get(key);
        if (val !== null) return val;
      } catch {
        // Fallback to memory store
      }
    }
    return await this.memoryStore.get(key);
  }

  async set(key: string, value: string, ...args: any[]): Promise<'OK' | null> {
    await this.memoryStore.set(key, value, ...args);
    if (this.client) {
      try {
        return await (this.client.set as any)(key, value, ...args);
      } catch {
        // Fallback to memory store
      }
    }
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    const memCount = await this.memoryStore.del(...keys);
    if (this.client) {
      try {
        return await this.client.del(...keys);
      } catch {
        // Fallback to memory store
      }
    }
    return memCount;
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.client) {
      this.client.on(event, callback);
    }
    return this;
  }
}

declare global {
  var redisClient: ResilientRedis | undefined;
}

export const redis = (global.redisClient || new ResilientRedis()) as unknown as Redis;

if (!__prod__) {
  global.redisClient = redis as unknown as ResilientRedis;
}
