import { BASE_URL } from '../../utils/constants';
import { GET_KEYWORD_ID } from '../../utils/getkeywordID';
import { GET_TRENDING_MEDIA } from '../../utils/getTrendingMedia';
import { GET_GENRE_ID } from '../../utils/getGenreID';
import { timeWindowTypes } from 'graphql/models/enums';
import {
	objectType,
	extendType,
	nonNull,
	stringArg,
	intArg,
	enumType,
	arg,
} from 'nexus';

export const ShowResult = objectType({
	name: 'ShowResult',
	definition(t) {
		t.string('backdrop_path');
		t.string('first_air_date');
		t.nonNull.list.int('genre_ids');
		t.nonNull.int('id');
		t.nonNull.string('name');
		t.nonNull.list.string('origin_country');
		t.nonNull.string('original_language');
		t.nonNull.string('original_name');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.string('poster_path');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const ShowsRes = objectType({
	name: 'ShowsRes',
	definition(t) {
		t.nonNull.int('page');
		t.nonNull.int('total_pages');
		t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: nonNull('ShowResult'),
		});
	},
});

export const PopularShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularShows', {
			type: 'ShowsRes',
			args: {
				page: intArg(),
			},
			resolve: async (_parent, { page }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/tv/popular?api_key=${process.env
							.API_KEY!}&language=en-US&page=${page ?? 1}`
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

export const SearchedShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('searchedShows', {
			type: 'ShowsRes',
			args: {
				q: nonNull(stringArg()),
				page: intArg(),
			},
			resolve: async (_parent, { q, page }) => {
				q = q.split(' ').join('+');
				try {
					const res = await fetch(
						`${BASE_URL}/search/tv?api_key=${process.env
							.API_KEY!}&language=en-US&page=${page ?? 1}&query=${q}`
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

export const ShowDetailsCreatedBy = objectType({
	name: 'ShowDetailsCreatedBy',
	definition(t) {
		t.int('id');
		t.string('credit_id');
		t.string('name');
		t.int('gender');
		t.string('profile_path');
	},
});

export const ShowDetailsGenre = objectType({
	name: 'ShowDetailsGenre',
	definition(t) {
		t.nonNull.int('id');
		t.nonNull.string('name');
	},
});

export const ShowDetailsLastEpToAir = objectType({
	name: 'ShowDetailsLastEpToAir',
	definition(t) {
		t.string('air_date');
		t.nonNull.int('episode_number');
		t.nonNull.int('id');
		t.nonNull.string('name');
		t.nonNull.string('overview');
		t.nonNull.string('production_code');
		t.int('runtime');
		t.nonNull.int('season_number');
		t.nonNull.int('show_id');
		t.string('still_path');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const ShowDetailsNetwork = objectType({
	name: 'ShowDetailsNetwork',
	definition(t) {
		t.nonNull.int('id');
		t.nonNull.string('name');
		t.string('logo_path');
		t.nonNull.string('origin_country');
	},
});

export const ShowDetailsProdCompany = objectType({
	name: 'ShowDetailsProdCompany',
	definition(t) {
		t.nonNull.int('id');
		t.string('logo_path');
		t.nonNull.string('name');
		t.nonNull.string('origin_country');
	},
});

export const ShowDetailsCountry = objectType({
	name: 'ShowDetailsCountry',
	definition(t) {
		t.nonNull.string('iso_3166_1');
		t.nonNull.string('name');
	},
});

export const ShowDetailsSeason = objectType({
	name: 'ShowDetailsSeason',
	definition(t) {
		t.string('air_date');
		t.nonNull.int('episode_count');
		t.nonNull.int('id');
		t.nonNull.string('name');
		t.nonNull.string('overview');
		t.string('poster_path');
		t.nonNull.int('season_number');
	},
});

export const ShowDetailsSpokenLang = objectType({
	name: 'ShowDetailsSpokenLang',
	definition(t) {
		t.nonNull.string('english_name');
		t.nonNull.string('iso_639_1');
		t.nonNull.string('name');
	},
});

export const ShowDetailsNextEpToAir = objectType({
	name: 'ShowDetailsNextEpToAir',
	definition(t) {
		t.string('air_date');
		t.nonNull.int('episode_number');
		t.nonNull.int('id');
		t.nonNull.string('name');
		t.nonNull.string('overview');
		t.nonNull.string('production_code');
		t.int('runtime');
		t.nonNull.int('season_number');
		t.nonNull.int('show_id');
		t.string('still_path');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const ShowDetailsRes = objectType({
	name: 'ShowDetailsRes',
	definition(t) {
		t.nonNull.boolean('adult');
		t.string('backdrop_path');
		t.nonNull.list.field('created_by', {
			type: 'ShowDetailsCreatedBy',
		});
		t.nonNull.list.int('episode_run_time');
		t.string('first_air_date');
		t.nonNull.list.field('genres', {
			type: nonNull('ShowDetailsGenre'),
		});
		t.nonNull.string('homepage');
		t.nonNull.int('id');
		t.nonNull.boolean('in_production');
		t.nonNull.list.string('languages');
		t.string('last_air_date');
		t.field('last_episode_to_air', {
			type: 'ShowDetailsLastEpToAir',
		});
		t.nonNull.string('name');
		t.field('next_episode_to_air', {
			type: 'ShowDetailsNextEpToAir',
		});
		t.nonNull.list.field('networks', {
			type: nonNull('ShowDetailsNetwork'),
		});
		t.nonNull.int('number_of_episodes');
		t.nonNull.int('number_of_seasons');
		t.nonNull.list.string('origin_country');
		t.nonNull.string('original_language');
		t.nonNull.string('original_name');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.string('poster_path');
		t.nonNull.list.field('production_companies', {
			type: 'ShowDetailsProdCompany',
		});
		t.nonNull.list.field('production_countries', {
			type: 'ShowDetailsCountry',
		});
		t.nonNull.list.field('seasons', {
			type: 'ShowDetailsSeason',
		});
		t.nonNull.list.field('spoken_languages', {
			type: 'ShowDetailsSpokenLang',
		});
		t.nonNull.string('status');
		t.nonNull.string('tagline');
		t.nonNull.string('type');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const ShowDetails = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('showDetails', {
			type: 'ShowDetailsRes',
			args: {
				showDetailsId: nonNull(intArg()),
			},
			resolve: async (_parent, { showDetailsId }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/tv/${showDetailsId}?api_key=${process.env
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

export const PopularAnimeShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularAnimeShows', {
			type: 'ShowsRes',
			args: {
				page: intArg(),
			},
			resolve: async (_parent, { page }) => {
				try {
					const keywordID = await GET_KEYWORD_ID('anime');

					const res = await fetch(
						`${BASE_URL}/discover/tv?api_key=${process.env
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
	},
});

export const TrendingShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('trendingShows', {
			type: 'ShowsRes',
			args: {
				timeWindow: arg({
					type: nonNull(timeWindowTypes),
				}),
				page: intArg(),
			},
			resolve: async (_parent, { timeWindow, page }) => {
				const trendingMovies = await GET_TRENDING_MEDIA('tv', timeWindow, page);
				return trendingMovies;
			},
		});
	},
});

export const TopRatedShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('topRatedShows', {
			type: 'ShowsRes',
			args: {
				page: intArg(),
			},
			resolve: async (_parent, { page }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/tv/top_rated?api_key=${process.env
							.API_KEY!}&language=en-US&page=${page ?? 1}`
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

export const RecommendedShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('recommendedShows', {
			type: 'ShowsRes',
			args: {
				recommendedShowsId: nonNull(intArg()),
				page: intArg(),
			},
			resolve: async (_parent, { recommendedShowsId, page }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/tv/${recommendedShowsId}/recommendations?api_key=${process
							.env.API_KEY!}&language=en-US&page=${page ?? 1}`
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

export const ShowReviewAuthorDetails = objectType({
	name: 'ShowReviewAuthorDetails',
	definition(t) {
		t.nonNull.string('name');
		t.nonNull.string('username');
		t.string('avatar_path');
		t.float('rating');
	},
});

export const ShowReviewResult = objectType({
	name: 'ShowReviewResult',
	definition(t) {
		t.nonNull.string('author');
		t.nonNull.field('author_details', {
			type: 'ShowReviewAuthorDetails',
		});
		t.nonNull.string('content');
		t.nonNull.string('created_at');
		t.nonNull.string('id');
		t.nonNull.string('updated_at');
		t.nonNull.string('url');
	},
});

export const ShowReviewRes = objectType({
	name: 'ShowReviewRes',
	definition(t) {
		t.nonNull.int('id'),
			t.nonNull.int('page'),
			t.nonNull.int('total_pages'),
			t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: 'ShowReviewResult',
		});
	},
});

export const ShowReviews = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('showReviews', {
			type: 'ShowReviewRes',
			args: {
				id: nonNull(intArg()),
				page: intArg(),
			},
			resolve: async (_parent, { id, page }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/tv/${id}/reviews?api_key=${process.env
							.API_KEY!}&language=en-US&page=${page ?? 1}`
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

export const ShowGenreTypes = enumType({
	name: 'ShowGenreTypes',
	members: [
		'Action_AMPERSAND_Adventure',
		'Animation',
		'Comedy',
		'Crime',
		'Documentary',
		'Drama',
		'Family',
		'Kids',
		'Mystery',
		'News',
		'Reality',
		'SciDASHFi_AMPERSAND_Fantasy',
		'Soap',
		'Talk',
		'War_AMPERSAND_Politics',
		'Western',
	],
});

export const PopularShowsByGenre = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularShowsByGenre', {
			type: 'ShowsRes',
			args: {
				genre: arg({
					type: nonNull(ShowGenreTypes),
				}),
				page: intArg(),
			},
			resolve: async (_parent, { genre, page }) => {
				try {
					const genreID = await GET_GENRE_ID(genre, 'tv');

					const res = await fetch(
						`${BASE_URL}/discover/tv?api_key=${process.env
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
	},
});

export const TopRatedShowsByGenre = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('topRatedShowsByGenre', {
			type: 'ShowsRes',
			args: {
				genre: arg({
					type: nonNull(ShowGenreTypes),
				}),
				page: intArg(),
			},
			resolve: async (_parent, { genre, page }) => {
				try {
					const genreID = await GET_GENRE_ID(genre, 'tv');

					const res = await fetch(
						`${BASE_URL}/discover/tv?api_key=${process.env
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
	},
});

export const ShowsCastModel = objectType({
	name: 'ShowsCastModel',
	definition(t) {
		t.boolean('adult');
		t.int('gender');
		t.int('id');
		t.string('known_for_department');
		t.string('name');
		t.string('original_name');
		t.float('popularity');
		t.string('profile_path');
		t.string('character');
		t.string('credit_id');
		t.int('order');
	},
});

export const ShowsCrewModel = objectType({
	name: 'ShowsCrewModel',
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

export const ShowsCastCrewRes = objectType({
	name: 'ShowsCastCrewRes',
	definition(t) {
		t.int('id');
		t.list.field('cast', {
			type: 'ShowsCastModel',
		});
		t.list.field('crew', {
			type: 'ShowsCrewModel',
		});
	},
});

export const ShowsCastCrew = extendType({
	type: 'Query',
	definition(t) {
		t.field('showsCastCrew', {
			type: 'ShowsCastCrewRes',
			args: {
				showId: nonNull(intArg()),
			},
			resolve: async (_parent, { showId }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/tv/${showId}/credits?api_key=${process.env
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

export const EpisodeDetailsRes = objectType({
	name: 'EpisodeDetailsRes',
	definition(t) {
		t.string('air_date');
		t.list.field('crew', {
			type: 'ShowsCrewModel',
		});
		t.int('episode_number');
		t.list.field('guest_stars', {
			type: 'ShowsCastModel',
		});
		t.string('name');
		t.string('overview');
		t.int('id');
		t.string('production_code');
		t.int('runtime');
		t.int('season_number');
		t.string('still_path');
		t.float('vote_average');
		t.int('vote_count');
	},
});

export const EpisodeDetails = extendType({
	type: 'Query',
	definition(t) {
		t.field('episodeDetails', {
			type: 'EpisodeDetailsRes',
			args: {
				showId: nonNull(intArg()),
				seasonNum: nonNull(intArg()),
				episodeNum: nonNull(intArg()),
			},
			resolve: async (_parent, { showId, seasonNum, episodeNum }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/tv/${showId}/season/${seasonNum}/episode/${episodeNum}?api_key=${process
							.env.API_KEY!}&language=en-US`
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
