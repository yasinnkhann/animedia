import { objectType, extendType, nonNull, stringArg } from 'nexus';
import axios from 'axios';
import { BASE_URL } from '../../utils/base_url';

export const ShowResults = objectType({
	name: 'ShowResult',
	definition(t) {
		t.nonNull.string('backdrop_path');
		t.nonNull.string('first_air_date');
		t.nonNull.list.int('genre_ids');
		t.nonNull.int('id');
		t.nonNull.string('name');
		t.nonNull.list.string('origin_country');
		t.nonNull.string('original_language');
		t.nonNull.string('original_name');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.nonNull.string('poster_path');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const Show = objectType({
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

export const getPopularShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularShows', {
			type: 'ShowsRes',
			resolve: async () => {
				const { data } = await axios.get(
					`${BASE_URL}/tv/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
				);

				return data;
			},
		});
	},
});

export const getSearchedShows = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('searchedShows', {
			type: 'ShowsRes',
			args: {
				q: nonNull(stringArg()),
			},
			resolve: async (_parent, { q }) => {
				q = q.split(' ').join('+');
				const { data } = await axios.get(
					`${BASE_URL}/search/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${q}`
				);

				return data;
			},
		});
	},
});
