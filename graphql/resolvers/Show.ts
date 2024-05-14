import { THE_MOVIE_DB_BASE_URL } from '../../utils/constants';
import { CommonMethods } from '../../utils/CommonMethods';
import { extendType, nonNull, stringArg, intArg, arg, idArg } from 'nexus';

export const ShowQueries = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularShows', {
			type: 'ShowsRes',
			args: {
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { page }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/tv/popular?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});

		t.nonNull.field('searchedShows', {
			type: 'ShowsRes',
			args: {
				q: nonNull(stringArg()),
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { q, page }) => {
				q = q.split(' ').join('+');
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/search/tv?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}&query=${q}`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});

		t.nonNull.field('showDetails', {
			type: 'ShowDetailsRes',
			args: {
				showDetailsId: nonNull(idArg()),
			},
			resolve: async (_parent, { showDetailsId }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/tv/${showDetailsId}?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});

		t.nonNull.field('popularAnimeShows', {
			type: 'ShowsRes',
			args: {
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { page }) => {
				try {
					const keywordID = await CommonMethods.getKeywordId('anime');

					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/discover/tv?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}&with_keywords=${keywordID}`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});

		t.nonNull.field('trendingShows', {
			type: 'ShowsRes',
			args: {
				timeWindow: arg({
					type: nonNull('TimeWindowTypes'),
				}),
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { timeWindow, page }) => {
				const trendingMovies = await CommonMethods.getTrendingMedia(
					'tv',
					timeWindow,
					page
				);
				return trendingMovies;
			},
		});

		t.nonNull.field('topRatedShows', {
			type: 'ShowsRes',
			args: {
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { page }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/tv/top_rated?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});

		t.nonNull.field('recommendedShows', {
			type: 'ShowsRes',
			args: {
				recommendedShowsId: nonNull(idArg()),
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { recommendedShowsId, page }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/tv/${recommendedShowsId}/recommendations?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});

		t.nonNull.field('showReviews', {
			type: 'ShowReviewRes',
			args: {
				id: nonNull(idArg()),
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { id, page }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/tv/${id}/reviews?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});

		t.nonNull.field('popularShowsByGenre', {
			type: 'ShowsRes',
			args: {
				genre: arg({
					type: nonNull('ShowGenreTypes'),
				}),
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { genre, page }) => {
				try {
					const genreID = await CommonMethods.getGenreID(genre, 'tv');

					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/discover/tv?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}&with_genres=${genreID}&sort_by=popularity.desc`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});

		t.nonNull.field('topRatedShowsByGenre', {
			type: 'ShowsRes',
			args: {
				genre: arg({
					type: nonNull('ShowGenreTypes'),
				}),
				page: intArg({ default: 1 }),
			},
			resolve: async (_parent, { genre, page }) => {
				try {
					const genreID = await CommonMethods.getGenreID(genre, 'tv');

					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/discover/tv?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${page}&with_genres=${genreID}&sort_by=vote_average.desc&vote_count.gte=10`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});

		t.field('showsCastCrew', {
			type: 'ShowsCastCrewRes',
			args: {
				showId: nonNull(idArg()),
			},
			resolve: async (_parent, { showId }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/tv/${showId}/credits?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US`
					);
					const data = await res.json();
					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});

		t.field('episodeDetails', {
			type: 'EpisodeDetailsRes',
			args: {
				showId: nonNull(idArg()),
				seasonNum: nonNull(intArg()),
				episodeNum: nonNull(intArg()),
			},
			resolve: async (_parent, { showId, seasonNum, episodeNum }) => {
				try {
					const res = await fetch(
						`${THE_MOVIE_DB_BASE_URL}/tv/${showId}/season/${seasonNum}/episode/${episodeNum}?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US`
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
