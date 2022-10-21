import {
	objectType,
	extendType,
	nonNull,
	stringArg,
	intArg,
	enumType,
	arg,
} from 'nexus';
import axios from 'axios';
import { BASE_URL } from '../../utils/URLs';
import { GET_KEYWORD_ID } from '../../utils/getkeywordID';
import { GET_TRENDING_MEDIA } from '../../utils/getTrendingMedia';
import { GET_GENRE_ID } from '../../utils/getGenreID';
import { timeWindowTypes } from '../models/enums';

export const movieResult = objectType({
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

export const movie = objectType({
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

export const getPopularMovies = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularMovies', {
			type: 'MoviesRes',
			args: {
				page: intArg(),
			},
			resolve: async (_parent, { page }) => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/popular?api_key=${process.env
						.API_KEY!}&language=en-US&page=${page ?? 1}`
				);

				return data;
			},
		});
	},
});

export const getSearchedMovies = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('searchedMovies', {
			type: 'MoviesRes',
			args: {
				q: nonNull(stringArg()),
				page: intArg(),
			},
			resolve: async (_parent, { q, page }) => {
				q = q.split(' ').join('+');
				const { data } = await axios.get(
					`${BASE_URL}/search/movie?api_key=${process.env
						.API_KEY!}&language=en-US&query=${q}&page=${page ?? 1}`
				);

				return data;
			},
		});
	},
});

export const movieDetailsGenre = objectType({
	name: 'MovieDetailsGenre',
	definition(t) {
		t.nonNull.int('id');
		t.nonNull.string('name');
	},
});

export const movieDetailsProdCompany = objectType({
	name: 'MovieDetailsProdCompany',
	definition(t) {
		t.nonNull.int('id');
		t.string('logo_path');
		t.nonNull.string('name');
		t.nonNull.string('origin_country');
	},
});

export const movieDetailsProdCountry = objectType({
	name: 'MovieDetailsProdCountry',
	definition(t) {
		t.nonNull.string('iso_3166_1');
		t.nonNull.string('name');
	},
});

export const movieDetailsSpokenLang = objectType({
	name: 'MovieDetailsSpokenLang',
	definition(t) {
		t.nonNull.string('english_name');
		t.nonNull.string('iso_639_1');
		t.nonNull.string('name');
	},
});

export const movieDetails = objectType({
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

export const getMovieDetails = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('movieDetails', {
			type: 'MovieDetailsRes',
			args: {
				movieDetailsId: nonNull(intArg()),
			},
			resolve: async (_parent, { movieDetailsId }) => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/${movieDetailsId}?api_key=${process.env
						.API_KEY!}&language=en-US`
				);
				return data;
			},
		});
	},
});

export const getPopularAnimeMovies = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularAnimeMovies', {
			type: 'MoviesRes',
			args: {
				page: intArg(),
			},
			resolve: async (_parent, { page }) => {
				const keywordID = await GET_KEYWORD_ID('anime');

				const { data } = await axios.get(
					`${BASE_URL}/discover/movie?api_key=${process.env
						.API_KEY!}&language=en-US&sort_by=popularity.desc&page=${
						page ?? 1
					}&with_keywords=${keywordID}`
				);

				return data;
			},
		});
	},
});

export const getTrendingMovies = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('trendingMovies', {
			type: 'MoviesRes',
			args: {
				timeWindow: arg({
					type: nonNull(timeWindowTypes),
				}),
				page: intArg(),
			},
			resolve: async (_parent, { timeWindow, page }) => {
				const trendingMovies = await GET_TRENDING_MEDIA(
					'movie',
					timeWindow,
					page
				);
				return trendingMovies;
			},
		});
	},
});

export const getTopRatedMovies = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('topRatedMovies', {
			type: 'MoviesRes',
			args: {
				page: intArg(),
			},
			resolve: async (_parent, { page }) => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/top_rated?api_key=${process.env
						.API_KEY!}&language=en-US&page=${page ?? 1}`
				);
				return data;
			},
		});
	},
});

export const getRecommendedMovies = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('recommendedMovies', {
			type: 'MoviesRes',
			args: {
				recommendedMoviesId: nonNull(intArg()),
				page: intArg(),
			},
			resolve: async (_parent, { recommendedMoviesId, page }) => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/${recommendedMoviesId}/recommendations?api_key=${process
						.env.API_KEY!}&language=en-US&page=${page ?? 1}`
				);
				return data;
			},
		});
	},
});

export const movieReviewAuthorDetails = objectType({
	name: 'MovieReviewAuthorDetails',
	definition(t) {
		t.nonNull.string('name');
		t.nonNull.string('username');
		t.string('avatar_path');
		t.float('rating');
	},
});

export const movieReviewsResult = objectType({
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

export const movieReview = objectType({
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

export const getMovieReviews = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('movieReviews', {
			type: 'MovieReviewsRes',
			args: {
				id: nonNull(intArg()),
				page: intArg(),
			},
			resolve: async (_parent, { id, page }) => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/${id}/reviews?api_key=${process.env
						.API_KEY!}&language=en-US&page=${page ?? 1}`
				);
				return data;
			},
		});
	},
});

export const theatreDates = objectType({
	name: 'TheatreDates',
	definition(t) {
		t.nonNull.string('maximum');
		t.nonNull.string('minimum');
	},
});

export const moviesInTheatres = objectType({
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

export const getMoviesInTheatres = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('moviesInTheatres', {
			type: 'MoviesInTheatresRes',
			args: {
				page: intArg(),
			},
			resolve: async (_parent, { page }) => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/now_playing?api_key=${process.env
						.API_KEY!}&language=en-US&page=${page ?? 1}`
				);
				return data;
			},
		});
	},
});

export const movieGenreTypes = enumType({
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
		'Science',
		'TV',
		'Thriller',
		'War',
		'Western',
	],
});

export const getPopularMoviesByGenre = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularMoviesByGenre', {
			type: 'MoviesRes',
			args: {
				genre: arg({
					type: nonNull(movieGenreTypes),
				}),
				page: intArg(),
			},
			resolve: async (_parent, { genre, page }) => {
				const genreID = await GET_GENRE_ID(genre, 'movie');
				const { data } = await axios.get(
					`${BASE_URL}/discover/movie?api_key=${process.env
						.API_KEY!}&language=en-US&page=${
						page ?? 1
					}&with_genres=${genreID}&sort_by=popularity.desc`
				);

				return data;
			},
		});
	},
});

export const getTopRatedMoviesByGenre = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('topRatedMoviesByGenre', {
			type: 'MoviesRes',
			args: {
				genre: arg({
					type: nonNull(movieGenreTypes),
				}),
				page: intArg(),
			},
			resolve: async (_parent, { genre, page }) => {
				const genreID = await GET_GENRE_ID(genre, 'movie');
				const { data } = await axios.get(
					`${BASE_URL}/discover/movie?api_key=${process.env
						.API_KEY!}&language=en-US&page=${
						page ?? 1
					}&with_genres=${genreID}&sort_by=vote_average.desc&vote_count.gte=10`
				);

				return data;
			},
		});
	},
});

//!
export const moviesCastModel = objectType({
	name: 'MoviesCastModel',
	definition(t) {
		t.boolean('adult');
		t.int('gender');
		t.nonNull.int('id');
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

export const moviesCrewModel = objectType({
	name: 'MoviesCrewModel',
	definition(t) {
		t.boolean('adult');
		t.int('gender');
		t.nonNull.int('id');
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

export const moviesCastCrewRes = objectType({
	name: 'MoviesCastCrewRes',
	definition(t) {
		t.nonNull.int('id');
		t.nonNull.list.field('cast', {
			type: 'MoviesCastModel',
		});
		t.nonNull.list.field('crew', {
			type: 'MoviesCrewModel',
		});
	},
});

export const getMoviesCastCrew = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('moviesCastCrew', {
			type: 'MoviesCastCrewRes',
			args: {
				movieId: nonNull(intArg()),
			},
			resolve: async (_parent, { movieId }) => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/${movieId}/casts?api_key=${process.env
						.API_KEY!}&language=en-US`
				);

				return data;
			},
		});
	},
});
