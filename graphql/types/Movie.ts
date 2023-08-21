import { BASE_URL } from '../../utils/constants';
import { getKeywordId } from '../../utils/getkeywordID';
import { GET_TRENDING_MEDIA } from '../../utils/getTrendingMedia';
import { GET_GENRE_ID } from '../../utils/getGenreID';
import { timeWindowTypes } from '../models/enums';
import {
	objectType,
	extendType,
	nonNull,
	stringArg,
	intArg,
	enumType,
	arg,
} from 'nexus';

export const MovieGenreTypes = enumType({
	name: 'MovieGenreTypes',
	members: [
		'Action',
		'Adventure',
		'Animation',
		'Comedy',
		'Crime',
		'Documentary',
		'Drama',
		'Family',
		'Fantasy',
		'History',
		'Horror',
		'Music',
		'Mystery',
		'Romance',
		'Science_Fiction',
		'TV_Movie',
		'Thriller',
		'War',
		'Western',
	],
});

export const MovieResult = objectType({
	name: 'MovieResult',
	definition(t) {
		t.nonNull.boolean('adult');
		t.string('backdrop_path');
		t.nonNull.list.int('genre_ids');
		t.nonNull.int('id');
		t.nonNull.string('original_language');
		t.nonNull.string('original_title');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.string('poster_path');
		t.string('release_date');
		t.nonNull.string('title');
		t.nonNull.boolean('video');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const MoviesRes = objectType({
	name: 'MoviesRes',
	definition(t) {
		t.nonNull.int('page');
		t.nonNull.int('total_pages');
		t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: nonNull('MovieResult'),
		});
	},
});

export const MovieDetailsGenre = objectType({
	name: 'MovieDetailsGenre',
	definition(t) {
		t.nonNull.int('id');
		t.nonNull.string('name');
	},
});

export const MovieDetailsProdCompany = objectType({
	name: 'MovieDetailsProdCompany',
	definition(t) {
		t.nonNull.int('id');
		t.string('logo_path');
		t.nonNull.string('name');
		t.nonNull.string('origin_country');
	},
});

export const MovieDetailsProdCountry = objectType({
	name: 'MovieDetailsProdCountry',
	definition(t) {
		t.nonNull.string('iso_3166_1');
		t.nonNull.string('name');
	},
});

export const MovieDetailsSpokenLang = objectType({
	name: 'MovieDetailsSpokenLang',
	definition(t) {
		t.nonNull.string('english_name');
		t.nonNull.string('iso_639_1');
		t.nonNull.string('name');
	},
});

export const MovieDetailsRes = objectType({
	name: 'MovieDetailsRes',
	definition(t) {
		t.nonNull.boolean('adult');
		t.string('backdrop_path');
		t.nonNull.list.field('genres', {
			type: nonNull('MovieDetailsGenre'),
		});
		t.nonNull.string('homepage');
		t.nonNull.int('id');
		t.string('imdb_id');
		t.nonNull.string('original_language');
		t.nonNull.string('original_title');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.string('poster_path');
		t.nonNull.list.field('production_companies', {
			type: 'MovieDetailsProdCompany',
		});
		t.nonNull.list.field('production_countries', {
			type: 'MovieDetailsProdCountry',
		});
		t.string('release_date');
		t.bigint('revenue');
		t.int('runtime');
		t.nonNull.list.field('spoken_languages', {
			type: 'MovieDetailsSpokenLang',
		});
		t.nonNull.string('status');
		t.nonNull.string('tagline');
		t.nonNull.string('title');
		t.boolean('video');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const MovieReviewAuthorDetails = objectType({
	name: 'MovieReviewAuthorDetails',
	definition(t) {
		t.nonNull.string('name');
		t.nonNull.string('username');
		t.string('avatar_path');
		t.float('rating');
	},
});

export const MovieReviewsResult = objectType({
	name: 'MovieReviewsResult',
	definition(t) {
		t.nonNull.string('author');
		t.nonNull.field('author_details', {
			type: 'MovieReviewAuthorDetails',
		});
		t.nonNull.string('content');
		t.nonNull.string('created_at');
		t.nonNull.string('id');
		t.nonNull.string('updated_at');
		t.nonNull.string('url');
	},
});

export const MovieReviewsRes = objectType({
	name: 'MovieReviewsRes',
	definition(t) {
		t.nonNull.int('id'),
			t.nonNull.int('page'),
			t.nonNull.int('total_pages'),
			t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: 'MovieReviewsResult',
		});
	},
});

export const TheatreDates = objectType({
	name: 'TheatreDates',
	definition(t) {
		t.nonNull.string('maximum');
		t.nonNull.string('minimum');
	},
});

export const MoviesInTheatresRes = objectType({
	name: 'MoviesInTheatresRes',
	definition(t) {
		t.nonNull.field('dates', {
			type: 'TheatreDates',
		});
		t.nonNull.string('page');
		t.nonNull.int('total_pages');
		t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: 'MovieResult',
		});
	},
});

export const MoviesCastModel = objectType({
	name: 'MoviesCastModel',
	definition(t) {
		t.boolean('adult');
		t.int('gender');
		t.int('id');
		t.string('known_for_department');
		t.string('name');
		t.string('original_name');
		t.float('popularity');
		t.string('profile_path');
		t.int('cast_id');
		t.string('character');
		t.string('credit_id');
		t.int('order');
	},
});

export const MoviesCrewModel = objectType({
	name: 'MoviesCrewModel',
	definition(t) {
		t.boolean('adult');
		t.int('gender');
		t.int('id');
		t.string('known_for_department');
		t.string('name');
		t.string('original_name');
		t.float('popularity');
		t.string('profile_path');
		t.string('credit_id');
		t.string('department');
		t.string('job');
	},
});

export const MoviesCastCrewRes = objectType({
	name: 'MoviesCastCrewRes',
	definition(t) {
		t.int('id');
		t.list.field('cast', {
			type: 'MoviesCastModel',
		});
		t.list.field('crew', {
			type: 'MoviesCrewModel',
		});
	},
});

export const MovieQueries = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularMovies', {
			type: 'MoviesRes',
			args: {
				page: intArg(),
			},
			resolve: async (_parent, { page }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/movie/popular?api_key=${process.env
							.API_KEY!}&language=en-US&page=${page ?? 1}`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('searchedMovies', {
			type: 'MoviesRes',
			args: {
				q: nonNull(stringArg()),
				page: intArg(),
			},
			resolve: async (_parent, { q, page }) => {
				q = q.split(' ').join('+');
				try {
					const res = await fetch(
						`${BASE_URL}/search/movie?api_key=${process.env
							.API_KEY!}&language=en-US&query=${q}&page=${page ?? 1}`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('movieDetails', {
			type: 'MovieDetailsRes',
			args: {
				movieDetailsId: nonNull(intArg()),
			},
			resolve: async (_parent, { movieDetailsId }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/movie/${movieDetailsId}?api_key=${process.env
							.API_KEY!}&language=en-US`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('popularAnimeMovies', {
			type: 'MoviesRes',
			args: {
				page: intArg(),
			},
			resolve: async (_parent, { page }) => {
				try {
					const keywordID = await getKeywordId('anime');

					const res = await fetch(
						`${BASE_URL}/discover/movie?api_key=${process.env
							.API_KEY!}&language=en-US&sort_by=popularity.desc&page=${
							page ?? 1
						}&with_keywords=${keywordID}`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('trendingMovies', {
			type: 'MoviesRes',
			args: {
				timeWindow: arg({
					type: nonNull(timeWindowTypes),
				}),
				page: intArg(),
			},
			resolve: async (_parent, { timeWindow, page }) => {
				try {
					const trendingMovies = await GET_TRENDING_MEDIA(
						'movie',
						timeWindow,
						page
					);
					return trendingMovies;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('topRatedMovies', {
			type: 'MoviesRes',
			args: {
				page: intArg(),
			},
			resolve: async (_parent, { page }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/movie/top_rated?api_key=${process.env
							.API_KEY!}&language=en-US&page=${page ?? 1}`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('recommendedMovies', {
			type: 'MoviesRes',
			args: {
				recommendedMoviesId: nonNull(intArg()),
				page: intArg(),
			},
			resolve: async (_parent, { recommendedMoviesId, page }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/movie/${recommendedMoviesId}/recommendations?api_key=${process
							.env.API_KEY!}&language=en-US&page=${page ?? 1}`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('movieReviews', {
			type: 'MovieReviewsRes',
			args: {
				id: nonNull(intArg()),
				page: intArg(),
			},
			resolve: async (_parent, { id, page }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/movie/${id}/reviews?api_key=${process.env
							.API_KEY!}&language=en-US&page=${page ?? 1}`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('moviesInTheatres', {
			type: 'MoviesInTheatresRes',
			args: {
				page: intArg(),
			},
			resolve: async (_parent, { page }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/movie/now_playing?api_key=${process.env
							.API_KEY!}&language=en-US&page=${page ?? 1}`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('popularMoviesByGenre', {
			type: 'MoviesRes',
			args: {
				genre: arg({
					type: nonNull(MovieGenreTypes),
				}),
				page: intArg(),
			},
			resolve: async (_parent, { genre, page }) => {
				try {
					const genreID = await GET_GENRE_ID(genre, 'movie');

					const res = await fetch(
						`${BASE_URL}/discover/movie?api_key=${process.env
							.API_KEY!}&language=en-US&page=${
							page ?? 1
						}&with_genres=${genreID}&sort_by=popularity.desc`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('topRatedMoviesByGenre', {
			type: 'MoviesRes',
			args: {
				genre: arg({
					type: nonNull(MovieGenreTypes),
				}),
				page: intArg(),
			},
			resolve: async (_parent, { genre, page }) => {
				try {
					const genreID = await GET_GENRE_ID(genre, 'movie');

					const res = await fetch(
						`${BASE_URL}/discover/movie?api_key=${process.env
							.API_KEY!}&language=en-US&page=${
							page ?? 1
						}&with_genres=${genreID}&sort_by=vote_average.desc&vote_count.gte=10`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.field('moviesCastCrew', {
			type: 'MoviesCastCrewRes',
			args: {
				movieId: nonNull(intArg()),
			},
			resolve: async (_parent, { movieId }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/movie/${movieId}/casts?api_key=${process.env
							.API_KEY!}&language=en-US`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});
	},
});
