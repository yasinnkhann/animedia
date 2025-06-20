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
			console.warn('Approaching Redis memory limit. Cleaning up...');
			try {
				await redis.flushdb();
				console.log('Redis database flushed successfully.');
			} catch (flushErr) {
				console.error('Failed to flush Redis database:', flushErr);
				return;
			}
		}
	} catch (err) {
		console.error('Redis memory check failed:', err);
	}
}

if (__prod__) {
	console.log('Starting Redis memory monitoring...');
	cron.schedule('*/30 * * * * *', monitorRedisMemory);
}
