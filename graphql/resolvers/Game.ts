import { IGDB_BASE_URL } from 'utils/constants';
import { postIGDB } from '../utils';
import { extendType, nonNull, stringArg, list, intArg } from 'nexus';

export const GameQueries = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('searchGames', {
			type: list('Game'),
			args: {
				q: nonNull(stringArg()),
				limit: intArg({ default: 500 }),
			},
			resolve: async (_parent, { q, limit }) => {
				try {
					const res = await postIGDB(
						`${IGDB_BASE_URL}/games`,
						`fields *; limit ${limit}; search "${q}";`
					);
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('topRatedGames', {
			type: list('Game'),
			args: {
				limit: intArg({ default: 500 }),
			},
			resolve: async (_parent, { limit }) => {
				try {
					const res = await postIGDB(
						`${IGDB_BASE_URL}/games`,
						`fields *; sort rating desc; limit ${limit};`
					);
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('characters', {
			type: list('Character'),
			args: {
				limit: intArg({ default: 500 }),
			},
			resolve: async (_parent, { limit }) => {
				try {
					const res = await postIGDB(
						`${IGDB_BASE_URL}/characters`,
						`fields *; limit ${limit};`
					);
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
	},
});
