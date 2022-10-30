import Redis from 'ioredis';

export const redis = new Redis({
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
	password: process.env.REDIS_PASSWORD,
});

redis.on('connect', () => console.log('Redis Connected'));
redis.on('error', error => console.log('Redis Error', error));
