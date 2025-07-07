import Redis from 'ioredis';
import cron from 'node-cron';
import { __prod__, REDIS_MB_THRESHOLD } from 'utils/constants';

export const redis = __prod__
	? new Redis({
			host: process.env.REDIS_HOST,
			port: Number(process.env.REDIS_PORT),
			password: process.env.REDIS_PASSWORD,
		})
	: new Redis();

redis.on('connect', () => console.log('Redis Connected'));
redis.on('error', err => console.error('Redis Error:', err));

async function monitorRedisMemory() {
	try {
		const info = await redis.info('memory');
		const usedMemoryLine = info.split('\n').find(line => line.startsWith('used_memory:'));
		if (!usedMemoryLine) return;

		const usedBytes = parseInt(usedMemoryLine.split(':')[1], 10);
		const usedMB = usedBytes / (1024 * 1024);

		if (usedMB > REDIS_MB_THRESHOLD) {
			console.warn(`Redis memory usage is high: ${usedMB.toFixed(2)} MB`);
			try {
				await redis.flushdb();
				console.log('Redis database flushed due to high memory usage');
			} catch (flushErr) {
				console.error('Failed to flush Redis database:', flushErr);
				return;
			}
		}
	} catch (err) {
		console.error('Error monitoring Redis memory:', err);
	}
}

if (__prod__) {
	cron.schedule('*/30 * * * * *', monitorRedisMemory);
}
