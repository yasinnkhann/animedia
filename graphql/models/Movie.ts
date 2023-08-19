import { builder } from '../builder';
import {
	MovieResult,
	MoviesRes,
	MovieDetailsGenre,
	MovieDetailsProdCompany,
	MovieDetailsProdCountry,
	MovieDetailsSpokenLang,
	MovieDetailsRes,
} from '../../models/entities';

builder.objectType(MovieResult, {
	name: 'MovieResult',
	fields: t => ({
		adult: t.exposeBoolean('adult'),
		backdrop_path: t.exposeString('backdrop_path', { nullable: true }),
		genre_ids: t.exposeIntList('genre_ids'),
		id: t.exposeID('id'),
		original_language: t.exposeString('original_language'),
		original_title: t.exposeString('original_title'),
		overview: t.exposeString('overview'),
		popularity: t.exposeFloat('popularity'),
		poster_path: t.exposeString('poster_path', { nullable: true }),
		release_date: t.exposeString('release_date', { nullable: true }),
		title: t.exposeString('title'),
		video: t.exposeBoolean('video'),
		vote_average: t.exposeFloat('vote_average'),
		vote_count: t.exposeInt('vote_count'),
	}),
});

builder.objectType(MoviesRes, {
	name: 'MoviesRes',
	fields: t => ({
		page: t.exposeInt('page'),
		total_pages: t.exposeInt('total_pages'),
		total_results: t.exposeInt('total_results'),
		results: t.expose('results', { type: [MovieResult] }),
	}),
});

builder.objectType(MovieDetailsGenre, {
	name: 'MovieDetailsGenre',
	fields: t => ({
		id: t.exposeID('id'),
		name: t.exposeString('name'),
	}),
});

builder.objectType(MovieDetailsProdCompany, {
	name: 'MovieDetailsProdCompany',
	fields: t => ({
		id: t.exposeID('id'),
		logo_path: t.exposeString('logo_path', { nullable: true }),
		name: t.exposeString('name'),
		origin_country: t.exposeString('origin_country'),
	}),
});

builder.objectType(MovieDetailsProdCountry, {
	name: 'MovieDetailsProdCountry',
	fields: t => ({
		iso_3166_1: t.exposeString('iso_3166_1'),
		name: t.exposeString('name'),
	}),
});

builder.objectType(MovieDetailsSpokenLang, {
	name: 'MovieDetailsSpokenLang',
	fields: t => ({
		english_name: t.exposeString('english_name'),
		iso_639_1: t.exposeString('iso_639_1'),
		name: t.exposeString('name'),
	}),
});

builder.objectType(MovieDetailsRes, {
	name: 'MovieDetailsRes',
	fields: t => ({
		adult: t.exposeBoolean('adult'),
		backdrop_path: t.exposeString('backdrop_path', { nullable: true }),
		genres: t.expose('genres', { type: [MovieDetailsGenre] }),
		homepage: t.exposeString('homepage'),
		id: t.exposeID('id'),
		imdb_id: t.exposeString('imdb_id', { nullable: true }),
		original_language: t.exposeString('original_language'),
		original_title: t.exposeString('original_title'),
		overview: t.exposeString('overview'),
		popularity: t.exposeFloat('popularity'),
		poster_path: t.exposeString('poster_path', { nullable: true }),
		production_companies: t.expose('production_companies', {
			type: [MovieDetailsProdCompany],
		}),
		production_countries: t.expose('production_countries', {
			type: [MovieDetailsProdCountry],
		}),
		release_date: t.exposeString('release_date', { nullable: true }),
		revenue: t.expose('revenue', { type: 'BigInt', nullable: true }),
		runtime: t.exposeInt('runtime', { nullable: true }),
		spoken_languages: t.expose('spoken_languages', {
			type: [MovieDetailsSpokenLang],
		}),
		status: t.exposeString('status'),
		tagline: t.exposeString('tagline'),
		title: t.exposeString('title'),
		video: t.exposeBoolean('video', { nullable: true }),
		vote_average: t.exposeFloat('vote_average'),
		vote_count: t.exposeInt('vote_count'),
	}),
});
