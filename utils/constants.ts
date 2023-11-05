export const BASE_URL = 'https://api.themoviedb.org/3';

export const BASE_IMG_URL = 'https://image.tmdb.org/t/p/original';

export const CLIENT_BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://animedia.vercel.app'
		: 'http://localhost:3000';

export const SERVER_BASE_URL = `${CLIENT_BASE_URL}/api/graphql`;

export const RESULTS_PER_PAGE = 20;

export const KNOWN_FOR_MIN_EP_COUNT = 5;

export const KNOWN_FOR_CARDS_LIMIT = 20;

export const EMAIL_VERIFICATION_PREFIX = 'email-verification';

export const RETRY_EMAIL_VERIFICATION_PREFIX = 'retry-email-verification';
