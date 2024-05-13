import { list, nonNull, objectType } from 'nexus';

export const UserObjects = {
	UserMovie: objectType({
		name: 'UserMovie',
		definition(t) {
			t.id('id');
			t.string('name');
			t.field('status', {
				type: 'WatchStatusTypes',
			});
			t.int('rating');
		},
	}),
	UserShow: objectType({
		name: 'UserShow',
		definition(t) {
			t.id('id');
			t.string('name');
			t.field('status', {
				type: 'WatchStatusTypes',
			});
			t.int('rating');
			t.int('current_episode');
		},
	}),
	User: objectType({
		name: 'User',
		definition(t) {
			t.id('id');
			t.string('name');
			t.string('email');
			t.date('emailVerified');
			t.string('image');
			t.string('password');
			t.date('created_at');
			t.list.field('movies', {
				type: 'UserMovie',
			});
			t.list.field('shows', {
				type: 'UserShow',
			});
		},
	}),
	ErrorRes: objectType({
		name: 'ErrorRes',
		definition(t) {
			t.nonNull.string('message');
		},
	}),
	RegisteredUserRes: objectType({
		name: 'RegisteredUserRes',
		definition(t) {
			t.nonNull.list.field('errors', {
				type: nonNull('ErrorRes'),
			});
			t.field('createdUser', {
				type: 'User',
			});
		},
	}),
	RedisRes: objectType({
		name: 'RedisRes',
		definition(t) {
			t.field('errors', {
				type: nonNull(list(nonNull('ErrorRes'))),
			});
			t.field('token', {
				type: 'String',
			});
			t.field('userId', {
				type: 'String',
			});
		},
	}),
	AccountVerifiedRes: objectType({
		name: 'AccountVerifiedRes',
		definition(t) {
			t.nonNull.field('errors', {
				type: nonNull(list(nonNull('ErrorRes'))),
			});
			t.field('id', {
				type: 'String',
			});
			t.field('emailVerified', {
				type: 'DateTime',
			});
		},
	}),
};

export const MovieObjects = {
	MovieResult: objectType({
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
	}),
	MoviesRes: objectType({
		name: 'MoviesRes',
		definition(t) {
			t.nonNull.int('page');
			t.nonNull.int('total_pages');
			t.nonNull.int('total_results');
			t.nonNull.list.field('results', {
				type: nonNull('MovieResult'),
			});
		},
	}),
	MovieDetailsGenre: objectType({
		name: 'MovieDetailsGenre',
		definition(t) {
			t.nonNull.id('id');
			t.nonNull.string('name');
		},
	}),
	MovieDetailsProdCompany: objectType({
		name: 'MovieDetailsProdCompany',
		definition(t) {
			t.nonNull.id('id');
			t.string('logo_path');
			t.nonNull.string('name');
			t.nonNull.string('origin_country');
		},
	}),
	MovieDetailsProdCountry: objectType({
		name: 'MovieDetailsProdCountry',
		definition(t) {
			t.nonNull.string('iso_3166_1');
			t.nonNull.string('name');
		},
	}),
	MovieDetailsSpokenLang: objectType({
		name: 'MovieDetailsSpokenLang',
		definition(t) {
			t.nonNull.string('english_name');
			t.nonNull.string('iso_639_1');
			t.nonNull.string('name');
		},
	}),
	MovieDetailsRes: objectType({
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
				type: 'MovieDetailsProdCompany',
			});
			t.nonNull.list.field('production_countries', {
				type: 'MovieDetailsProdCountry',
			});
			t.string('release_date');
			t.bigint('revenue');
			t.int('runtime');
			t.nonNull.list.field('spoken_languages', {
				type: 'MovieDetailsSpokenLang',
			});
			t.nonNull.string('status');
			t.nonNull.string('tagline');
			t.nonNull.string('title');
			t.boolean('video');
			t.float('vote_average');
			t.nonNull.int('vote_count');
		},
	}),
	MovieReviewAuthorDetails: objectType({
		name: 'MovieReviewAuthorDetails',
		definition(t) {
			t.nonNull.string('name');
			t.nonNull.string('username');
			t.string('avatar_path');
			t.float('rating');
		},
	}),
	MovieReviewsResult: objectType({
		name: 'MovieReviewsResult',
		definition(t) {
			t.nonNull.string('author');
			t.nonNull.field('author_details', {
				type: 'MovieReviewAuthorDetails',
			});
			t.nonNull.string('content');
			t.nonNull.string('created_at');
			t.nonNull.id('id');
			t.nonNull.string('updated_at');
			t.nonNull.string('url');
		},
	}),
	MovieReviewsRes: objectType({
		name: 'MovieReviewsRes',
		definition(t) {
			t.nonNull.id('id'),
				t.nonNull.int('page'),
				t.nonNull.int('total_pages'),
				t.nonNull.int('total_results');
			t.nonNull.list.field('results', {
				type: 'MovieReviewsResult',
			});
		},
	}),
	TheatreDates: objectType({
		name: 'TheatreDates',
		definition(t) {
			t.nonNull.string('maximum');
			t.nonNull.string('minimum');
		},
	}),
	MoviesInTheatresRes: objectType({
		name: 'MoviesInTheatresRes',
		definition(t) {
			t.nonNull.field('dates', {
				type: 'TheatreDates',
			});
			t.nonNull.string('page');
			t.nonNull.int('total_pages');
			t.nonNull.int('total_results');
			t.nonNull.list.field('results', {
				type: 'MovieResult',
			});
		},
	}),
	MoviesCastModel: objectType({
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
	}),
	MoviesCrewModel: objectType({
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
	}),
	MoviesCastCrewRes: objectType({
		name: 'MoviesCastCrewRes',
		definition(t) {
			t.id('id');
			t.list.field('cast', {
				type: 'MoviesCastModel',
			});
			t.list.field('crew', {
				type: 'MoviesCrewModel',
			});
		},
	}),
};

export const ShowObjects = {
	ShowResult: objectType({
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
	}),
	ShowsRes: objectType({
		name: 'ShowsRes',
		definition(t) {
			t.nonNull.int('page');
			t.nonNull.int('total_pages');
			t.nonNull.int('total_results');
			t.nonNull.list.field('results', {
				type: nonNull('ShowResult'),
			});
		},
	}),
	ShowDetailsCreatedBy: objectType({
		name: 'ShowDetailsCreatedBy',
		definition(t) {
			t.id('id');
			t.id('credit_id');
			t.string('name');
			t.int('gender');
			t.string('profile_path');
		},
	}),
	ShowDetailsGenre: objectType({
		name: 'ShowDetailsGenre',
		definition(t) {
			t.nonNull.id('id');
			t.nonNull.string('name');
		},
	}),
	ShowDetailsLastEpToAir: objectType({
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
	}),
	ShowDetailsNetwork: objectType({
		name: 'ShowDetailsNetwork',
		definition(t) {
			t.nonNull.id('id');
			t.nonNull.string('name');
			t.string('logo_path');
			t.nonNull.string('origin_country');
		},
	}),
	ShowDetailsProdCompany: objectType({
		name: 'ShowDetailsProdCompany',
		definition(t) {
			t.nonNull.id('id');
			t.string('logo_path');
			t.nonNull.string('name');
			t.nonNull.string('origin_country');
		},
	}),
	ShowDetailsCountry: objectType({
		name: 'ShowDetailsCountry',
		definition(t) {
			t.nonNull.string('iso_3166_1');
			t.nonNull.string('name');
		},
	}),
	ShowDetailsSeason: objectType({
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
	}),
	ShowDetailsSpokenLang: objectType({
		name: 'ShowDetailsSpokenLang',
		definition(t) {
			t.nonNull.string('english_name');
			t.nonNull.string('iso_639_1');
			t.nonNull.string('name');
		},
	}),
	ShowDetailsNextEpToAir: objectType({
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
	}),
	ShowDetailsRes: objectType({
		name: 'ShowDetailsRes',
		definition(t) {
			t.nonNull.boolean('adult');
			t.string('backdrop_path');
			t.nonNull.list.field('created_by', {
				type: 'ShowDetailsCreatedBy',
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
				type: 'ShowDetailsProdCompany',
			});
			t.nonNull.list.field('production_countries', {
				type: 'ShowDetailsCountry',
			});
			t.nonNull.list.field('seasons', {
				type: 'ShowDetailsSeason',
			});
			t.nonNull.list.field('spoken_languages', {
				type: 'ShowDetailsSpokenLang',
			});
			t.nonNull.string('status');
			t.nonNull.string('tagline');
			t.nonNull.string('type');
			t.float('vote_average');
			t.int('vote_count');
		},
	}),
	ShowReviewAuthorDetails: objectType({
		name: 'ShowReviewAuthorDetails',
		definition(t) {
			t.nonNull.string('name');
			t.nonNull.string('username');
			t.string('avatar_path');
			t.float('rating');
		},
	}),
	ShowReviewResult: objectType({
		name: 'ShowReviewResult',
		definition(t) {
			t.nonNull.string('author');
			t.nonNull.field('author_details', {
				type: 'ShowReviewAuthorDetails',
			});
			t.nonNull.string('content');
			t.nonNull.string('created_at');
			t.nonNull.id('id');
			t.nonNull.string('updated_at');
			t.nonNull.string('url');
		},
	}),
	ShowReviewRes: objectType({
		name: 'ShowReviewRes',
		definition(t) {
			t.nonNull.id('id'),
				t.nonNull.int('page'),
				t.nonNull.int('total_pages'),
				t.nonNull.int('total_results');
			t.nonNull.list.field('results', {
				type: 'ShowReviewResult',
			});
		},
	}),
	ShowsCastModel: objectType({
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
	}),
	ShowsCrewModel: objectType({
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
	}),
	ShowsCastCrewRes: objectType({
		name: 'ShowsCastCrewRes',
		definition(t) {
			t.id('id');
			t.list.field('cast', {
				type: 'ShowsCastModel',
			});
			t.list.field('crew', {
				type: 'ShowsCrewModel',
			});
		},
	}),
	EpisodeDetailsRes: objectType({
		name: 'EpisodeDetailsRes',
		definition(t) {
			t.string('air_date');
			t.list.field('crew', {
				type: 'ShowsCrewModel',
			});
			t.int('episode_number');
			t.list.field('guest_stars', {
				type: 'ShowsCastModel',
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
	}),
};

export const GameObjects = {
	GameRes: objectType({
		name: 'GameRes',
		definition(t) {
			t.id('id');
			t.list.id('age_ratings');
			t.list.id('alternative_names');
			t.list.id('artworks');
			t.list.id('bundles');
			t.id('category');
			t.id('checksum');
			t.id('collection');
			t.list.id('collections');
			t.id('cover');
			t.date('created_at');
			t.list.id('dlcs');
			t.list.id('expanded_games');
			t.list.id('expansions');
			t.list.id('external_games');
			t.bigint('first_release_date');
			t.list.id('forks');
			t.id('franchise');
			t.list.id('franchises');
			t.list.id('game_engines');
			t.list.id('game_localizations');
			t.list.id('game_modes');
			t.list.id('genres');
			t.int('hypes');
			t.list.id('involved_companies');
			t.list.id('keywords');
			t.list.id('language_supports');
			t.list.id('multiplayer_modes');
			t.string('name');
			t.id('parent_game');
			t.list.id('platforms');
			t.list.id('player_perspectives');
			t.list.id('ports');
			t.float('rating');
			t.int('rating_count');
			t.list.id('release_dates');
			t.list.id('remakes');
			t.list.id('remasters');
			t.list.id('screenshots');
			t.list.id('similar_games');
			t.string('slug');
			t.list.id('standalone_expansions');
			t.id('status');
			t.string('storyline');
			t.string('summary');
			t.list.id('tags');
			t.list.id('themes');
			t.float('total_rating');
			t.int('total_rating_count');
			t.date('updated_at');
			t.string('url');
			t.id('version_parent');
			t.string('version_title');
			t.list.id('videos');
			t.list.id('websites');
		},
	}),
};
