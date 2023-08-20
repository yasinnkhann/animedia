import { builder } from '../builder';
import { KnownForResult, PeopleRes, PersonResult } from 'models/entities';

builder.objectType(KnownForResult, {
	name: 'KnownForResult',
	fields: t => ({
		adult: t.exposeBoolean('adult', { nullable: true }),
		backdrop_path: t.exposeString('backdrop_path', { nullable: true }),
		genre_ids: t.exposeIDList('genre_ids', { nullable: true }),
		id: t.exposeID('id', { nullable: true }),
		media_type: t.exposeString('media_type', { nullable: true }),
		original_language: t.exposeString('original_language', { nullable: true }),
		original_title: t.exposeString('original_title', { nullable: true }),
		overview: t.exposeString('overview', { nullable: true }),
		poster_path: t.exposeString('poster_path', { nullable: true }),
		release_date: t.exposeString('release_date', { nullable: true }),
		title: t.exposeString('title', { nullable: true }),
		video: t.exposeBoolean('video', { nullable: true }),
		vote_average: t.exposeFloat('vote_average', { nullable: true }),
		vote_count: t.exposeInt('vote_count', { nullable: true }),
	}),
});

builder.objectType(PersonResult, {
	name: 'KnownForResult',
	fields: t => ({
		adult: t.exposeBoolean('adult'),
		gender: t.exposeInt('gender'),
		id: t.exposeID('id'),
		known_for: t.expose('known_for', { type: [KnownForResult] }),
		known_for_department: t.exposeString('known_for_department', {
			nullable: true,
		}),
		name: t.exposeString('name'),
		popularity: t.exposeFloat('popularity'),
		profile_path: t.exposeString('profile_path', { nullable: true }),
	}),
});

builder.objectType(PeopleRes, {
	name: 'PeopleRes',
	fields: t => ({
		page: t.exposeInt('page'),
		total_pages: t.exposeInt('total_pages'),
		total_results: t.exposeInt('total_results'),
		results: t.expose('results', { type: [PersonResult] }),
	}),
});
