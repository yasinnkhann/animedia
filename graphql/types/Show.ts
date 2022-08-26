import { objectType, extendType, nonNull, stringArg, intArg } from 'nexus';
import axios from 'axios';
import { BASE_URL } from '../../utils/URLs';
import { GET_KEYWORD_ID } from '../../utils/getkeywordID';
import { GET_TRENDING_MEDIA } from '../../utils/getTrendingMedia';
import 'dotenv/config';
import { GET_GENRE_ID } from '../../utils/getGenreID';

export const ShowResult = objectType({
	name: 'ShowResult',
	definition(t) {
		t.string('backdrop_path');
		t.nonNull.string('first_air_date');
		t.nonNull.list.int('genre_ids');
		t.nonNull.int('id');
		t.nonNull.string('name');
		t.nonNull.list.string('origin_country');
		t.nonNull.string('original_language');
		t.nonNull.string('original_name');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.nonNull.string('poster_path');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const Shows = objectType({
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

export const getPopularShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularShows', {
			type: 'ShowsRes',
			resolve: async () => {
				const { data } = await axios.get(
					`${BASE_URL}/tv/popular?api_key=${process.env
						.API_KEY!}&language=en-US`
				);

				return data;
			},
		});
	},
});

export const getSearchedShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('searchedShows', {
			type: 'ShowsRes',
			args: {
				q: nonNull(stringArg()),
			},
			resolve: async (_parent, { q }) => {
				q = q.split(' ').join('+');
				const { data } = await axios.get(
					`${BASE_URL}/search/tv?api_key=${process.env.API_KEY!}&query=${q}`
				);

				return data;
			},
		});
	},
});

export const showDetailsCreatedBy = objectType({
	name: 'showDetailsCreatedBy',
	definition(t) {
		t.nonNull.int('id');
		t.nonNull.string('credit_id');
		t.nonNull.string('name');
		t.nonNull.int('gender');
		t.nonNull.string('profile_path');
	},
});

export const showDetailsGenre = objectType({
	name: 'showDetailsGenre',
	definition(t) {
		t.nonNull.int('id');
		t.nonNull.string('name');
	},
});

export const showDetailsLastEpToAir = objectType({
	name: 'showDetailsLastEpToAir',
	definition(t) {
		t.nonNull.string('air_date');
		t.nonNull.int('episode_number');
		t.nonNull.int('id');
		t.nonNull.string('name');
		t.nonNull.string('overview');
		t.nonNull.string('production_code');
		t.nonNull.int('runtime');
		t.nonNull.int('season_number');
		t.nonNull.int('show_id');
		t.nonNull.string('still_path');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const showDetailsNetwork = objectType({
	name: 'showDetailsNetwork',
	definition(t) {
		t.nonNull.int('id');
		t.nonNull.string('name');
		t.nonNull.string('logo_path');
		t.nonNull.string('origin_country');
	},
});

export const showDetailsProdCompany = objectType({
	name: 'showDetailsProdCompany',
	definition(t) {
		t.nonNull.int('id');
		t.string('logo_path');
		t.nonNull.string('name');
		t.nonNull.string('origin_country');
	},
});

export const showDetailsCountry = objectType({
	name: 'showDetailsCountry',
	definition(t) {
		t.nonNull.string('iso_3166_1');
		t.nonNull.string('name');
	},
});

export const showDetailsSeason = objectType({
	name: 'showDetailsSeason',
	definition(t) {
		t.nonNull.string('air_date');
		t.nonNull.int('episode_count');
		t.nonNull.int('id');
		t.nonNull.string('name');
		t.nonNull.string('overview');
		t.nonNull.string('poster_path');
		t.nonNull.int('season_number');
	},
});

export const showDetailsSpokenLang = objectType({
	name: 'showDetailsSpokenLang',
	definition(t) {
		t.nonNull.string('english_name');
		t.nonNull.string('iso_639_1');
		t.nonNull.string('name');
	},
});

export const showDetailsNextEpToAir = objectType({
	name: 'showDetailsNextEpToAir',
	definition(t) {
		t.nonNull.string('air_date');
		t.nonNull.int('episode_number');
		t.nonNull.int('id');
		t.nonNull.string('name');
		t.nonNull.string('overview');
		t.nonNull.string('production_code');
		t.nonNull.int('runtime');
		t.nonNull.int('season_number');
		t.nonNull.int('show_id');
		t.nonNull.string('still_path');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const showDetails = objectType({
	name: 'showDetailsRes',
	definition(t) {
		t.nonNull.boolean('adult');
		t.nonNull.string('backdrop_path');
		t.nonNull.list.field('created_by', {
			type: 'showDetailsCreatedBy',
		});
		t.nonNull.list.int('episode_run_time');
		t.nonNull.string('first_air_date');
		t.nonNull.list.field('genres', {
			type: nonNull('showDetailsGenre'),
		});
		t.nonNull.string('homepage');
		t.nonNull.int('id');
		t.nonNull.boolean('in_production');
		t.nonNull.list.string('languages');
		t.nonNull.string('last_air_date');
		t.nonNull.field('last_episode_to_air', {
			type: 'showDetailsLastEpToAir',
		});
		t.nonNull.string('name');
		t.field('next_episode_to_air', {
			type: 'showDetailsNextEpToAir',
		});
		t.nonNull.list.field('networks', {
			type: nonNull('showDetailsNetwork'),
		});
		t.nonNull.int('number_of_episodes');
		t.nonNull.int('number_of_seasons');
		t.nonNull.list.string('origin_country');
		t.nonNull.string('original_language');
		t.nonNull.string('original_name');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.nonNull.string('poster_path');
		t.nonNull.list.field('production_companies', {
			type: 'showDetailsProdCompany',
		});
		t.nonNull.list.field('production_countries', {
			type: 'showDetailsCountry',
		});
		t.nonNull.list.field('seasons', {
			type: 'showDetailsSeason',
		});
		t.nonNull.list.field('spoken_languages', {
			type: 'showDetailsSpokenLang',
		});
		t.nonNull.string('status');
		t.nonNull.string('tagline');
		t.nonNull.string('type');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const getShowDetails = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('showDetails', {
			type: 'showDetailsRes',
			args: {
				id: nonNull(intArg()),
			},
			resolve: async (_parent, { id }) => {
				const { data } = await axios.get(
					`${BASE_URL}/tv/${id}?api_key=${process.env.API_KEY!}&language=en-US`
				);
				return data;
			},
		});
	},
});

export const getPopularAnimeShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularAnimeShows', {
			type: 'ShowsRes',
			resolve: async () => {
				const keywordID = await GET_KEYWORD_ID('anime');

				const { data } = await axios.get(
					`${BASE_URL}/discover/tv?api_key=${process.env
						.API_KEY!}&language=en-US&sort_by=popularity.desc&page=1&with_keywords=${keywordID}`
				);

				return data;
			},
		});
	},
});

export const getTrendingShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('trendingShows', {
			type: 'ShowsRes',
			resolve: async () => {
				const trendingShows = await GET_TRENDING_MEDIA('tv', 'day');
				return trendingShows;
			},
		});
	},
});

export const getTopRatedShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('topRatedShows', {
			type: 'ShowsRes',
			resolve: async () => {
				const { data } = await axios.get(
					`${BASE_URL}/tv/top_rated?api_key=${process.env
						.API_KEY!}&language=en-US&page=1`
				);
				return data;
			},
		});
	},
});

export const getRecommendedShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('recommendedShows', {
			type: 'ShowsRes',
			args: {
				id: nonNull(intArg()),
			},
			resolve: async (_parent, { id }) => {
				const { data } = await axios.get(
					`${BASE_URL}/tv/${id}/recommendations?api_key=${process.env
						.API_KEY!}&language=en-US&page=1`
				);
				return data;
			},
		});
	},
});

export const showReviewAuthorDetails = objectType({
	name: 'showReviewAuthorDetails',
	definition(t) {
		t.nonNull.string('name');
		t.nonNull.string('username');
		t.string('avatar_path');
		t.float('rating');
	},
});

export const showReviewResult = objectType({
	name: 'showReviewResult',
	definition(t) {
		t.nonNull.string('author');
		t.nonNull.field('author_details', {
			type: 'showReviewAuthorDetails',
		});
		t.nonNull.string('content');
		t.nonNull.string('created_at');
		t.nonNull.string('id');
		t.nonNull.string('updated_at');
		t.nonNull.string('url');
	},
});

export const showReview = objectType({
	name: 'showReviewRes',
	definition(t) {
		t.nonNull.int('id'),
			t.nonNull.int('page'),
			t.nonNull.int('total_pages'),
			t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: 'showReviewResult',
		});
	},
});

export const getShowReviews = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('showReviews', {
			type: 'showReviewRes',
			args: {
				id: nonNull(intArg()),
			},
			resolve: async (_parent, { id }) => {
				const { data } = await axios.get(
					`${BASE_URL}/tv/${id}/reviews?api_key=${process.env
						.API_KEY!}&language=en-US&page=1`
				);
				return data;
			},
		});
	},
});

export const getPopularShowsByGenre = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularShowsByGenre', {
			type: 'ShowsRes',
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

export const getTopRatedShowsByGenre = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('topRatedShowsByGenre', {
			type: 'ShowsRes',
			args: {
				genre: nonNull(stringArg()),
				mediaType: nonNull(stringArg()),
			},
			resolve: async (_parent, { genre, mediaType }) => {
				const genreID = await GET_GENRE_ID(genre, mediaType);
				const { data } = await axios.get(
					`${BASE_URL}/discover/${mediaType}?api_key=${process.env
						.API_KEY!}&language=en-US&with_genres=${genreID}&sort_by=vote_average.desc&vote_count.gte=10`
				);

				return data;
			},
		});
	},
});