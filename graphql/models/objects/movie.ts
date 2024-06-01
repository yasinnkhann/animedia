import { nonNull, objectType } from 'nexus';

export const movieResult = objectType({
	name: 'MovieResult',
	definition(t) {
		t.nonNull.boolean('adult');
		t.string('backdrop_path');
		t.list.id('genre_ids');
		t.nonNull.id('id');
		t.nonNull.string('original_language');
		t.nonNull.string('original_title');
		t.nonNull.string('overview');
		t.float('popularity');
		t.string('poster_path');
		t.string('release_date');
		t.nonNull.string('title');
		t.boolean('video');
		t.float('vote_average');
		t.int('vote_count');
	},
});

export const moviesRes = objectType({
	name: 'MoviesRes',
	definition(t) {
		t.nonNull.int('page');
		t.nonNull.int('total_pages');
		t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: nonNull('MovieResult'),
		});
	},
});

export const movieDetailsGenre = objectType({
	name: 'MovieDetailsGenre',
	definition(t) {
		t.nonNull.id('id');
		t.nonNull.string('name');
	},
});

export const movieDetailsProdCompany = objectType({
	name: 'MovieDetailsProdCompany',
	definition(t) {
		t.nonNull.id('id');
		t.string('logo_path');
		t.nonNull.string('name');
		t.nonNull.string('origin_country');
	},
});

export const movieDetailsProdCountry = objectType({
	name: 'MovieDetailsProdCountry',
	definition(t) {
		t.nonNull.string('iso_3166_1');
		t.nonNull.string('name');
	},
});

export const movieDetailsSpokenLang = objectType({
	name: 'MovieDetailsSpokenLang',
	definition(t) {
		t.nonNull.string('english_name');
		t.nonNull.string('iso_639_1');
		t.nonNull.string('name');
	},
});

export const movieDetailsRes = objectType({
	name: 'MovieDetailsRes',
	definition(t) {
		t.nonNull.boolean('adult');
		t.string('backdrop_path');
		t.nonNull.list.field('genres', {
			type: nonNull('MovieDetailsGenre'),
		});
		t.nonNull.string('homepage');
		t.nonNull.id('id');
		t.id('imdb_id');
		t.nonNull.string('original_language');
		t.nonNull.string('original_title');
		t.nonNull.string('overview');
		t.float('popularity');
		t.string('poster_path');
		t.nonNull.list.field('production_companies', {
			type: nonNull('MovieDetailsProdCompany'),
		});
		t.nonNull.list.field('production_countries', {
			type: nonNull('MovieDetailsProdCountry'),
		});
		t.string('release_date');
		t.bigint('revenue');
		t.int('runtime');
		t.nonNull.list.field('spoken_languages', {
			type: nonNull('MovieDetailsSpokenLang'),
		});
		t.nonNull.string('status');
		t.nonNull.string('tagline');
		t.nonNull.string('title');
		t.boolean('video');
		t.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const movieReviewAuthorDetails = objectType({
	name: 'MovieReviewAuthorDetails',
	definition(t) {
		t.nonNull.string('name');
		t.nonNull.string('username');
		t.string('avatar_path');
		t.float('rating');
	},
});

export const movieReviewsResult = objectType({
	name: 'MovieReviewsResult',
	definition(t) {
		t.nonNull.string('author');
		t.nonNull.field('author_details', {
			type: nonNull('MovieReviewAuthorDetails'),
		});
		t.nonNull.string('content');
		t.nonNull.string('created_at');
		t.nonNull.id('id');
		t.nonNull.string('updated_at');
		t.nonNull.string('url');
	},
});

export const movieReviewsRes = objectType({
	name: 'MovieReviewsRes',
	definition(t) {
		t.nonNull.id('id'),
			t.nonNull.int('page'),
			t.nonNull.int('total_pages'),
			t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: nonNull('MovieReviewsResult'),
		});
	},
});

export const theatreDates = objectType({
	name: 'TheatreDates',
	definition(t) {
		t.nonNull.string('maximum');
		t.nonNull.string('minimum');
	},
});

export const moviesInTheatresRes = objectType({
	name: 'MoviesInTheatresRes',
	definition(t) {
		t.nonNull.field('dates', {
			type: nonNull('TheatreDates'),
		});
		t.nonNull.string('page');
		t.nonNull.int('total_pages');
		t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: nonNull('MovieResult'),
		});
	},
});

export const moviesCastModel = objectType({
	name: 'MoviesCastModel',
	definition(t) {
		t.boolean('adult');
		t.int('gender');
		t.id('id');
		t.string('known_for_department');
		t.string('name');
		t.string('original_name');
		t.float('popularity');
		t.string('profile_path');
		t.id('cast_id');
		t.string('character');
		t.id('credit_id');
		t.int('order');
	},
});

export const moviesCrewModel = objectType({
	name: 'MoviesCrewModel',
	definition(t) {
		t.boolean('adult');
		t.int('gender');
		t.id('id');
		t.string('known_for_department');
		t.string('name');
		t.string('original_name');
		t.float('popularity');
		t.string('profile_path');
		t.id('credit_id');
		t.string('department');
		t.string('job');
	},
});

export const moviesCastCrewRes = objectType({
	name: 'MoviesCastCrewRes',
	definition(t) {
		t.id('id');
		t.list.field('cast', {
			type: nonNull('MoviesCastModel'),
		});
		t.list.field('crew', {
			type: nonNull('MoviesCrewModel'),
		});
	},
});
