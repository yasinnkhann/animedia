import { objectType, extendType, stringArg, nonNull } from 'nexus';
import axios from 'axios';
import { BASE_URL } from '../../utils/base_url';

export const Movie = objectType({
	name: 'Movie',
	definition(t) {
		t.nonNull.int('page');
		t.nonNull.int('total_pages');
		t.nonNull.int('total_results');
	},
});

export const getMovies = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('movies', {
			type: 'Movie',
			resolve: async (_parent, _args, ctx) => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
				);

				return data;
			},
		});
	},
});
