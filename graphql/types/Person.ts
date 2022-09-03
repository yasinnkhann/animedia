import { objectType, extendType, nonNull, intArg, stringArg } from 'nexus';
import axios from 'axios';
import { BASE_URL } from '../../utils/URLs';
import 'dotenv/config';

export const knownForResult = objectType({
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

export const personResult = objectType({
	name: 'PersonResult',
	definition(t) {
		t.nonNull.boolean('adult');
		t.nonNull.int('gender');
		t.nonNull.int('id');
		t.nonNull.list.field('known_for', {
			type: nonNull('KnownForResult'),
		});
		t.nonNull.string('known_for_department');
		t.nonNull.string('name');
		t.nonNull.float('popularity');
		t.string('profile_path');
	},
});

export const people = objectType({
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

export const getPopularPeople = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularPeople', {
			type: 'PeopleRes',
			resolve: async () => {
				const { data } = await axios.get(
					`${BASE_URL}/person/popular?api_key=${process.env
						.API_KEY!}&language=en-US&page=1`
				);

				return data;
			},
		});
	},
});

export const personDetails = objectType({
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

export const getPersonDetails = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('personDetails', {
			type: 'PersonDetailsRes',
			args: {
				id: nonNull(intArg()),
			},
			resolve: async (_parent, { id }) => {
				const { data } = await axios.get(
					`${BASE_URL}/person/${id}?api_key=${process.env
						.API_KEY!}&language=en-US&page=1`
				);

				return data;
			},
		});
	},
});

export const getSearchedPeople = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('searchedPeople', {
			type: 'PeopleRes',
			args: {
				q: nonNull(stringArg()),
			},
			resolve: async (_parent, { q }) => {
				q = q.split(' ').join('+');
				const { data } = await axios.get(
					`${BASE_URL}/search/person?api_key=${process.env.API_KEY!}&query=${q}`
				);

				return data;
			},
		});
	},
});
