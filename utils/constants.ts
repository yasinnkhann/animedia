export const BASE_URL = 'https://api.themoviedb.org/3';

export const BASE_IMG_URL = 'https://image.tmdb.org/t/p/original';

export const __prod__ = process.env.NODE_ENV === 'production';

export const CLIENT_BASE_URL = __prod__
	? 'https://animedia.vercel.app'
	: 'http://localhost:3000';

export const SERVER_BASE_URL = `${CLIENT_BASE_URL}/api/graphql`;

export const RESULTS_PER_PAGE = 20;

export const KNOWN_FOR_MIN_EP_COUNT = 5;

export const KNOWN_FOR_CARDS_LIMIT = 20;

export const EMAIL_VERIFICATION_PREFIX = 'email-verification';

export const VERIFICATION_EMAIL_COUNT_PREFIX = 'retry-email-verification-count';

export const VERIFICATION_EMAIL_COUNT_LIMIT = 10;

export const REDIS_KEYS = [
	EMAIL_VERIFICATION_PREFIX,
	VERIFICATION_EMAIL_COUNT_PREFIX,
] as const;

export const REDIS_MAP: Record<(typeof REDIS_KEYS)[number], number> = {
	[VERIFICATION_EMAIL_COUNT_PREFIX]: 60 * 60 * 24,
	[EMAIL_VERIFICATION_PREFIX]: 60 * 60 * 24 * 3,
};
