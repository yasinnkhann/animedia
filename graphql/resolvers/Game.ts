import { IGDB_BASE_URL } from 'utils/constants';
import { postIGDB } from '../utils';
import { extendType, nonNull, stringArg, list, intArg } from 'nexus';

export const GameQueries = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('games', {
			type: list('GameRes'),
			args: {
				q: nonNull(stringArg()),
				limit: intArg({ default: 500 }),
			},
			resolve: async (_parent, { q, limit }) => {
				try {
					q = q.split(' ').join('+');
					const res = await postIGDB(
						`${IGDB_BASE_URL}/games?fields=*&search=${q}&limit=${limit}`
					);
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
	},
});
