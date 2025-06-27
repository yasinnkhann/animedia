// lib/logger.ts

import { createLogger, format, transports } from 'winston';

const isProd = process.env.NODE_ENV === 'production';

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp(),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	transports: [
		new transports.Console({
			format: isProd
				? format.json()
				: format.combine(
						format.colorize(),
						format.printf(({ level, message, timestamp, ...meta }) => {
							return `${timestamp} [${level}]: ${message} ${
								Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
							}`;
						})
					),
		}),
	],
});

export default logger;
