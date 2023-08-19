import { builder } from '../builder';
import {
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
	ShowReviewResult,
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
		episode_count: t.exposeInt('episode_number'),
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
