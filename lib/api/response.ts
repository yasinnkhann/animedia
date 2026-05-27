import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';
import logger from '../logger';

/**
 * Standard API Response Envelope
 * Wraps all API responses for consistent client-side handling
 */
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
 * Zod schema for validating API responses
 */
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
      details: z.record(z.string(), z.any()).optional(),
    })
    .optional(),
  timestamp: z.string(),
  requestId: z.string().optional(),
});

/**
 * Create a successful response envelope
 */
export function successResponse<T>(data: T, requestId?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    requestId,
  };
}

/**
 * Create an error response envelope
 */
export function errorResponse(
  code: string,
  message: string,
  details?: Record<string, any>,
  requestId?: string
): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
    requestId,
  };
}

/**
 * Error code constants
 */
export const ErrorCodes = {
  // Client errors (4xx)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  BAD_REQUEST: 'BAD_REQUEST',

  // Server errors (5xx)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',

  // External API errors
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  API_KEY_INVALID: 'API_KEY_INVALID',
} as const;

/**
 * Handle and wrap errors consistently
 */
export function handleError(
  error: unknown,
  context: {
    operation: string;
    requestId?: string;
    userId?: string;
    details?: Record<string, any>;
  }
): ApiResponse {
  const { operation, requestId, userId, details } = context;

  logger.error(`Operation failed: ${operation}`, {
    error: error instanceof Error ? error.message : String(error),
    userId,
    requestId,
    ...details,
  });

  // Determine error code and message
  let code: string = ErrorCodes.INTERNAL_ERROR;
  let message = 'An unexpected error occurred';
  let errorDetails = details;

  if (error instanceof z.ZodError) {
    code = ErrorCodes.VALIDATION_ERROR;
    message = 'Validation failed';
    errorDetails = {
      ...details,
      validationErrors: error.issues.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message,
        code: e.code,
      })),
    };
  } else if (error instanceof Error) {
    message = error.message;

    // Map specific error types
    if (error.message.includes('not found') || error.message.includes('404')) {
      code = ErrorCodes.NOT_FOUND;
    } else if (error.message.includes('timeout') || error.message.includes('ECONNABORTED')) {
      code = ErrorCodes.TIMEOUT;
    } else if (error.message.includes('rate limit') || error.message.includes('429')) {
      code = ErrorCodes.RATE_LIMIT_EXCEEDED;
    } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
      code = ErrorCodes.UNAUTHORIZED;
    } else if (error.message.includes('forbidden') || error.message.includes('403')) {
      code = ErrorCodes.FORBIDDEN;
    } else if (error.message.includes('api_key') || error.message.includes('invalid key')) {
      code = ErrorCodes.API_KEY_INVALID;
    }
  }

  // Capture in Sentry with context
  Sentry.captureException(error, {
    contexts: {
      operation: {
        name: operation,
        request_id: requestId,
        user_id: userId,
      },
    },
    level: code.includes('4') ? 'warning' : 'error',
  });

  return errorResponse(code, message, errorDetails, requestId);
}

/**
 * Wrap a resolver function with response standardization
 */
export function withStandardResponse<T extends (...args: any[]) => any>(
  resolver: T,
  operation: string
): T {
  return (async (...args: any[]) => {
    const requestId = (args[2]?.requestId as string) || undefined;
    const userId = (args[2]?.user?.id as string) || undefined;

    try {
      const result = await resolver(...args);
      return successResponse(result, requestId);
    } catch (error) {
      return handleError(error, {
        operation,
        requestId,
        userId,
      });
    }
  }) as T;
}
