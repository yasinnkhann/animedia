import { builder } from '../builder';
import {
	ShowDetailsCountry,
	ShowDetailsCreatedBy,
	ShowDetailsGenre,
	ShowDetailsLastEpToAir,
	ShowDetailsNetwork,
	ShowDetailsNextEpToAir,
	ShowDetailsProdCompany,
	ShowDetailsSeason,
	ShowDetailsSpokenLang,
	ShowResult,
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
