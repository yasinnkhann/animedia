import { GraphQLError } from 'graphql';
import * as Sentry from '@sentry/nextjs';
import logger from '@lib/logger';
import { z } from 'zod';

/**
 * Custom GraphQL error with structured error codes
 */
export class StructuredGraphQLError extends GraphQLError {
	constructor(
		message: string,
		public code: string,
		public statusCode: number = 500,
		public details?: Record<string, any>
	) {
		super(message, {
			extensions: {
				code,
				statusCode,
				details,
			},
		});
		this.name = 'StructuredGraphQLError';
	}
}

/**
 * Error codes for GraphQL
 */
export const GraphQLErrorCodes = {
	// Client errors
	VALIDATION_ERROR: 'VALIDATION_ERROR',
	BAD_REQUEST: 'BAD_REQUEST',
	NOT_FOUND: 'NOT_FOUND',
	UNAUTHORIZED: 'UNAUTHENTICATED',
	FORBIDDEN: 'FORBIDDEN',

	// Server errors
	INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
	SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
	TIMEOUT: 'TIMEOUT',

	// External API errors
	EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
	RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
	API_KEY_INVALID: 'API_KEY_INVALID',
} as const;

/**
 * Map error types to GraphQL error codes and status codes
 */
function mapErrorToGraphQL(error: unknown): {
	code: string;
	statusCode: number;
	message: string;
} {
	if (error instanceof z.ZodError) {
		return {
			code: GraphQLErrorCodes.VALIDATION_ERROR,
			statusCode: 400,
			message: `Validation failed: ${error.issues[0]?.message || 'Invalid input'}`,
		};
	}

	if (error instanceof Error) {
		const msg = error.message.toLowerCase();

		if (msg.includes('not found') || msg.includes('404')) {
			return {
				code: GraphQLErrorCodes.NOT_FOUND,
				statusCode: 404,
				message: error.message,
			};
		}

		if (msg.includes('unauthorized') || msg.includes('401') || msg.includes('unauthenticated')) {
			return {
				code: GraphQLErrorCodes.UNAUTHORIZED,
				statusCode: 401,
				message: error.message,
			};
		}

		if (msg.includes('forbidden') || msg.includes('403')) {
			return {
				code: GraphQLErrorCodes.FORBIDDEN,
				statusCode: 403,
				message: error.message,
			};
		}

		if (msg.includes('timeout') || msg.includes('econnaborted')) {
			return {
				code: GraphQLErrorCodes.TIMEOUT,
				statusCode: 504,
				message: 'Request timeout',
			};
		}

		if (msg.includes('rate limit') || msg.includes('429')) {
			return {
				code: GraphQLErrorCodes.RATE_LIMIT_EXCEEDED,
				statusCode: 429,
				message: 'Rate limit exceeded',
			};
		}

		if (msg.includes('api_key') || msg.includes('invalid key')) {
			return {
				code: GraphQLErrorCodes.API_KEY_INVALID,
				statusCode: 401,
				message: 'Invalid API key configuration',
			};
		}

		return {
			code: GraphQLErrorCodes.INTERNAL_SERVER_ERROR,
			statusCode: 500,
			message: error.message,
		};
	}

	return {
		code: GraphQLErrorCodes.INTERNAL_SERVER_ERROR,
		statusCode: 500,
		message: 'An unexpected error occurred',
	};
}

/**
 * Wrap a resolver with structured error handling
 * Usage: resolve: safeResolver(async (_parent, args, context) => { ... })
 */
export function safeResolver<T>(
	resolver: (parent: any, args: any, context: any, info: any) => Promise<T> | T
): (parent: any, args: any, context: any, info: any) => Promise<T> {
	return async (parent, args, context, info) => {
		const requestId = context.requestId || 'unknown';

		try {
			return await resolver(parent, args, context, info);
		} catch (error) {
			const { code, statusCode, message } = mapErrorToGraphQL(error);

			// Log the error with context
			logger.error(`GraphQL Resolver Error: ${info.fieldName}`, {
				fieldName: info.fieldName,
				operationType: info.operation.operation,
				error: error instanceof Error ? error.message : String(error),
				requestId,
				userId: context.user?.id,
			});

			// Capture in Sentry
			Sentry.captureException(error, {
				contexts: {
					graphql: {
						field: info.fieldName,
						operation_type: info.operation.operation,
						request_id: requestId,
						user_id: context.user?.id,
					},
				},
				level: statusCode < 500 ? 'warning' : 'error',
			});

			// Throw structured GraphQL error
			throw new StructuredGraphQLError(message, code, statusCode);
		}
	};
}

/**
 * Create a GraphQL error with standardized format
 */
export function createGraphQLError(
	message: string,
	code: string = GraphQLErrorCodes.INTERNAL_SERVER_ERROR,
	statusCode: number = 500,
	details?: Record<string, any>
): StructuredGraphQLError {
	return new StructuredGraphQLError(message, code, statusCode, details);
}

/**
 * Validate GraphQL input arguments using Zod
 */
export function validateGraphQLInput<T>(schema: z.ZodSchema<T>, data: any): T {
	try {
		return schema.parse(data);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const details = {
				validationErrors: error.issues.map((e: any) => ({
					path: e.path.join('.'),
					message: e.message,
					code: e.code,
				})),
			};
			throw createGraphQLError(
				'Validation failed',
				GraphQLErrorCodes.VALIDATION_ERROR,
				400,
				details
			);
		}
		throw error;
	}
}
