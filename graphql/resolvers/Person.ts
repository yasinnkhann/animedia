import { objectType, extendType, nonNull, intArg, stringArg, idArg } from 'nexus';
import { tmdbClient } from '@lib/api';
import { safeResolver } from '../utils/resolver-helpers';
import {
	parseInput,
	PaginationInput,
	PersonDetailsInput,
	PersonSearchInput,
} from '../validations/inputs';

export const KnownForResult = objectType({
	name: 'KnownForResult',
	definition(t) {
		t.boolean('adult');
		t.string('backdrop_path');
		t.list.id('genre_ids');
		t.id('id');
		t.string('media_type');
		t.string('original_language');
		t.string('original_title');
		t.string('overview');
		t.string('poster_path');
		t.string('release_date');
		t.string('title');
		t.boolean('video');
		t.float('vote_average');
		t.int('vote_count');
	},
});

export const PersonResult = objectType({
	name: 'PersonResult',
	definition(t) {
		t.nonNull.boolean('adult');
		t.nonNull.int('gender');
		t.nonNull.id('id');
		t.nonNull.list.field('known_for', {
			type: nonNull('KnownForResult'),
		});
		t.string('known_for_department');
		t.nonNull.string('name');
		t.nonNull.float('popularity');
		t.string('profile_path');
	},
});

export const PeopleRes = objectType({
	name: 'PeopleRes',
	definition(t) {
		t.nonNull.int('page');
		t.nonNull.int('total_pages');
		t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: nonNull('PersonResult'),
		});
	},
});

export const PersonDetailsRes = objectType({
	name: 'PersonDetailsRes',
	definition(t) {
		t.boolean('adult');
		t.list.string('also_known_as');
		t.string('biography');
		t.string('birthday');
		t.string('deathday');
		t.int('gender');
		t.string('homepage');
		t.nonNull.id('id');
		t.id('imdb_id');
		t.string('known_for_department');
		t.string('name');
		t.string('place_of_birth');
		t.float('popularity');
		t.string('profile_path');
	},
});

export const PersonsKnownForMovieCast = objectType({
	name: 'PersonsKnownForMovieCast',
	definition(t) {
		t.nonNull.boolean('adult');
		t.string('backdrop_path');
		t.nonNull.list.id('genre_ids');
		t.nonNull.id('id');
		t.nonNull.string('original_language');
		t.nonNull.string('original_title');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.string('poster_path');
		t.string('release_date');
		t.nonNull.string('title');
		t.nonNull.boolean('video');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
		t.string('character');
		t.id('credit_id');
		t.int('order');
	},
});

export const PersonsKnownForMovieCrew = objectType({
	name: 'PersonsKnownForMovieCrew',
	definition(t) {
		t.nonNull.boolean('adult');
		t.string('backdrop_path');
		t.nonNull.list.id('genre_ids');
		t.nonNull.id('id');
		t.nonNull.string('original_language');
		t.nonNull.string('original_title');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.string('poster_path');
		t.string('release_date');
		t.nonNull.string('title');
		t.nonNull.boolean('video');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
		t.id('credit_id');
		t.string('department');
		t.string('job');
	},
});

export const PersonsKnownForMovieRes = objectType({
	name: 'PersonsKnownForMovieRes',
	definition(t) {
		t.id('id');
		t.nonNull.list.field('cast', {
			type: 'PersonsKnownForMovieCast',
		});
		t.nonNull.list.field('crew', {
			type: 'PersonsKnownForMovieCrew',
		});
	},
});

export const PersonsKnownForShowCast = objectType({
	name: 'PersonsKnownForShowCast',
	definition(t) {
		t.nonNull.boolean('adult');
		t.string('backdrop_path');
		t.nonNull.list.id('genre_ids');
		t.nonNull.id('id');
		t.nonNull.list.string('origin_country');
		t.nonNull.string('original_language');
		t.nonNull.string('original_name');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.string('poster_path');
		t.string('first_air_date');
		t.nonNull.string('name');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
		t.string('character');
		t.id('credit_id');
		t.int('episode_count');
	},
});

export const PersonsKnownForShowCrew = objectType({
	name: 'PersonsKnownForShowCrew',
	definition(t) {
		t.nonNull.boolean('adult');
		t.string('backdrop_path');
		t.nonNull.list.id('genre_ids');
		t.nonNull.id('id');
		t.nonNull.list.string('origin_country');
		t.nonNull.string('original_language');
		t.nonNull.string('original_name');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.string('poster_path');
		t.string('first_air_date');
		t.nonNull.string('name');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
		t.id('credit_id');
		t.string('department');
		t.int('episode_count');
		t.string('job');
	},
});

export const PersonsKnownForShowRes = objectType({
	name: 'PersonsKnownForShowRes',
	definition(t) {
		t.id('id'),
			t.nonNull.list.field('cast', {
				type: 'PersonsKnownForShowCast',
			});
		t.nonNull.list.field('crew', {
			type: 'PersonsKnownForShowCrew',
		});
	},
});

export const PopularQueries = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularPeople', {
			type: 'PeopleRes',
			args: {
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { page }) => {
				const { page: validatedPage } = parseInput(PaginationInput, { page });
				return await tmdbClient.getPopularPeople(validatedPage);
			}),
		});

		t.nonNull.field('personDetails', {
			type: 'PersonDetailsRes',
			args: {
				personDetailsId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { personDetailsId }) => {
				const input = parseInput(PersonDetailsInput, { personDetailsId });
				return await tmdbClient.getPersonDetails(input.personDetailsId);
			}),
		});

		t.nonNull.field('searchedPeople', {
			type: 'PeopleRes',
			args: {
				q: nonNull(stringArg()),
				page: intArg({ default: 1 }),
			},
			resolve: safeResolver(async (_parent, { q, page }) => {
				const input = parseInput(PersonSearchInput, { q, page });
				return await tmdbClient.searchPeople(input.q, input.page);
			}),
		});

		t.nonNull.field('personsKnownForMovie', {
			type: 'PersonsKnownForMovieRes',
			args: {
				personsKnownForMovieResId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { personsKnownForMovieResId }) => {
				return await tmdbClient.getPersonMovieCredits(personsKnownForMovieResId);
			}),
		});

		t.nonNull.field('personsKnownForShow', {
			type: 'PersonsKnownForShowRes',
			args: {
				personsKnownForShowResId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { personsKnownForShowResId }) => {
				return await tmdbClient.getPersonShowCredits(personsKnownForShowResId);
			}),
		});
	},
});
