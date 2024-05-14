import { THE_MOVIE_DB_BASE_URL } from '../../utils/constants';
import { CommonMethods } from '../../utils/CommonMethods';
import { extendType, nonNull, stringArg, intArg, arg, idArg } from 'nexus';

export const MovieQueries = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularMovies', {
			type: 'MoviesRes',
			args: {
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { page }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/movie/popular?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}`
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
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { q, page }) => {
				q = q.split(' ').join('+');
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/search/movie?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&query=${q}&page=${page}`
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
				movieDetailsId: nonNull(idArg()),
			},
			resolve: async (_parent, { movieDetailsId }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/movie/${movieDetailsId}?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US`
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
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { page }) => {
				try {
					const keywordID = await CommonMethods.getKeywordId('anime');

					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/discover/movie?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}&with_keywords=${keywordID}`
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
					type: nonNull('TimeWindowTypes'),
				}),
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { timeWindow, page }) => {
				try {
					const trendingMovies = await CommonMethods.getTrendingMedia(
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
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { page }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/movie/top_rated?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}`
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
				recommendedMoviesId: nonNull(idArg()),
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { recommendedMoviesId, page }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/movie/${recommendedMoviesId}/recommendations?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}`
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
				id: nonNull(idArg()),
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { id, page }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/movie/${id}/reviews?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}`
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
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { page }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/movie/now_playing?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}`
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
					type: nonNull('MovieGenreTypes'),
				}),
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { genre, page }) => {
				try {
					const genreID = await CommonMethods.getGenreID(genre, 'movie');

					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/discover/movie?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}&with_genres=${genreID}&sort_by=popularity.desc`
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
					type: nonNull('MovieGenreTypes'),
				}),
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { genre, page }) => {
				try {
					const genreID = await CommonMethods.getGenreID(genre, 'movie');

					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/discover/movie?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}&with_genres=${genreID}&sort_by=vote_average.desc&vote_count.gte=10`
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
				movieId: nonNull(idArg()),
			},
			resolve: async (_parent, { movieId }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/movie/${movieId}/casts?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US`
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
