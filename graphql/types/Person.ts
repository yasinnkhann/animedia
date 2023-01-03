import { objectType, extendType, nonNull, intArg, stringArg } from 'nexus';
import { BASE_URL } from '../../utils/URLs';

export const KnownForResult = objectType({
	name: 'KnownForResult',
	definition(t) {
		t.boolean('adult');
		t.string('backdrop_path');
		t.list.int('genre_ids');
		t.int('id');
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
		t.nonNull.int('id');
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

export const PopularPeople = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularPeople', {
			type: 'PeopleRes',
			args: {
				page: intArg(),
			},
			resolve: async (_parent, { page }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/person/popular?api_key=${process.env
							.API_KEY!}&language=en-US&page=${page ?? 1}`
					);
					const data = await res.json();

					return data;
				} catch (err) {
					console.error(err);
				}
			},
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
		t.nonNull.int('id');
		t.string('imdb_id');
		t.string('known_for_department');
		t.string('name');
		t.string('place_of_birth');
		t.float('popularity');
		t.string('profile_path');
	},
});

export const PersonDetails = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('personDetails', {
			type: 'PersonDetailsRes',
			args: {
				personDetailsId: nonNull(intArg()),
			},
			resolve: async (_parent, { personDetailsId }) => {
				try {
					const res = await fetch(
						`${BASE_URL}/person/${personDetailsId}?api_key=${process.env
							.API_KEY!}&language=en-US&page=1`
					);
					const data = await res.json();

					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});
	},
});

export const SearchedPeople = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('searchedPeople', {
			type: 'PeopleRes',
			args: {
				q: nonNull(stringArg()),
				page: intArg(),
			},
			resolve: async (_parent, { q, page }) => {
				q = q.split(' ').join('+');
				try {
					const res = await fetch(
						`${BASE_URL}/search/person?api_key=${process.env.API_KEY!}&page=${
							page ?? 1
						}&query=${q}`
					);
					const data = await res.json();

					return data;
				} catch (err) {
					console.error(err);
				}
			},
		});
	},
});

export const PersonsKnownForMovieCast = objectType({
	name: 'PersonsKnownForMovieCast',
	definition(t) {
		t.nonNull.boolean('adult');
		t.string('backdrop_path');
		t.nonNull.list.int('genre_ids');
		t.nonNull.int('id');
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
		t.nonNull.list.int('genre_ids');
		t.nonNull.int('id');
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
		t.int('id'),
			t.nonNull.list.field('cast', {
				type: 'PersonsKnownForMovieCast',
			});
		t.nonNull.list.field('crew', {
			type: 'PersonsKnownForMovieCrew',
		});
	},
});

export const PersonsKnownForMovie = extendType({
	type: 'Query',
	definition(t) {
		t.int('id'),
			t.nonNull.field('personsKnownForMovieRes', {
				type: 'PersonsKnownForMovieRes',
				args: {
					personsKnownForMovieResId: nonNull(intArg()),
				},
				resolve: async (_parent, { personsKnownForMovieResId }) => {
					try {
						const res = await fetch(
							`${BASE_URL}/person/${personsKnownForMovieResId}/movie_credits?api_key=${process
								.env.API_KEY!}&language=en-US`
						);
						const data = await res.json();

						return data;
					} catch (err) {
						console.error(err);
					}
				},
			});
	},
});

export const PersonsKnownForShowCast = objectType({
	name: 'PersonsKnownForShowCast',
	definition(t) {
		t.nonNull.boolean('adult');
		t.string('backdrop_path');
		t.nonNull.list.int('genre_ids');
		t.nonNull.int('id');
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
		t.nonNull.list.int('genre_ids');
		t.nonNull.int('id');
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
		t.int('id'),
			t.nonNull.list.field('cast', {
				type: 'PersonsKnownForShowCast',
			});
		t.nonNull.list.field('crew', {
			type: 'PersonsKnownForShowCrew',
		});
	},
});

export const PersonsKnownForShow = extendType({
	type: 'Query',
	definition(t) {
		t.int('id'),
			t.nonNull.field('personsKnownForShowRes', {
				type: 'PersonsKnownForShowRes',
				args: {
					personsKnownForShowResId: nonNull(intArg()),
				},
				resolve: async (_parent, { personsKnownForShowResId }) => {
					try {
						const res = await fetch(
							`${BASE_URL}/person/${personsKnownForShowResId}/tv_credits?api_key=${process
								.env.API_KEY!}&language=en-US`
						);
						const data = await res.json();

						return data;
					} catch (err) {
						console.error(err);
					}
				},
			});
	},
});
