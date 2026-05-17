import { CommonMethods } from '../../utils/CommonMethods';
import { extendType, nonNull, stringArg, intArg, arg, idArg } from 'nexus';
import { tmdbClient } from '@lib/api';
import { safeResolver } from '../utils/resolver-helpers';
import {
	MovieSearchInput,
	MovieDetailsInput,
	PaginationInput,
	parseInput,
} from '../validations/inputs';

export const MovieQueries = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularMovies', {
			type: 'MoviesRes',
			args: {
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				return await tmdbClient.getPopularMovies(validatedPage);
			}),
		});

		t.nonNull.field('searchedMovies', {
			type: 'MoviesRes',
			args: {
				q: nonNull(stringArg()),
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { q, page }) => {
				const input = parseInput(MovieSearchInput, { q, page });
				return await tmdbClient.searchMovies(input.q, input.page);
			}),
		});

		t.nonNull.field('movieDetails', {
			type: 'MovieDetailsRes',
			args: {
				movieDetailsId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { movieDetailsId }) => {
				const input = parseInput(MovieDetailsInput, { movieDetailsId });
				return await tmdbClient.getMovieDetails(input.movieDetailsId);
			}),
		});

		t.nonNull.field('popularAnimeMovies', {
			type: 'MoviesRes',
			args: {
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				const keywordSearchResults = await tmdbClient.searchKeyword('anime');
				const keywordId = keywordSearchResults.results?.[0]?.id;

				if (!keywordId) {
					throw new Error('Anime keyword not found');
				}

				return await tmdbClient.discoverMoviesByKeyword(keywordId, validatedPage);
			}),
		});

		t.nonNull.field('trendingMovies', {
			type: 'MoviesRes',
			args: {
				timeWindow: arg({
					type: nonNull('TimeWindowTypes'),
				}),
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { timeWindow, page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				return await tmdbClient.getTrending('movie', timeWindow as 'day' | 'week', validatedPage);
			}),
		});

		t.nonNull.field('topRatedMovies', {
			type: 'MoviesRes',
			args: {
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				return await tmdbClient.getTopRatedMovies(validatedPage);
			}),
		});

		t.nonNull.field('recommendedMovies', {
			type: 'MoviesRes',
			args: {
				recommendedMoviesId: nonNull(idArg()),
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { recommendedMoviesId, page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				return await tmdbClient.getRecommendedMovies(recommendedMoviesId, validatedPage);
			}),
		});

		t.nonNull.field('movieReviews', {
			type: 'MovieReviewsRes',
			args: {
				id: nonNull(idArg()),
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { id, page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				return await tmdbClient.fetchTMDB(`/movie/${id}/reviews`, { page: validatedPage });
			}),
		});

		t.nonNull.field('moviesInTheatres', {
			type: 'MoviesInTheatresRes',
			args: {
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				return await tmdbClient.fetchPaginated('/movie/now_playing', { page: validatedPage });
			}),
		});

		t.nonNull.field('popularMoviesByGenre', {
			type: 'MoviesRes',
			args: {
				genre: arg({
					type: nonNull('MovieGenreTypes'),
				}),
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { genre, page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				const genreID = await CommonMethods.getGenreID(genre, 'movie');
				return await tmdbClient.fetchPaginated('/discover/movie', {
					page: validatedPage,
					with_genres: genreID,
					sort_by: 'popularity.desc',
				});
			}),
		});

		t.nonNull.field('topRatedMoviesByGenre', {
			type: 'MoviesRes',
			args: {
				genre: arg({
					type: nonNull('MovieGenreTypes'),
				}),
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { genre, page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				const genreID = await CommonMethods.getGenreID(genre, 'movie');
				return await tmdbClient.fetchPaginated('/discover/movie', {
					page: validatedPage,
					with_genres: genreID,
					sort_by: 'vote_average.desc',
					'vote_count.gte': 10,
				});
			}),
		});

		t.field('moviesCastCrew', {
			type: 'MoviesCastCrewRes',
			args: {
				movieId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { movieId }) => {
				return await tmdbClient.getMovieCredits(movieId);
			}),
		});
	},
});
