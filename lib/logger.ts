import { createLogger, format, transports } from 'winston';
import { __prod__ } from 'utils/constants';
import crypto from 'crypto';

// Environment-based log level
const LOG_LEVEL = process.env.LOG_LEVEL || (__prod__ ? 'warn' : 'info');

// Sensitive data filter
const sensitiveDataFilter = format(info => {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];
  const filterObject = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;

    const filtered = { ...obj };
    for (const key of Object.keys(filtered)) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        filtered[key] = '[FILTERED]';
      } else if (typeof filtered[key] === 'object') {
        filtered[key] = filterObject(filtered[key]);
      }
    }
    return filtered;
  };

  if (info.meta) info.meta = filterObject(info.meta);
  return info;
});

// Enhanced error formatter
const errorFormatter = format(info => {
  if (info.error instanceof Error) {
    info.error = {
      message: info.error.message,
      stack: __prod__ ? undefined : info.error.stack, // Hide stack in prod for security
      name: info.error.name,
      ...((info.error as any).code && { code: (info.error as any).code }),
      ...((info.error as any).statusCode && { statusCode: (info.error as any).statusCode }),
    };
  }
  return info;
});

// Request ID generator for correlation
const addRequestId = format(info => {
  if (!info.requestId) {
    info.requestId = crypto.randomUUID().substring(0, 8);
  }
  return info;
});

const logger = createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    addRequestId(),
    sensitiveDataFilter(),
    errorFormatter(),
    format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
    format.errors({ stack: !__prod__ }), // Stack traces only in dev
    format.splat(),
    // Use JSON in production for better log aggregation
    __prod__
      ? format.json()
      : format.combine(
          format.colorize({ all: true }),
          format.printf(({ level, message, timestamp, requestId, ...meta }) => {
            const reqId = requestId ? `[${requestId}] ` : '';
            const metaStr = Object.keys(meta).length ? '\n' + JSON.stringify(meta, null, 2) : '';
            return `${reqId}[${level}] ${timestamp}: ${message}${metaStr}`;
          })
        )
  ),
  transports: [
    new transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
  // Prevent logger from exiting the process
  exitOnError: false,
});

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(
        ({ level, message, timestamp, stack }) =>
          `[${level}] ${timestamp}: Uncaught Exception\n${stack || message}`
      )
    ),
  })
);

logger.rejections.handle(
  new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(
        ({ level, message, timestamp, stack }) =>
          `[${level}] ${timestamp}: Unhandled Rejection\n${stack || message}`
      )
    ),
  })
);

export default logger;
