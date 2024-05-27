import { IGDB_BASE_API_URL } from 'utils/constants';
import { postIGDB, addIGDBCoverUrl } from '../utils';
import { extendType, nonNull, stringArg, list, intArg, idArg } from 'nexus';

export const GameQueries = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('searchGames', {
			type: 'GamesRes',
			args: {
				q: nonNull(stringArg()),
				limit: nonNull(intArg()),
				page: nonNull(intArg()),
			},
			resolve: async (_parent, { q, limit, page }) => {
				const finalRes = { results: [], total_results: 0 };

				try {
					const { count } = await postIGDB(
						`${IGDB_BASE_API_URL}/games/count`,
						`search "${q}";`
					);
					finalRes.total_results = count;
					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/games`,
						`fields *; search "${q}"; limit ${limit}; offset ${page * limit - limit};`
					);
					await addIGDBCoverUrl(res, '1080p');
					finalRes.results = res;
					return finalRes;
				} catch (err) {
					console.error(err);
				}
				return finalRes;
			},
		});
		t.nonNull.field('gameDetails', {
			type: 'GamesRes',
			args: {
				gameDetailsId: nonNull(idArg()),
			},
			resolve: async (_parent, { gameDetailsId }) => {
				const finalRes = { results: [], total_results: null };
				try {
					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/games`,
						`fields *; where id = ${gameDetailsId};`
					);
					await addIGDBCoverUrl(res, '1080p');
					finalRes.results = res;
				} catch (err) {
					console.error(err);
				}
				return finalRes;
			},
		});
		// t.nonNull.field('gamesFromGenres', {
		// 	type: 'GamesRes',
		// 	args: {
		// 		genreIds: nonNull(list(nonNull('ID'))),
		// 		limit: intArg({ default: 500 }),
		// 	},
		// 	resolve: async (_parent, { genreIds, limit }) => {
		// 		try {
		// 			const res = await postIGDB(
		// 				`${IGDB_BASE_API_URL}/games`,
		// 				`fields *; where genres = (${genreIds.join(',')}); limit ${limit};`
		// 			);
		// 			return res;
		// 		} catch (err) {
		// 			console.error(err);
		// 		}
		// 	},
		// });
		// t.nonNull.field('topRatedGames', {
		// 	type: 'GamesRes',
		// 	args: {
		// 		limit: intArg({ default: 500 }),
		// 	},
		// 	resolve: async (_parent, { limit }) => {
		// 		try {
		// 			const res = await postIGDB(
		// 				`${IGDB_BASE_API_URL}/games`,
		// 				`fields *; sort rating desc; limit ${limit};`
		// 			);
		// 			return res;
		// 		} catch (err) {
		// 			console.error(err);
		// 		}
		// 	},
		// });
		// t.nonNull.field('characters', {
		// 	type: list('Character'),
		// 	args: {
		// 		limit: intArg({ default: 500 }),
		// 	},
		// 	resolve: async (_parent, { limit }) => {
		// 		try {
		// 			const res = await postIGDB(
		// 				`${IGDB_BASE_API_URL}/characters`,
		// 				`fields *; limit ${limit};`
		// 			);
		// 			return res;
		// 		} catch (err) {
		// 			console.error(err);
		// 		}
		// 	},
		// });
		// t.nonNull.field('searchCharacters', {
		// 	type: list('Character'),
		// 	args: {
		// 		q: nonNull(stringArg()),
		// 		limit: intArg({ default: 500 }),
		// 	},
		// 	resolve: async (_parent, { q, limit }) => {
		// 		try {
		// 			const res = await postIGDB(
		// 				`${IGDB_BASE_API_URL}/characters`,
		// 				`fields *; limit ${limit}; search "${q}";`
		// 			);
		// 			return res;
		// 		} catch (err) {
		// 			console.error(err);
		// 		}
		// 	},
		// });
	},
});
