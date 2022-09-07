export const BASE_URL = 'https://api.themoviedb.org/3';

export const BASE_IMG_URL = 'https://image.tmdb.org/t/p/original';

export const CLIENT_BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://animedia.vercel.app'
		: 'http://localhost:3000';

export const SERVER_BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://animedia.vercel.app/api/graphql'
		: 'http://localhost:3000/api/graphql';
