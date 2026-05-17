import { CommonMethods } from '../../utils/CommonMethods';
import { extendType, nonNull, stringArg, intArg, arg, idArg } from 'nexus';
import { tmdbClient } from '@lib/api';
import { safeResolver } from '../utils/resolver-helpers';
import {
	PaginationInput,
	ShowDetailsInput,
	ShowSearchInput,
	parseInput,
} from '../validations/inputs';

export const ShowQueries = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularShows', {
			type: 'ShowsRes',
			args: {
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				return await tmdbClient.getPopularShows(validatedPage);
			}),
		});

		t.nonNull.field('searchedShows', {
			type: 'ShowsRes',
			args: {
				q: nonNull(stringArg()),
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { q, page }) => {
				const input = parseInput(ShowSearchInput, { q, page });
				return await tmdbClient.searchShows(input.q, input.page);
			}),
		});

		t.nonNull.field('showDetails', {
			type: 'ShowDetailsRes',
			args: {
				showDetailsId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { showDetailsId }) => {
				const input = parseInput(ShowDetailsInput, { showDetailsId });
				return await tmdbClient.getShowDetails(input.showDetailsId);
			}),
		});

		t.nonNull.field('popularAnimeShows', {
			type: 'ShowsRes',
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

				return await tmdbClient.discoverShowsByKeyword(keywordId, validatedPage);
			}),
		});

		t.nonNull.field('trendingShows', {
			type: 'ShowsRes',
			args: {
				timeWindow: arg({
					type: nonNull('TimeWindowTypes'),
				}),
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { timeWindow, page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				return await tmdbClient.getTrending('tv', timeWindow as 'day' | 'week', validatedPage);
			}),
		});

		t.nonNull.field('topRatedShows', {
			type: 'ShowsRes',
			args: {
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				return await tmdbClient.getTopRatedShows(validatedPage);
			}),
		});

		t.nonNull.field('recommendedShows', {
			type: 'ShowsRes',
			args: {
				recommendedShowsId: nonNull(idArg()),
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { recommendedShowsId, page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				return await tmdbClient.getRecommendedShows(recommendedShowsId, validatedPage);
			}),
		});

		t.nonNull.field('showReviews', {
			type: 'ShowReviewRes',
			args: {
				id: nonNull(idArg()),
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { id, page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				return await tmdbClient.fetchTMDB(`/tv/${id}/reviews`, { page: validatedPage });
			}),
		});

		t.nonNull.field('popularShowsByGenre', {
			type: 'ShowsRes',
			args: {
				genre: arg({
					type: nonNull('ShowGenreTypes'),
				}),
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { genre, page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				const genreID = await CommonMethods.getGenreID(genre, 'tv');
				return await tmdbClient.fetchPaginated('/discover/tv', {
					page: validatedPage,
					with_genres: genreID,
					sort_by: 'popularity.desc',
				});
			}),
		});

		t.nonNull.field('topRatedShowsByGenre', {
			type: 'ShowsRes',
			args: {
				genre: arg({
					type: nonNull('ShowGenreTypes'),
				}),
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { genre, page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				const genreID = await CommonMethods.getGenreID(genre, 'tv');
				return await tmdbClient.fetchPaginated('/discover/tv', {
					page: validatedPage,
					with_genres: genreID,
					sort_by: 'vote_average.desc',
					'vote_count.gte': 10,
				});
			}),
		});

		t.field('showsCastCrew', {
			type: 'ShowsCastCrewRes',
			args: {
				showId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { showId }) => {
				return await tmdbClient.getShowCredits(showId);
			}),
		});

		t.field('episodeDetails', {
			type: 'EpisodeDetailsRes',
			args: {
				showId: nonNull(idArg()),
				seasonNum: nonNull(intArg()),
				episodeNum: nonNull(intArg()),
			},
			resolve: safeResolver(async (_parent, { showId, seasonNum, episodeNum }) => {
				return await tmdbClient.getEpisodeDetails(showId, seasonNum, episodeNum);
			}),
		});
	},
});
