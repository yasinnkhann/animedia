export const THE_MOVIE_DB_BASE_API_URL = 'https://api.themoviedb.org/3';

export const THE_MOVIE_DB_BASE_IMG_URL = 'https://image.tmdb.org/t/p/original';

export const IGDB_BASE_API_URL = 'https://api.igdb.com/v4';

export const IGDB_BASE_IMAGE_URL =
	'https://images.igdb.com/igdb/image/upload/t_';

export const __prod__ = process.env.NODE_ENV === 'production';

export const CLIENT_BASE_URL = __prod__
	? 'https://animedia.vercel.app'
	: 'http://localhost:3000';

export const SERVER_BASE_URL = `${CLIENT_BASE_URL}/api/graphql`;

export const RESULTS_PER_PAGE = 20;

export const KNOWN_FOR_MIN_EP_COUNT = 5;

export const KNOWN_FOR_CARDS_LIMIT = 20;

export const VERIFICATION_EMAIL_PREFIX = 'verification-email';

export const FORGOT_PASSWORD_EMAIL_PREFIX = 'forgot-password-email';

export const VERIFICATION_EMAIL_COUNT_PREFIX = 'verification-email-count';

export const FORGOT_PASSWORD_EMAIL_COUNT_PREFIX = 'forgot-password-email-count';

export const IGDB_ACCESS_TOKEN_PREFIX = 'igdb-access-token';

export const VERIFICATION_EMAIL_COUNT_LIMIT = 10;

export const FORGOT_PASSWORD_EMAIL_COUNT_LIMIT = 10;

export const MAX_BIO_WORD_LENGTH = 200;

export const ACCOUNT_NOT_FOUND_MESSAGE = 'Could not find account.';

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

export const MOVIE_GENRES = {
	28: 'ACTION',
	12: 'ADVENTURE',
	16: 'ANIMATION',
	35: 'COMEDY',
	80: 'CRIME',
	99: 'DOCUMENTARY',
	18: 'DRAMA',
	10751: 'FAMILY',
	14: 'FANTASY',
	36: 'HISTORY',
	27: 'HORROR',
	10402: 'MUSIC',
	9648: 'MYSTERY',
	10749: 'ROMANCE',
	878: 'SCIENCE_FICTION',
	10770: 'TV_MOVIE',
	53: 'THRILLER',
	10752: 'WAR',
	37: 'WESTERN',
};

export const SHOW_GENRES = {
	10759: 'ACTION_AND_ADVENTURE',
	16: 'ANIMATION',
	35: 'COMEDY',
	80: 'CRIME',
	99: 'DOCUMENTARY',
	18: 'DRAMA',
	10751: 'FAMILY',
	10762: 'KIDS',
	9648: 'MYSTERY',
	10763: 'NEWS',
	10764: 'REALITY',
	10765: 'SCI_FI_AND_FANTASY',
	10766: 'SOAP',
	10767: 'TALK',
	10768: 'WAR_AND_POLITICS',
	37: 'WESTERN',
};

export const GAME_GENRES = {
	36: 'MOBA',
	2: 'Point_AND_CLICK',
	4: 'FIGHTING',
	5: 'SHOOTING',
	7: 'MUSIC',
	8: 'PLATFORM',
	9: 'PUZZLE',
	10: 'RACING',
	11: 'REAL_TIME_STRATEGY',
	12: 'ROLE_PLAYING',
	13: 'SIMULATOR',
	14: 'SPORT',
	15: 'STRATEGY',
	16: 'TURN_BASED_STRATEGY',
	24: 'TACTICAL',
	25: 'HACK_AND_SLASH_BEAT_EM_UP',
	26: 'QUIZ_TRIVIA',
	30: 'PINBALL',
	31: 'ADVENTURE',
	32: 'INDIE',
	33: 'ARCADE',
	34: 'VISUAL_NOVEL',
	35: 'CARD_AND_BOARD_GAME',
};
