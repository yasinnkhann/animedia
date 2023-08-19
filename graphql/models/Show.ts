import { builder } from '../builder';
import { ShowResult } from 'models/entities';

builder.objectType(ShowResult, {
	name: 'ShowResult',
	fields: t => ({
		backdrop_path: t.exposeString('backdrop_path', { nullable: true }),
		first_air_date: t.exposeString('first_air_date', { nullable: true }),
		genre_ids: t.exposeIntList('genre_ids'),
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
