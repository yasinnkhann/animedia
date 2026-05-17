# Response Standardization Guide

This guide explains how to use the standardized response system for both GraphQL and REST API endpoints.

## Overview

All API responses now follow a consistent structure with:

- **Success status** (`true` or `false`)
- **Data payload** (on success)
- **Error details** (on failure)
- **Timestamp** (for auditing)
- **Request ID** (for tracing)

---

## GraphQL Resolvers

### Using `safeResolver` Wrapper

The `safeResolver` wrapper automatically handles errors and logging:

```typescript
import { safeResolver } from '@graphql/utils/resolver-helpers';
import { parseInput, MovieSearchInput } from '@graphql/validations/inputs';

export const MovieQueries = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('searchedMovies', {
			type: 'MoviesRes',
			args: {
				q: nonNull(stringArg()),
				page: intArg({ default: 1 }),
			},
			// safeResolver automatically:
			// - Catches errors and logs them
			// - Sends errors to Sentry
			// - Returns properly formatted errors
			resolve: safeResolver(async (_parent, { q, page }) => {
				// Validate input against schema
				const input = parseInput(MovieSearchInput, { q, page });
				return await tmdbClient.searchMovies(input.q, input.page);
			}),
		});
	},
});
```

### Manual Error Handling

If you prefer manual control, use structured errors:

```typescript
import { StructuredGraphQLError, GraphQLErrorCodes } from '@graphql/utils/resolver-helpers';

resolve: async (_parent, args, context) => {
	try {
		// ... resolver logic
	} catch (error) {
		// Throws error with structured format
		throw new StructuredGraphQLError('Movie not found', GraphQLErrorCodes.NOT_FOUND, 404);
	}
};
```

### Input Validation

Pre-defined validation schemas are available:

```typescript
import {
	MovieSearchInput,
	MovieDetailsInput,
	GameSearchInput,
	PersonDetailsInput,
	parseInput,
} from '@graphql/validations/inputs';

// Parse and validate
const input = parseInput(MovieSearchInput, { q, page });
```

**Available schemas:**

- `MovieSearchInput` - Movie title search with pagination
- `MovieDetailsInput` - Movie ID with optional page
- `ShowSearchInput` - Show title search
- `GameSearchInput` - Game search with limit
- `PersonSearchInput` - Person name search
- `PaginationInput` - Basic pagination

### Error Response Format

GraphQL errors are now structured with codes and status codes:

```json
{
	"errors": [
		{
			"message": "Movie not found",
			"extensions": {
				"code": "NOT_FOUND",
				"statusCode": 404
			}
		}
	]
}
```

---

## REST API Endpoints

### Using `withApiHandler` Wrapper

For REST endpoints, use the `withApiHandler` wrapper:

```typescript
import { withApiHandler, sendSuccess, sendError, parseRequestBody } from '@lib/api/handler';
import { z } from 'zod';

// Define input schema
const CreateMovieSchema = z.object({
	title: z.string().min(1),
	year: z.number().int().min(1900),
});

export default withApiHandler(async (req, res, { requestId, userId }) => {
	if (req.method === 'POST') {
		// Validate request body
		const data = parseRequestBody(CreateMovieSchema, req.body);

		// Perform operation
		const result = await someOperation(data);

		// Send success response
		sendSuccess(res, result, 201, requestId);
	}

	if (req.method === 'GET') {
		const movies = await fetchMovies();
		sendSuccess(res, movies, 200, requestId);
	}
});
```

### Response Format

Success response:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-05-09T14:30:15.123Z",
  "requestId": "abc123def456"
}
```

Error response:

```json
{
	"success": false,
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Validation failed",
		"details": {
			"validationErrors": [
				{
					"path": "title",
					"message": "String must contain at least 1 character(s)"
				}
			]
		}
	},
	"timestamp": "2026-05-09T14:30:15.123Z",
	"requestId": "abc123def456"
}
```

### Error Codes

**Client Errors:**

- `VALIDATION_ERROR` - Input validation failed (400)
- `BAD_REQUEST` - Malformed request (400)
- `UNAUTHORIZED` - Missing/invalid authentication (401)
- `FORBIDDEN` - Insufficient permissions (403)
- `NOT_FOUND` - Resource not found (404)

**Server Errors:**

- `INTERNAL_ERROR` - Unexpected server error (500)
- `SERVICE_UNAVAILABLE` - Service down (503)
- `TIMEOUT` - Request timeout (504)

**External API Errors:**

- `EXTERNAL_API_ERROR` - 3rd party API error
- `RATE_LIMIT_EXCEEDED` - Rate limit hit (429)
- `API_KEY_INVALID` - Invalid API key (401)

---

## Request Tracing

Every request gets a unique `requestId`:

- Included in all responses
- Logged across the system
- Sent to Sentry for error tracking
- Useful for debugging and auditing

**Usage:**

```typescript
// In resolvers
logger.error('Operation failed', {
	requestId,
	userId,
	details: { ... }
});

// In API handlers
sendError(res, 'NOT_FOUND', 'User not found', 404, undefined, requestId);
```

---

## Sentry Integration

All errors are automatically captured with context:

```
GraphQL errors include:
- Field name
- Operation type (Query/Mutation/Subscription)
- Request ID
- User ID
- Error level (warning/error)

REST API errors include:
- HTTP method
- URL path
- Status code
- Request ID
- User ID
```

---

## Migration Checklist

When updating existing resolvers:

- [ ] Import `safeResolver` and validation schemas
- [ ] Replace `try-catch` with `safeResolver` wrapper
- [ ] Add input validation with `parseInput`
- [ ] Remove manual `Sentry.captureException()` calls
- [ ] Test error scenarios

---

## Examples

### Before (Manual Error Handling)

```typescript
resolve: async (_parent, { q, page }) => {
	try {
		return await tmdbClient.searchMovies(q, page || 1);
	} catch (err) {
		logger.error('Failed to search movies', { query: q, error: err });
		Sentry.captureException(err);
		throw err;
	}
};
```

### After (Standardized)

```typescript
resolve: safeResolver(async (_parent, { q, page }) => {
	const input = parseInput(MovieSearchInput, { q, page });
	return await tmdbClient.searchMovies(input.q, input.page);
});
```

---

## Best Practices

1. **Always validate input** - Use Zod schemas for all user input
2. **Use error codes** - Be specific about error types
3. **Include request ID** - Add to all logs and responses
4. **Provide context** - Include relevant details for debugging
5. **Log appropriately** - Use different levels (error, warn, info)
6. **Monitor Sentry** - Check dashboards for patterns

---

## Troubleshooting

**Q: Why is my error not being captured?**
A: Make sure the resolver/handler is using the wrapper functions

**Q: How do I add custom metadata?**
A: Include it in the error details parameter:

```typescript
throw new StructuredGraphQLError('Custom message', 'CUSTOM_ERROR', 500, {
	userId,
	movieId,
	action: 'search',
});
```

**Q: Can I use this with existing resolvers?**
A: Yes! Gradually migrate existing resolvers to use the new patterns
