import { IGDB_BASE_URL } from 'utils/constants';
import { postIGDB } from '../utils';
import { extendType, nonNull, stringArg, list } from 'nexus';

export const GameQueries = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('games', {
			type: list('GameRes'),
			args: {
				q: nonNull(stringArg()),
			},
			resolve: async (_parent, { q }) => {
				try {
					q = q.split(' ').join('+');
					const res = await postIGDB(
						`${IGDB_BASE_URL}/games?fields=*&search=${q}`
					);
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
	},
});
