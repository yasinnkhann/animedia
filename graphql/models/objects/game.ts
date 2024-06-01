import { nonNull, objectType } from 'nexus';

export const gameResult = objectType({
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
});

export const gamesRes = objectType({
	name: 'GamesRes',
	definition(t) {
		t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: nonNull('GameResult'),
		});
	},
});

export const gamePlatform = objectType({
	name: 'GamePlatform',
	definition(t) {
		t.nonNull.id('id');
		t.nonNull.string('name');
	},
});

export const gameCompany = objectType({
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
});

export const gameTheme = objectType({
	name: 'GameTheme',
	definition(t) {
		t.nonNull.id('id');
		t.nonNull.string('name');
	},
});

export const relatedGame = objectType({
	name: 'RelatedGame',
	definition(t) {
		t.nonNull.string('id');
		t.nonNull.string('name');
		t.bigint('first_release_date');
		t.float('rating');
		t.id('cover');
		t.string('coverUrl');
	},
});

export const gameCollections = objectType({
	name: 'GameCollections',
	definition(t) {
		t.nonNull.id('id');
		t.nonNull.string('name');
		t.nonNull.list.field('games', {
			type: nonNull('RelatedGame'),
		});
	},
});

export const gamePreview = objectType({
	name: 'GamePreview',
	definition(t) {
		t.nonNull.id('id');
		t.nonNull.id('game');
		t.string('url');
		t.string('video_id');
		t.string('name');
	},
});

export const gameGenre = objectType({
	name: 'GameGenre',
	definition(t) {
		t.nonNull.id('id');
		t.nonNull.string('name');
	},
});

export const character = objectType({
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
});
