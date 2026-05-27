/**
 * Custom error classes for API operations
 */

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class RetryError extends Error {
  constructor(
    message: string,
    public attempts: number,
    public lastError?: unknown
  ) {
    super(message);
    this.name = 'RetryError';
  }
}

export class RateLimitError extends APIError {
  constructor(
    message: string,
    public retryAfter?: number
  ) {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}
