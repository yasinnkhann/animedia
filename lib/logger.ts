import { createLogger, format, transports } from 'winston';
import { __prod__ } from 'utils/constants';

const upperCaseLevel = format(info => {
	info.level = info.level.toUpperCase();
	return info;
});

const errorFormatter = format(info => {
	if (info.error instanceof Error) {
		info.error = {
			message: info.error.message,
			stack: info.error.stack,
			name: info.error.name,
		};
	}
	return info;
});

const logger = createLogger({
	level: 'info',
	format: format.combine(
		errorFormatter(),
		upperCaseLevel(),
		__prod__ ? format.uncolorize() : format.colorize({ all: true }),
		format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
		format.errors({ stack: true }),
		format.splat(),
		format.printf(({ level, message, timestamp, ...meta }) => {
			return `[${level}] ${timestamp}: ${message}${
				Object.keys(meta).length ? ' ' + JSON.stringify(meta, null, 2) : ''
			}`;
		})
	),
	transports: [new transports.Console()],
});

export default logger;
