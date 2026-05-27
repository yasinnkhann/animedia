import { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';
import logger from '../logger';
import { z } from 'zod';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
  requestId?: string;
}

/**
 * Generate unique request ID for tracing
 */
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Create API response wrapper for REST endpoints
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: { code: string; message: string; details?: Record<string, any> },
  requestId?: string
): ApiResponse<T> {
  return {
    success,
    ...(data && { data }),
    ...(error && { error }),
    timestamp: new Date().toISOString(),
    ...(requestId && { requestId }),
  };
}

/**
 * Wrap an API handler with response standardization and error handling
 * Usage: export default withApiHandler(async (req, res, context) => { ... })
 */
export function withApiHandler(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    context: {
      requestId: string;
      userId?: string;
    }
  ) => Promise<void>
): (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
  return async (req, res) => {
    const requestId = generateRequestId();
    const method = req.method;
    const path = req.url;
    const userId = (req as any).userId; // From middleware

    try {
      // Log incoming request
      logger.info(`API Request: ${method} ${path}`, {
        requestId,
        userId,
        method,
        path,
      });

      // Call handler
      await handler(req, res, { requestId, userId });

      // Log successful response
      const statusCode = res.statusCode;
      if (statusCode && statusCode >= 400) {
        logger.warn(`API Response: ${method} ${path} ${statusCode}`, {
          requestId,
          userId,
          statusCode,
        });
      } else {
        logger.info(`API Response: ${method} ${path} ${statusCode}`, {
          requestId,
          userId,
          statusCode,
        });
      }
    } catch (error) {
      const statusCode =
        error instanceof Error && 'statusCode' in error ? (error.statusCode as number) : 500;

      logger.error(`API Error: ${method} ${path}`, {
        requestId,
        userId,
        error: error instanceof Error ? error.message : String(error),
        statusCode,
      });

      // Capture in Sentry
      Sentry.captureException(error, {
        contexts: {
          http: {
            method,
            url: path,
            status_code: statusCode,
            request_id: requestId,
            user_id: userId,
          },
        },
        level: statusCode < 500 ? 'warning' : 'error',
      });

      // Send error response
      const response = createApiResponse(
        false,
        undefined,
        {
          code: statusCode < 500 ? 'BAD_REQUEST' : 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          ...(process.env.NODE_ENV === 'development' && {
            details: { stack: error instanceof Error ? error.stack : undefined },
          }),
        },
        requestId
      );

      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    }
  };
}

/**
 * Parse and validate request body using Zod schema
 */
export function parseRequestBody<T>(schema: z.ZodSchema<T>, body: any): T {
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const err = new Error(`Validation failed: ${error.issues[0]?.message}`);
      (err as any).statusCode = 400;
      throw err;
    }
    throw error;
  }
}

/**
 * Send success response
 */
export function sendSuccess<T>(
  res: NextApiResponse,
  data: T,
  statusCode: number = 200,
  requestId?: string
): void {
  const response = createApiResponse(true, data, undefined, requestId);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response));
}

/**
 * Send error response
 */
export function sendError(
  res: NextApiResponse,
  code: string,
  message: string,
  statusCode: number = 500,
  details?: Record<string, any>,
  requestId?: string
): void {
  const response = createApiResponse(false, undefined, { code, message, details }, requestId);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response));
}
