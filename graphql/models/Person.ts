import { builder } from '../builder';
import {
	KnownForResult,
	PeopleRes,
	PersonDetailsRes,
	PersonResult,
	PersonsKnownForMovieCast,
	PersonsKnownForMovieCrew,
	PersonsKnownForMovieRes,
	PersonsKnownForShowCast,
	PersonsKnownForShowCrew,
	PersonsKnownForShowRes,
} from 'models/entities';

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
	name: 'PersonResult',
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

builder.objectType(PersonDetailsRes, {
	name: 'PersonDetailsRes',
	fields: t => ({
		adult: t.exposeBoolean('adult', { nullable: true }),
		also_known_as: t.exposeStringList('also_known_as', { nullable: true }),
		biography: t.exposeString('biography', { nullable: true }),
		birthday: t.exposeString('birthday', { nullable: true }),
		deathday: t.exposeString('deathday', { nullable: true }),
		gender: t.exposeInt('gender', { nullable: true }),
		homepage: t.exposeString('homepage', { nullable: true }),
		id: t.exposeID('id'),
		imdb_id: t.exposeID('imdb_id', { nullable: true }),
		known_for_department: t.exposeString('known_for_department', {
			nullable: true,
		}),
		name: t.exposeString('name', { nullable: true }),
		place_of_birth: t.exposeString('place_of_birth', { nullable: true }),
		popularity: t.exposeFloat('popularity', { nullable: true }),
		profile_path: t.exposeString('profile_path', { nullable: true }),
	}),
});

builder.objectType(PersonsKnownForMovieCast, {
	name: 'PersonsKnownForMovieCast',
	fields: t => ({
		adult: t.exposeBoolean('adult'),
		backdrop_path: t.exposeString('backdrop_path', { nullable: true }),
		genre_ids: t.exposeIDList('genre_ids'),
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
		character: t.exposeString('character', { nullable: true }),
		credit_id: t.exposeID('credit_id', { nullable: true }),
		order: t.exposeInt('order', { nullable: true }),
	}),
});

builder.objectType(PersonsKnownForMovieCrew, {
	name: 'PersonsKnownForMovieCrew',
	fields: t => ({
		adult: t.exposeBoolean('adult'),
		backdrop_path: t.exposeString('backdrop_path', { nullable: true }),
		genre_ids: t.exposeIDList('genre_ids'),
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
		credit_id: t.exposeID('credit_id', { nullable: true }),
		department: t.exposeString('department', { nullable: true }),
		job: t.exposeString('job', { nullable: true }),
	}),
});

builder.objectType(PersonsKnownForMovieRes, {
	name: 'PersonsKnownForMovieRes',
	fields: t => ({
		id: t.exposeID('id'),
		cast: t.expose('cast', { type: [PersonsKnownForMovieCast] }),
		crew: t.expose('crew', { type: [PersonsKnownForMovieCrew] }),
	}),
});

builder.objectType(PersonsKnownForShowCast, {
	name: 'PersonsKnownForShowCast',
	fields: t => ({
		adult: t.exposeBoolean('adult'),
		backdrop_path: t.exposeString('backdrop_path', { nullable: true }),
		genre_ids: t.exposeIDList('genre_ids'),
		id: t.exposeID('id'),
		origin_country: t.exposeStringList('origin_country'),
		original_language: t.exposeString('original_language'),
		original_name: t.exposeString('original_name'),
		overview: t.exposeString('overview'),
		popularity: t.exposeFloat('popularity'),
		poster_path: t.exposeString('poster_path', { nullable: true }),
		first_air_date: t.exposeString('first_air_date', { nullable: true }),
		name: t.exposeString('name'),
		vote_average: t.exposeFloat('vote_average'),
		vote_count: t.exposeInt('vote_count'),
		character: t.exposeString('character', { nullable: true }),
		credit_id: t.exposeID('credit_id', { nullable: true }),
		episode_count: t.exposeInt('episode_count', { nullable: true }),
	}),
});

builder.objectType(PersonsKnownForShowCrew, {
	name: 'PersonsKnownForShowCrew',
	fields: t => ({
		adult: t.exposeBoolean('adult'),
		backdrop_path: t.exposeString('backdrop_path', { nullable: true }),
		genre_ids: t.exposeIDList('genre_ids'),
		id: t.exposeID('id'),
		origin_country: t.exposeStringList('origin_country'),
		original_language: t.exposeString('original_language'),
		original_name: t.exposeString('original_name'),
		overview: t.exposeString('overview'),
		popularity: t.exposeFloat('popularity'),
		poster_path: t.exposeString('poster_path', { nullable: true }),
		first_air_date: t.exposeString('first_air_date', { nullable: true }),
		name: t.exposeString('name'),
		vote_average: t.exposeFloat('vote_average'),
		vote_count: t.exposeInt('vote_count'),
		credit_id: t.exposeID('credit_id', { nullable: true }),
		department: t.exposeString('department', { nullable: true }),
		episode_count: t.exposeInt('episode_count', { nullable: true }),
		job: t.exposeString('job', { nullable: true }),
	}),
});

builder.objectType(PersonsKnownForShowRes, {
	name: 'PersonsKnownForShowRes',
	fields: t => ({
		id: t.exposeID('id'),
		cast: t.expose('cast', { type: [PersonsKnownForShowCast] }),
		crew: t.expose('crew', { type: [PersonsKnownForShowCrew] }),
	}),
});
