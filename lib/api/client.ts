import { APIError, RetryError, RateLimitError } from './errors';
import logger from '../logger';

export interface FetchOptions extends RequestInit {
	timeout?: number;
	retries?: number;
	retryDelay?: number;
	retryBackoffMultiplier?: number;
	validateStatus?: (status: number) => boolean;
}

export interface APIClientConfig {
	baseURL?: string;
	timeout?: number;
	retries?: number;
	retryDelay?: number;
	retryBackoffMultiplier?: number;
	headers?: Record<string, string>;
}

/**
 * Base HTTP client with retry logic, timeout, and error handling
 */
export class HTTPClient {
	private baseURL: string;
	private defaultTimeout: number;
	private defaultRetries: number;
	private defaultRetryDelay: number;
	private defaultRetryBackoffMultiplier: number;
	private defaultHeaders: Record<string, string>;

	constructor(config: APIClientConfig = {}) {
		this.baseURL = config.baseURL || '';
		this.defaultTimeout = config.timeout || 10000; // 10s default
		this.defaultRetries = config.retries ?? 3;
		this.defaultRetryDelay = config.retryDelay || 1000; // 1s
		this.defaultRetryBackoffMultiplier = config.retryBackoffMultiplier || 2;
		this.defaultHeaders = config.headers || {};
	}

	/**
	 * Perform an HTTP request with retry logic and timeout
	 */
	async fetch<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
		const fullUrl = this.baseURL ? `${this.baseURL}${url}` : url;
		const timeout = options.timeout ?? this.defaultTimeout;
		const retries = options.retries ?? this.defaultRetries;
		const retryDelay = options.retryDelay ?? this.defaultRetryDelay;
		const backoffMultiplier = options.retryBackoffMultiplier ?? this.defaultRetryBackoffMultiplier;
		const validateStatus = options.validateStatus ?? this.defaultValidateStatus;

		const headers = {
			...this.defaultHeaders,
			...options.headers,
		};

		let lastError: Error | null = null;
		let delay = retryDelay;

		for (let attempt = 0; attempt <= retries; attempt++) {
			try {
				const response = await this.fetchWithTimeout(fullUrl, {
					...options,
					headers,
					timeout,
				});

				if (!validateStatus(response.status)) {
					const error = await this.handleErrorResponse(response);
					throw error;
				}

				const data = await this.parseResponse<T>(response);
				return data;
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));

				// Don't retry on validation errors
				if (lastError.name === 'ValidationError') {
					throw lastError;
				}

				// Check for rate limit
				if (lastError instanceof RateLimitError) {
					if (attempt < retries) {
						const waitTime = lastError.retryAfter || delay;
						logger.warn(`Rate limited. Retrying after ${waitTime}ms`, {
							url: fullUrl,
							attempt: attempt + 1,
							totalRetries: retries,
						});
						await this.sleep(waitTime);
						delay = Math.min(delay * backoffMultiplier, 30000); // Cap at 30s
						continue;
					}
				}

				// Retry on network errors
				if (attempt < retries) {
					logger.warn(`Request failed, retrying. Attempt ${attempt + 1}/${retries}`, {
						url: fullUrl,
						error: lastError.message,
					});
					await this.sleep(delay);
					delay = Math.min(delay * backoffMultiplier, 30000); // Cap at 30s
					continue;
				}
			}
		}

		throw new RetryError(
			`Failed to fetch ${fullUrl} after ${retries + 1} attempts`,
			retries + 1,
			lastError
		);
	}

	/**
	 * GET request
	 */
	async get<T = any>(url: string, options?: FetchOptions): Promise<T> {
		return this.fetch<T>(url, { ...options, method: 'GET' });
	}

	/**
	 * POST request
	 */
	async post<T = any>(url: string, body?: any, options?: FetchOptions): Promise<T> {
		return this.fetch<T>(url, {
			...options,
			method: 'POST',
			body: body ? JSON.stringify(body) : undefined,
			headers: {
				'Content-Type': 'application/json',
				...options?.headers,
			},
		});
	}

	/**
	 * PUT request
	 */
	async put<T = any>(url: string, body?: any, options?: FetchOptions): Promise<T> {
		return this.fetch<T>(url, {
			...options,
			method: 'PUT',
			body: body ? JSON.stringify(body) : undefined,
			headers: {
				'Content-Type': 'application/json',
				...options?.headers,
			},
		});
	}

	/**
	 * DELETE request
	 */
	async delete<T = any>(url: string, options?: FetchOptions): Promise<T> {
		return this.fetch<T>(url, { ...options, method: 'DELETE' });
	}

	/**
	 * Perform fetch with timeout
	 */
	private async fetchWithTimeout(url: string, options: FetchOptions): Promise<Response> {
		const timeout = options.timeout || this.defaultTimeout;
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(url, {
				...options,
				signal: controller.signal,
			});
			clearTimeout(timeoutId);
			return response;
		} catch (error) {
			clearTimeout(timeoutId);
			if (error instanceof Error && error.name === 'AbortError') {
				throw new APIError(`Request timeout after ${timeout}ms`, 408);
			}
			throw error;
		}
	}

	/**
	 * Parse response based on content type
	 */
	private async parseResponse<T>(response: Response): Promise<T> {
		const contentType = response.headers.get('content-type');

		if (!contentType) {
			return undefined as unknown as T;
		}

		if (contentType.includes('application/json')) {
			return response.json();
		}

		if (contentType.includes('text')) {
			return response.text() as unknown as T;
		}

		return response.blob() as unknown as T;
	}

	/**
	 * Handle error responses
	 */
	private async handleErrorResponse(response: Response): Promise<Error> {
		let message = `HTTP ${response.status}`;
		let details: Record<string, any> = {};

		try {
			const contentType = response.headers.get('content-type');
			if (contentType?.includes('application/json')) {
				const data = await response.json();
				message = data.message || data.error || message;
				details = data;
			} else {
				const text = await response.text();
				if (text) {
					message = text;
				}
			}
		} catch {
			// Failed to parse error response, use status message
		}

		// Handle rate limiting
		if (response.status === 429) {
			const retryAfter = response.headers.get('retry-after');
			const retryAfterMs = retryAfter ? parseInt(retryAfter) * 1000 : undefined;
			return new RateLimitError(message, retryAfterMs);
		}

		return new APIError(message, response.status, details);
	}

	/**
	 * Default status validation - success is 2xx
	 */
	private defaultValidateStatus = (status: number): boolean => {
		return status >= 200 && status < 300;
	};

	/**
	 * Sleep utility for delays
	 */
	private sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

/**
 * Default HTTP client instance
 */
export const httpClient = new HTTPClient();
