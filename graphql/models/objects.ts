import { list, nonNull, objectType } from 'nexus';

export const userObjects = {
	userMovie: objectType({
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
	userShow: objectType({
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
	userGame: objectType({
		name: 'UserGame',
		definition(t) {
			t.id('id');
			t.string('name');
			t.int('rating');
		},
	}),
	user: objectType({
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
	errorRes: objectType({
		name: 'ErrorRes',
		definition(t) {
			t.nonNull.string('message');
		},
	}),
	registeredUserRes: objectType({
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
	redisRes: objectType({
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
	accountVerifiedRes: objectType({
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

export const movieObjects = {
	movieResult: objectType({
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
	moviesRes: objectType({
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
	movieDetailsGenre: objectType({
		name: 'MovieDetailsGenre',
		definition(t) {
			t.nonNull.id('id');
			t.nonNull.string('name');
		},
	}),
	movieDetailsProdCompany: objectType({
		name: 'MovieDetailsProdCompany',
		definition(t) {
			t.nonNull.id('id');
			t.string('logo_path');
			t.nonNull.string('name');
			t.nonNull.string('origin_country');
		},
	}),
	movieDetailsProdCountry: objectType({
		name: 'MovieDetailsProdCountry',
		definition(t) {
			t.nonNull.string('iso_3166_1');
			t.nonNull.string('name');
		},
	}),
	movieDetailsSpokenLang: objectType({
		name: 'MovieDetailsSpokenLang',
		definition(t) {
			t.nonNull.string('english_name');
			t.nonNull.string('iso_639_1');
			t.nonNull.string('name');
		},
	}),
	movieDetailsRes: objectType({
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
	}),
	movieReviewAuthorDetails: objectType({
		name: 'MovieReviewAuthorDetails',
		definition(t) {
			t.nonNull.string('name');
			t.nonNull.string('username');
			t.string('avatar_path');
			t.float('rating');
		},
	}),
	movieReviewsResult: objectType({
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
	}),
	movieReviewsRes: objectType({
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
	}),
	theatreDates: objectType({
		name: 'TheatreDates',
		definition(t) {
			t.nonNull.string('maximum');
			t.nonNull.string('minimum');
		},
	}),
	moviesInTheatresRes: objectType({
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
	}),
	moviesCastModel: objectType({
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
	moviesCrewModel: objectType({
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
	moviesCastCrewRes: objectType({
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
	}),
};

export const showObjects = {
	showResult: objectType({
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
	showsRes: objectType({
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
	showDetailsCreatedBy: objectType({
		name: 'ShowDetailsCreatedBy',
		definition(t) {
			t.id('id');
			t.id('credit_id');
			t.string('name');
			t.int('gender');
			t.string('profile_path');
		},
	}),
	showDetailsGenre: objectType({
		name: 'ShowDetailsGenre',
		definition(t) {
			t.nonNull.id('id');
			t.nonNull.string('name');
		},
	}),
	showDetailsLastEpToAir: objectType({
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
	showDetailsNetwork: objectType({
		name: 'ShowDetailsNetwork',
		definition(t) {
			t.nonNull.id('id');
			t.nonNull.string('name');
			t.string('logo_path');
			t.nonNull.string('origin_country');
		},
	}),
	showDetailsProdCompany: objectType({
		name: 'ShowDetailsProdCompany',
		definition(t) {
			t.nonNull.id('id');
			t.string('logo_path');
			t.nonNull.string('name');
			t.nonNull.string('origin_country');
		},
	}),
	showDetailsCountry: objectType({
		name: 'ShowDetailsCountry',
		definition(t) {
			t.nonNull.string('iso_3166_1');
			t.nonNull.string('name');
		},
	}),
	showDetailsSeason: objectType({
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
	showDetailsSpokenLang: objectType({
		name: 'ShowDetailsSpokenLang',
		definition(t) {
			t.nonNull.string('english_name');
			t.nonNull.string('iso_639_1');
			t.nonNull.string('name');
		},
	}),
	showDetailsNextEpToAir: objectType({
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
	showDetailsRes: objectType({
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
				type: nonNull('ShowDetailsLastEpToAir'),
			});
			t.nonNull.string('name');
			t.field('next_episode_to_air', {
				type: nonNull('ShowDetailsNextEpToAir'),
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
	}),
	showReviewAuthorDetails: objectType({
		name: 'ShowReviewAuthorDetails',
		definition(t) {
			t.nonNull.string('name');
			t.nonNull.string('username');
			t.string('avatar_path');
			t.float('rating');
		},
	}),
	showReviewResult: objectType({
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
	}),
	showReviewRes: objectType({
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
	}),
	showsCastModel: objectType({
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
	showsCrewModel: objectType({
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
	showsCastCrewRes: objectType({
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
	}),
	episodeDetailsRes: objectType({
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
	}),
};

export const gameObjects = {
	gameResult: objectType({
		name: 'GameResult',
		definition(t) {
			t.nonNull.id('id');
			t.list.id('age_ratings');
			t.list.id('alternative_names');
			t.list.id('artworks');
			t.list.id('bundles');
			t.id('category');
			t.id('checksum');
			t.id('collection');
			t.list.id('collections');
			t.id('cover');
			t.string('coverUrl');
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
			t.list.nonNull.id('genres');
			t.int('hypes');
			t.list.id('involved_companies');
			t.list.id('keywords');
			t.list.id('language_supports');
			t.list.id('multiplayer_modes');
			t.nonNull.string('name');
			t.id('parent_game');
			t.list.nonNull.id('platforms');
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
			t.list.nonNull.id('themes');
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
	gamesRes: objectType({
		name: 'GamesRes',
		definition(t) {
			t.nonNull.int('total_results');
			t.nonNull.list.field('results', {
				type: nonNull('GameResult'),
			});
		},
	}),
	gamePlatform: objectType({
		name: 'GamePlatform',
		definition(t) {
			t.nonNull.id('id');
			t.nonNull.string('name');
		},
	}),
	gameCompany: objectType({
		name: 'GameCompany',
		definition(t) {
			t.nonNull.id('id');
			t.string('country');
			t.string('description');
			t.list.nonNull.id('developed');
			t.id('logo');
			t.nonNull.string('name');
			t.list.nonNull.id('published');
		},
	}),
	gameTheme: objectType({
		name: 'GameTheme',
		definition(t) {
			t.nonNull.id('id');
			t.nonNull.string('name');
		},
	}),
	relatedGame: objectType({
		name: 'RelatedGame',
		definition(t) {
			t.nonNull.string('id');
			t.nonNull.string('name');
			t.bigint('first_release_date');
			t.float('rating');
			t.id('cover');
			t.string('coverUrl');
		},
	}),
	gameCollections: objectType({
		name: 'GameCollections',
		definition(t) {
			t.nonNull.id('id');
			t.nonNull.string('name');
			t.nonNull.list.field('games', {
				type: nonNull('RelatedGame'),
			});
		},
	}),
	gamePreview: objectType({
		name: 'GamePreview',
		definition(t) {
			t.nonNull.id('id');
			t.nonNull.id('game');
			t.string('url');
			t.string('video_id');
			t.string('name');
		},
	}),
	gameGenre: objectType({
		name: 'GameGenre',
		definition(t) {
			t.nonNull.id('id');
			t.nonNull.string('name');
		},
	}),
	character: objectType({
		name: 'GameCharacter',
		definition(t) {
			t.nonNull.id('id');
			t.string('country_name');
			t.string('description');
			t.nonNull.list.nonNull.id('games');
			t.int('gender');
			t.id('mug_shot');
			t.string('mugShotUrl');
			t.nonNull.string('name');
			t.int('species');
		},
	}),
};
