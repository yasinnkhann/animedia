export const THE_MOVIE_DB_BASE_API_URL = 'https://api.themoviedb.org/3';

export const THE_MOVIE_DB_BASE_IMG_URL = 'https://image.tmdb.org/t/p/original';

export const IGDB_BASE_API_URL = 'https://api.igdb.com/v4';

export const IGDB_BASE_IMAGE_URL = 'https://images.igdb.com/igdb/image/upload/t_';

export const __prod__ = process.env.NODE_ENV === 'production';

export const CLIENT_BASE_URL = __prod__ ? 'https://animedia.vercel.app' : 'http://localhost:3000';

export const SERVER_BASE_URL = `${CLIENT_BASE_URL}/api/graphql`;

export const RESULTS_PER_PAGE = 20;

export const KNOWN_FOR_MIN_EP_COUNT = 5;

export const KNOWN_FOR_CARDS_LIMIT = 20;

export const RESULTS_PER_EPISODES_SLIDER = 20;

export const VERIFICATION_EMAIL_PREFIX = 'verification-email';

export const FORGOT_PASSWORD_EMAIL_PREFIX = 'forgot-password-email';

export const VERIFICATION_EMAIL_COUNT_PREFIX = 'verification-email-count';

export const FORGOT_PASSWORD_EMAIL_COUNT_PREFIX = 'forgot-password-email-count';

export const IGDB_ACCESS_TOKEN_PREFIX = 'igdb-access-token';

export const VERIFICATION_EMAIL_COUNT_LIMIT = 10;

export const FORGOT_PASSWORD_EMAIL_COUNT_LIMIT = 10;

export const MAX_SUMMARY_WORD_LENGTH = 300;

export const ACCOUNT_NOT_FOUND_MESSAGE = 'Could not find account.';

export const REDIS_MB_THRESHOLD = 25;

export const REDIS_KEYS = [
	VERIFICATION_EMAIL_COUNT_PREFIX,
	VERIFICATION_EMAIL_PREFIX,
	FORGOT_PASSWORD_EMAIL_COUNT_PREFIX,
	FORGOT_PASSWORD_EMAIL_PREFIX,
] as const;

export const REDIS_EXP_MAP: Record<(typeof REDIS_KEYS)[number], number> = {
	[VERIFICATION_EMAIL_COUNT_PREFIX]: 60 * 60 * 24,
	[VERIFICATION_EMAIL_PREFIX]: 60 * 60 * 24 * 3,
	[FORGOT_PASSWORD_EMAIL_COUNT_PREFIX]: 60 * 60 * 24,
	[FORGOT_PASSWORD_EMAIL_PREFIX]: 60 * 60 * 24 * 3,
};
