import { builder, TimeWindowTypes } from '../builder';
import { BASE_URL } from 'utils/constants';
import { getKeywordId } from 'utils/getkeywordID';
import { getTrendingMedia } from 'utils/getTrendingMedia';
import { getGenreId } from 'utils/getGenreID';
import {
	EpisodeDetailsRes,
	ShowDetailsCountry,
	ShowDetailsCreatedBy,
	ShowDetailsGenre,
	ShowDetailsLastEpToAir,
	ShowDetailsNetwork,
	ShowDetailsNextEpToAir,
	ShowDetailsProdCompany,
	ShowDetailsRes,
	ShowDetailsSeason,
	ShowDetailsSpokenLang,
	ShowResult,
	ShowReviewAuthorDetails,
	ShowReviewRes,
	ShowReviewResult,
	ShowsCastCrewRes,
	ShowsCastModel,
	ShowsCrewModel,
	ShowsRes,
} from 'models/entities';

const ShowGenreTypes = builder.enumType('ShowGenreTypes', {
	values: [
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
	] as const,
});

builder.objectType(ShowResult, {
	name: 'ShowResult',
	fields: t => ({
		backdrop_path: t.exposeString('backdrop_path', { nullable: true }),
		first_air_date: t.exposeString('first_air_date', { nullable: true }),
		genre_ids: t.exposeIDList('genre_ids'),
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		origin_country: t.exposeStringList('origin_country'),
		original_language: t.exposeString('original_language'),
		original_name: t.exposeString('original_name'),
		overview: t.exposeString('overview'),
		popularity: t.exposeFloat('popularity'),
		poster_path: t.exposeString('poster_path', { nullable: true }),
		vote_average: t.exposeFloat('vote_average'),
		vote_count: t.exposeInt('vote_count'),
	}),
});

builder.objectType(ShowsRes, {
	name: 'ShowsRes',
	fields: t => ({
		page: t.exposeInt('page'),
		total_pages: t.exposeInt('total_pages'),
		total_results: t.exposeInt('total_results'),
		results: t.expose('results', { type: [ShowResult] }),
	}),
});

builder.objectType(ShowDetailsCreatedBy, {
	name: 'ShowDetailsCreatedBy',
	fields: t => ({
		id: t.exposeID('id', { nullable: true }),
		credit_id: t.exposeID('credit_id', { nullable: true }),
		name: t.exposeString('name', { nullable: true }),
		gender: t.exposeInt('gender', { nullable: true }),
		profile_path: t.exposeString('profile_path', { nullable: true }),
	}),
});

builder.objectType(ShowDetailsGenre, {
	name: 'ShowDetailsGenre',
	fields: t => ({
		id: t.exposeID('id'),
		name: t.exposeString('name'),
	}),
});

builder.objectType(ShowDetailsLastEpToAir, {
	name: 'ShowDetailsLastEpToAir',
	fields: t => ({
		air_date: t.exposeString('air_date', { nullable: true }),
		episode_number: t.exposeInt('episode_number'),
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		overview: t.exposeString('overview'),
		production_code: t.exposeString('production_code'),
		runtime: t.exposeInt('runtime', { nullable: true }),
		season_number: t.exposeInt('season_number'),
		show_id: t.exposeID('show_id'),
		still_path: t.exposeString('still_path', { nullable: true }),
		vote_average: t.exposeFloat('vote_average'),
		vote_count: t.exposeInt('vote_count'),
	}),
});

builder.objectType(ShowDetailsNetwork, {
	name: 'ShowDetailsNetwork',
	fields: t => ({
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		logo_path: t.exposeString('logo_path', { nullable: true }),
		origin_country: t.exposeString('origin_country'),
	}),
});

builder.objectType(ShowDetailsProdCompany, {
	name: 'ShowDetailsProdCompany',
	fields: t => ({
		id: t.exposeID('id'),
		logo_path: t.exposeString('logo_path', { nullable: true }),
		name: t.exposeString('name'),
		origin_country: t.exposeString('origin_country'),
	}),
});

builder.objectType(ShowDetailsCountry, {
	name: 'ShowDetailsCountry',
	fields: t => ({
		iso_3166_1: t.exposeString('iso_3166_1'),
		name: t.exposeString('name'),
	}),
});

builder.objectType(ShowDetailsSeason, {
	name: 'ShowDetailsSeason',
	fields: t => ({
		air_date: t.exposeString('air_date', { nullable: true }),
		episode_count: t.exposeInt('episode_count'),
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		overview: t.exposeString('overview'),
		poster_path: t.exposeString('poster_path', { nullable: true }),
		season_number: t.exposeInt('season_number'),
	}),
});

builder.objectType(ShowDetailsSpokenLang, {
	name: 'ShowDetailsSpokenLang',
	fields: t => ({
		english_name: t.exposeString('english_name'),
		iso_639_1: t.exposeString('iso_639_1'),
		name: t.exposeString('name'),
	}),
});

builder.objectType(ShowDetailsNextEpToAir, {
	name: 'ShowDetailsNextEpToAir',
	fields: t => ({
		air_date: t.exposeString('air_date', { nullable: true }),
		episode_number: t.exposeInt('episode_number'),
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		overview: t.exposeString('overview'),
		production_code: t.exposeString('production_code'),
		runtime: t.exposeInt('runtime', { nullable: true }),
		season_number: t.exposeInt('season_number'),
		show_id: t.exposeID('show_id'),
		still_path: t.exposeString('still_path', { nullable: true }),
		vote_average: t.exposeFloat('vote_average'),
		vote_count: t.exposeInt('vote_count'),
	}),
});

builder.objectType(ShowDetailsRes, {
	name: 'ShowDetailsRes',
	fields: t => ({
		adult: t.exposeBoolean('adult'),
		backdrop_path: t.exposeString('backdrop_path', { nullable: true }),
		created_by: t.expose('created_by', { type: [ShowDetailsCreatedBy] }),
		episode_run_time: t.exposeIntList('episode_run_time'),
		first_air_date: t.exposeString('first_air_date', { nullable: true }),
		genres: t.expose('genres', { type: [ShowDetailsGenre] }),
		homepage: t.exposeString('homepage'),
		id: t.exposeID('id'),
		in_production: t.exposeBoolean('in_production'),
		languages: t.exposeStringList('languages'),
		last_air_date: t.exposeString('last_air_date', { nullable: true }),
		last_episode_to_air: t.expose('last_episode_to_air', {
			type: ShowDetailsLastEpToAir,
			nullable: true,
		}),
		name: t.exposeString('name'),
		next_episode_to_air: t.expose('next_episode_to_air', {
			type: ShowDetailsNextEpToAir,
			nullable: true,
		}),
		networks: t.expose('networks', {
			type: [ShowDetailsNetwork],
		}),
		number_of_episodes: t.exposeInt('number_of_episodes'),
		number_of_seasons: t.exposeInt('number_of_seasons'),
		origin_country: t.exposeStringList('origin_country'),
		original_language: t.exposeString('original_language'),
		original_name: t.exposeString('original_name'),
		overview: t.exposeString('overview'),
		popularity: t.exposeFloat('popularity'),
		poster_path: t.exposeString('poster_path', { nullable: true }),
		production_companies: t.expose('production_companies', {
			type: [ShowDetailsProdCompany],
		}),
		production_countries: t.expose('production_countries', {
			type: [ShowDetailsCountry],
		}),
		seasons: t.expose('seasons', {
			type: [ShowDetailsSeason],
		}),
		spoken_languages: t.expose('spoken_languages', {
			type: [ShowDetailsSpokenLang],
		}),
		status: t.exposeString('status'),
		tagline: t.exposeString('tagline'),
		type: t.exposeString('type'),
		vote_average: t.exposeFloat('vote_average'),
		vote_count: t.exposeInt('vote_count'),
	}),
});

builder.objectType(ShowReviewAuthorDetails, {
	name: 'ShowReviewAuthorDetails',
	fields: t => ({
		name: t.exposeString('name'),
		username: t.exposeString('username'),
		avatar_path: t.exposeString('avatar_path', { nullable: true }),
		rating: t.exposeFloat('rating', { nullable: true }),
	}),
});

builder.objectType(ShowReviewResult, {
	name: 'ShowReviewResult',
	fields: t => ({
		author: t.exposeString('author'),
		author_details: t.expose('author_details', {
			type: ShowReviewAuthorDetails,
		}),
		content: t.exposeString('content'),
		created_at: t.exposeString('created_at'),
		id: t.exposeID('id'),
		updated_at: t.exposeString('updated_at'),
		url: t.exposeString('url'),
	}),
});

builder.objectType(ShowReviewRes, {
	name: 'ShowReviewRes',
	fields: t => ({
		id: t.exposeID('id'),
		page: t.exposeInt('page'),
		total_pages: t.exposeInt('total_pages'),
		total_results: t.exposeInt('total_results'),
		results: t.expose('results', {
			type: [ShowReviewResult],
		}),
	}),
});

builder.objectType(ShowsCastModel, {
	name: 'ShowsCastModel',
	fields: t => ({
		adult: t.exposeBoolean('adult', { nullable: true }),
		gender: t.exposeInt('gender', { nullable: true }),
		id: t.exposeID('id', { nullable: true }),
		known_for_department: t.exposeString('known_for_department', {
			nullable: true,
		}),
		name: t.exposeString('name', { nullable: true }),
		original_name: t.exposeString('original_name', { nullable: true }),
		popularity: t.exposeFloat('popularity', { nullable: true }),
		profile_path: t.exposeString('profile_path', { nullable: true }),
		character: t.exposeString('character', { nullable: true }),
		credit_id: t.exposeID('credit_id', { nullable: true }),
		order: t.exposeInt('order', { nullable: true }),
	}),
});

builder.objectType(ShowsCrewModel, {
	name: 'ShowsCrewModel',
	fields: t => ({
		adult: t.exposeBoolean('adult', { nullable: true }),
		gender: t.exposeInt('gender', { nullable: true }),
		id: t.exposeID('id', { nullable: true }),
		known_for_department: t.exposeString('known_for_department', {
			nullable: true,
		}),
		name: t.exposeString('name', { nullable: true }),
		original_name: t.exposeString('original_name', { nullable: true }),
		popularity: t.exposeFloat('popularity', { nullable: true }),
		profile_path: t.exposeString('profile_path', { nullable: true }),
		credit_id: t.exposeID('credit_id', { nullable: true }),
		department: t.exposeString('department', { nullable: true }),
		job: t.exposeString('job', { nullable: true }),
	}),
});

builder.objectType(ShowsCastCrewRes, {
	name: 'ShowsCastCrewRes',
	fields: t => ({
		id: t.exposeID('id', { nullable: true }),
		cast: t.expose('cast', {
			type: [ShowsCastModel],
			nullable: true,
		}),
		crew: t.expose('crew', {
			type: [ShowsCrewModel],
			nullable: true,
		}),
	}),
});

builder.objectType(EpisodeDetailsRes, {
	name: 'EpisodeDetailsRes',
	fields: t => ({
		air_date: t.exposeString('air_date', { nullable: true }),
		crew: t.expose('crew', { type: [ShowsCrewModel], nullable: true }),
		episode_number: t.exposeInt('episode_number', { nullable: true }),
		guest_stars: t.expose('guest_stars', {
			type: [ShowsCastModel],
			nullable: true,
		}),
		name: t.exposeString('name', { nullable: true }),
		overview: t.exposeString('overview', { nullable: true }),
		id: t.exposeID('id', { nullable: true }),
		production_code: t.exposeString('production_code', { nullable: true }),
		runtime: t.exposeInt('runtime', { nullable: true }),
		season_number: t.exposeInt('season_number', { nullable: true }),
		still_path: t.exposeString('still_path', { nullable: true }),
		vote_average: t.exposeFloat('vote_average', { nullable: true }),
		vote_count: t.exposeInt('vote_count', { nullable: true }),
	}),
});

builder.queryFields(t => ({
	popularShows: t.field({
		type: ShowsRes,
		args: {
			page: t.arg.int({ required: false }),
		},
		resolve: async (_root, { page }) => {
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
	}),
	searchedShows: t.field({
		type: ShowsRes,
		args: {
			q: t.arg.string(),
			page: t.arg.int({ required: false }),
		},
		resolve: async (_root, { q, page }) => {
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
	}),
	showDetails: t.field({
		type: ShowDetailsRes,
		args: {
			showDetailsId: t.arg.id(),
		},
		resolve: async (_root, { showDetailsId }) => {
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
	}),
	popularAnimeShows: t.field({
		type: ShowsRes,
		args: {
			page: t.arg.int({ required: false }),
		},
		resolve: async (_root, { page }) => {
			try {
				const keywordID = await getKeywordId('anime');

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
	}),
	trendingShows: t.field({
		type: ShowsRes,
		args: {
			timeWindow: t.arg({ type: TimeWindowTypes }),
			page: t.arg.int({ required: false }),
		},
		resolve: async (_root, { timeWindow, page }) => {
			const trendingMovies = await getTrendingMedia('tv', timeWindow, page);
			return trendingMovies;
		},
	}),
	topRatedShows: t.field({
		type: ShowsRes,
		args: {
			page: t.arg.int({ required: false }),
		},
		resolve: async (_root, { page }) => {
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
	}),
	recommendedShows: t.field({
		type: ShowsRes,
		args: {
			recommendedShowsId: t.arg.id(),
			page: t.arg.int({ required: false }),
		},
		resolve: async (_root, { recommendedShowsId, page }) => {
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
	}),
	showReviews: t.field({
		type: ShowReviewRes,
		args: {
			showId: t.arg.id(),
			page: t.arg.int({ required: false }),
		},
		resolve: async (_root, { showId, page }) => {
			try {
				const res = await fetch(
					`${BASE_URL}/tv/${showId}/reviews?api_key=${process.env
						.API_KEY!}&language=en-US&page=${page ?? 1}`
				);
				const data = await res.json();
				return data;
			} catch (err) {
				console.error(err);
			}
		},
	}),
	popularShowsByGenre: t.field({
		type: ShowsRes,
		args: {
			genre: t.arg({ type: ShowGenreTypes }),
			page: t.arg.int({ required: false }),
		},
		resolve: async (_root, { genre, page }) => {
			try {
				const genreID = await getGenreId(genre, 'tv');

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
	}),
	topRatedShowsByGenre: t.field({
		type: ShowsRes,
		args: {
			genre: t.arg({ type: ShowGenreTypes }),
			page: t.arg.int({ required: false }),
		},
		resolve: async (_root, { genre, page }) => {
			try {
				const genreID = await getGenreId(genre, 'tv');

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
	}),
	showsCastCrew: t.field({
		type: ShowsCastCrewRes,
		args: {
			showId: t.arg.id(),
		},
		resolve: async (_root, { showId }) => {
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
	}),
	episodeDetails: t.field({
		type: EpisodeDetailsRes,
		args: {
			showId: t.arg.id(),
			seasonNum: t.arg.int(),
			episodeNum: t.arg.int(),
		},
		resolve: async (_root, { showId, seasonNum, episodeNum }) => {
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
	}),
}));
