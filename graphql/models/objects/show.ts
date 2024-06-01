import { nonNull, objectType } from 'nexus';

export const showResult = objectType({
	name: 'ShowResult',
	definition(t) {
		t.string('backdrop_path');
		t.string('first_air_date');
		t.list.id('genre_ids');
		t.nonNull.id('id');
		t.nonNull.string('name');
		t.nonNull.list.string('origin_country');
		t.nonNull.string('original_language');
		t.nonNull.string('original_name');
		t.nonNull.string('overview');
		t.float('popularity');
		t.string('poster_path');
		t.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const showsRes = objectType({
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

export const showDetailsCreatedBy = objectType({
	name: 'ShowDetailsCreatedBy',
	definition(t) {
		t.id('id');
		t.id('credit_id');
		t.string('name');
		t.int('gender');
		t.string('profile_path');
	},
});

export const showDetailsGenre = objectType({
	name: 'ShowDetailsGenre',
	definition(t) {
		t.nonNull.id('id');
		t.nonNull.string('name');
	},
});

export const showDetailsLastEpToAir = objectType({
	name: 'ShowDetailsLastEpToAir',
	definition(t) {
		t.string('air_date');
		t.nonNull.int('episode_number');
		t.nonNull.id('id');
		t.nonNull.string('name');
		t.nonNull.string('overview');
		t.nonNull.string('production_code');
		t.int('runtime');
		t.nonNull.int('season_number');
		t.nonNull.id('show_id');
		t.string('still_path');
		t.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const showDetailsNetwork = objectType({
	name: 'ShowDetailsNetwork',
	definition(t) {
		t.nonNull.id('id');
		t.nonNull.string('name');
		t.string('logo_path');
		t.nonNull.string('origin_country');
	},
});

export const showDetailsProdCompany = objectType({
	name: 'ShowDetailsProdCompany',
	definition(t) {
		t.nonNull.id('id');
		t.string('logo_path');
		t.nonNull.string('name');
		t.nonNull.string('origin_country');
	},
});

export const showDetailsCountry = objectType({
	name: 'ShowDetailsCountry',
	definition(t) {
		t.nonNull.string('iso_3166_1');
		t.nonNull.string('name');
	},
});

export const showDetailsSeason = objectType({
	name: 'ShowDetailsSeason',
	definition(t) {
		t.string('air_date');
		t.nonNull.int('episode_count');
		t.nonNull.id('id');
		t.nonNull.string('name');
		t.nonNull.string('overview');
		t.string('poster_path');
		t.nonNull.int('season_number');
	},
});

export const showDetailsSpokenLang = objectType({
	name: 'ShowDetailsSpokenLang',
	definition(t) {
		t.nonNull.string('english_name');
		t.nonNull.string('iso_639_1');
		t.nonNull.string('name');
	},
});

export const showDetailsNextEpToAir = objectType({
	name: 'ShowDetailsNextEpToAir',
	definition(t) {
		t.string('air_date');
		t.nonNull.int('episode_number');
		t.nonNull.id('id');
		t.nonNull.string('name');
		t.nonNull.string('overview');
		t.nonNull.string('production_code');
		t.int('runtime');
		t.nonNull.int('season_number');
		t.nonNull.id('show_id');
		t.string('still_path');
		t.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const showDetailsRes = objectType({
	name: 'ShowDetailsRes',
	definition(t) {
		t.nonNull.boolean('adult');
		t.string('backdrop_path');
		t.nonNull.list.field('created_by', {
			type: nonNull('ShowDetailsCreatedBy'),
		});
		t.nonNull.list.int('episode_run_time');
		t.string('first_air_date');
		t.nonNull.list.field('genres', {
			type: nonNull('ShowDetailsGenre'),
		});
		t.nonNull.string('homepage');
		t.nonNull.id('id');
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
		t.float('popularity');
		t.string('poster_path');
		t.nonNull.list.field('production_companies', {
			type: nonNull('ShowDetailsProdCompany'),
		});
		t.nonNull.list.field('production_countries', {
			type: nonNull('ShowDetailsCountry'),
		});
		t.nonNull.list.field('seasons', {
			type: nonNull('ShowDetailsSeason'),
		});
		t.nonNull.list.field('spoken_languages', {
			type: nonNull('ShowDetailsSpokenLang'),
		});
		t.nonNull.string('status');
		t.nonNull.string('tagline');
		t.nonNull.string('type');
		t.float('vote_average');
		t.int('vote_count');
	},
});

export const showReviewAuthorDetails = objectType({
	name: 'ShowReviewAuthorDetails',
	definition(t) {
		t.nonNull.string('name');
		t.nonNull.string('username');
		t.string('avatar_path');
		t.float('rating');
	},
});

export const showReviewResult = objectType({
	name: 'ShowReviewResult',
	definition(t) {
		t.nonNull.string('author');
		t.nonNull.field('author_details', {
			type: nonNull('ShowReviewAuthorDetails'),
		});
		t.nonNull.string('content');
		t.nonNull.string('created_at');
		t.nonNull.id('id');
		t.nonNull.string('updated_at');
		t.nonNull.string('url');
	},
});

export const showReviewRes = objectType({
	name: 'ShowReviewRes',
	definition(t) {
		t.nonNull.id('id'),
			t.nonNull.int('page'),
			t.nonNull.int('total_pages'),
			t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: nonNull('ShowReviewResult'),
		});
	},
});

export const showsCastModel = objectType({
	name: 'ShowsCastModel',
	definition(t) {
		t.boolean('adult');
		t.int('gender');
		t.id('id');
		t.string('known_for_department');
		t.string('name');
		t.string('original_name');
		t.float('popularity');
		t.string('profile_path');
		t.string('character');
		t.id('credit_id');
		t.int('order');
	},
});

export const showsCrewModel = objectType({
	name: 'ShowsCrewModel',
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

export const showsCastCrewRes = objectType({
	name: 'ShowsCastCrewRes',
	definition(t) {
		t.id('id');
		t.list.field('cast', {
			type: nonNull('ShowsCastModel'),
		});
		t.list.field('crew', {
			type: nonNull('ShowsCrewModel'),
		});
	},
});

export const episodeDetailsRes = objectType({
	name: 'EpisodeDetailsRes',
	definition(t) {
		t.string('air_date');
		t.list.field('crew', {
			type: nonNull('ShowsCrewModel'),
		});
		t.int('episode_number');
		t.list.field('guest_stars', {
			type: nonNull('ShowsCastModel'),
		});
		t.string('name');
		t.string('overview');
		t.id('id');
		t.string('production_code');
		t.int('runtime');
		t.int('season_number');
		t.string('still_path');
		t.float('vote_average');
		t.int('vote_count');
	},
});
