import { objectType, extendType, nonNull, stringArg, intArg } from 'nexus';
import axios from 'axios';
import { BASE_URL } from '../../utils/URLs';
import { GET_KEYWORD_ID } from '../../utils/getkeywordID';
import { GET_TRENDING_MEDIA } from '../../utils/getTrendingMedia';
import { GET_GENRE_ID } from '../../utils/getGenreID';
import 'dotenv/config';

export const MovieResults = objectType({
	name: 'MovieResult',
	definition(t) {
		t.nonNull.boolean('adult');
		t.nonNull.string('backdrop_path');
		t.nonNull.list.int('genre_ids');
		t.nonNull.int('id');
		t.nonNull.string('original_language');
		t.nonNull.string('original_title');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.nonNull.string('poster_path');
		t.nonNull.string('release_date');
		t.nonNull.string('title');
		t.nonNull.boolean('video');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const Movie = objectType({
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
			resolve: async () => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/popular?api_key=${process.env
						.API_KEY!}&language=en-US`
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
			},
			resolve: async (_parent, { q }) => {
				q = q.split(' ').join('+');
				const { data } = await axios.get(
					`${BASE_URL}/search/movie?api_key=${process.env.API_KEY!}&query=${q}`
				);

				return data;
			},
		});
	},
});

export const movieDetailsGenre = objectType({
	name: 'movieDetailsGenre',
	definition(t) {
		t.nonNull.int('id');
		t.nonNull.string('name');
	},
});

export const movieDetailsProdCompany = objectType({
	name: 'movieDetailsProdCompany',
	definition(t) {
		t.nonNull.int('id');
		t.string('logo_path');
		t.nonNull.string('name');
		t.nonNull.string('origin_country');
	},
});

export const movieDetailsProdCountry = objectType({
	name: 'movieDetailsProdCountry',
	definition(t) {
		t.nonNull.string('iso_3166_1');
		t.nonNull.string('name');
	},
});

export const movieDetailsSpokenLang = objectType({
	name: 'movieDetailsSpokenLang',
	definition(t) {
		t.nonNull.string('english_name');
		t.nonNull.string('iso_639_1');
		t.nonNull.string('name');
	},
});

export const movieDetails = objectType({
	name: 'movieDetailsRes',
	definition(t) {
		t.nonNull.boolean('adult');
		t.nonNull.string('backdrop_path');
		t.nonNull.list.field('genres', {
			type: nonNull('movieDetailsGenre'),
		});
		t.nonNull.string('homepage');
		t.nonNull.int('id');
		t.nonNull.string('imdb_id');
		t.nonNull.string('original_language');
		t.nonNull.string('original_title');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.nonNull.string('poster_path');
		t.nonNull.list.field('production_companies', {
			type: 'movieDetailsProdCompany',
		});
		t.nonNull.list.field('production_countries', {
			type: 'movieDetailsProdCountry',
		});
		t.nonNull.string('release_date');
		t.nonNull.int('revenue');
		t.nonNull.int('runtime');
		t.nonNull.list.field('spoken_languages', {
			type: 'movieDetailsSpokenLang',
		});
		t.nonNull.string('status');
		t.nonNull.string('tagline');
		t.nonNull.string('title');
		t.nonNull.boolean('video');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const getMovieDetails = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('movieDetails', {
			type: 'movieDetailsRes',
			args: {
				id: nonNull(intArg()),
			},
			resolve: async (_parent, { id }) => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/${id}?api_key=${process.env
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
			resolve: async () => {
				const keywordID = await GET_KEYWORD_ID('anime');

				const { data } = await axios.get(
					`${BASE_URL}/discover/movie?api_key=${process.env
						.API_KEY!}&language=en-US&sort_by=popularity.desc&page=1&with_keywords=${keywordID}`
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
			resolve: async () => {
				const trendingMovies = await GET_TRENDING_MEDIA('movie', 'day');
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
			resolve: async () => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/top_rated?api_key=${process.env
						.API_KEY!}&language=en-US&page=1`
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
				id: nonNull(intArg()),
			},
			resolve: async (_parent, { id }) => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/${id}/recommendations?api_key=${process.env
						.API_KEY!}&language=en-US&page=1`
				);
				return data;
			},
		});
	},
});

export const movieReviewAuthorDetails = objectType({
	name: 'movieReviewAuthorDetails',
	definition(t) {
		t.nonNull.string('name');
		t.nonNull.string('username');
		t.string('avatar_path');
		t.float('rating');
	},
});

export const movieReviewResult = objectType({
	name: 'movieReviewResult',
	definition(t) {
		t.nonNull.string('author');
		t.nonNull.field('author_details', {
			type: 'movieReviewAuthorDetails',
		});
		t.nonNull.string('content');
		t.nonNull.string('created_at');
		t.nonNull.string('id');
		t.nonNull.string('updated_at');
		t.nonNull.string('url');
	},
});

export const movieReview = objectType({
	name: 'movieReviewRes',
	definition(t) {
		t.nonNull.int('id'),
			t.nonNull.int('page'),
			t.nonNull.int('total_pages'),
			t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: 'movieReviewResult',
		});
	},
});

export const getMovieReviews = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('movieReviews', {
			type: 'movieReviewRes',
			args: {
				id: nonNull(intArg()),
			},
			resolve: async (_parent, { id }) => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/${id}/reviews?api_key=${process.env
						.API_KEY!}&language=en-US&page=1`
				);
				return data;
			},
		});
	},
});

export const theatreDates = objectType({
	name: 'theatreDates',
	definition(t) {
		t.nonNull.string('maximum');
		t.nonNull.string('minimum');
	},
});

export const moviesInTheatres = objectType({
	name: 'moviesInTheatresRes',
	definition(t) {
		t.nonNull.field('dates', {
			type: 'theatreDates',
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
			type: 'moviesInTheatresRes',
			resolve: async () => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/now_playing?api_key=${process.env
						.API_KEY!}&language=en-US&page=1`
				);
				return data;
			},
		});
	},
});

export const getPopularMoviesByGenre = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularMoviesByGenre', {
			type: 'MoviesRes',
			args: {
				genre: nonNull(stringArg()),
				mediaType: nonNull(stringArg()),
			},
			resolve: async (_parent, { genre, mediaType }) => {
				const genreID = await GET_GENRE_ID(genre, mediaType);
				const { data } = await axios.get(
					`${BASE_URL}/discover/${mediaType}?api_key=${process.env
						.API_KEY!}&language=en-US&with_genres=${genreID}&sort_by=popularity.desc`
				);

				return data;
			},
		});
	},
});
