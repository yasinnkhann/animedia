import { IGDB_BASE_API_URL } from 'utils/constants';
import { postIGDB } from '../utils';
import { extendType, nonNull, stringArg, list, intArg, idArg } from 'nexus';

const addCoverUrl = async (
	res: any[],
	imageSize?:
		| 'cover_small'
		| 'screenshot_med'
		| 'cover_big'
		| 'logo_med'
		| 'screenshot_big'
		| 'screenshot_huge'
		| 'thumb'
		| 'micro'
		| '720p'
		| '1080p'
) => {
	return await Promise.all(
		res.map(async (result: any) => {
			if (result.cover) {
				const coverResponse = await postIGDB(
					`${IGDB_BASE_API_URL}/covers`,
					`fields url; where id=${result.cover};`
				);
				if (coverResponse && coverResponse.length > 0) {
					let coverUrl = coverResponse[0].url;
					if (imageSize) {
						coverUrl = coverUrl.replace('thumb', imageSize);
					}
					result.coverUrl = coverUrl;
				} else {
					result.coverUrl = null;
				}
			}
			return result;
		})
	);
};

export const GameQueries = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('searchGames', {
			type: 'GamesRes',
			args: {
				q: nonNull(stringArg()),
				limit: intArg({ default: 500 }),
			},
			resolve: async (_parent, { q, limit }) => {
				// try {
				let res = await postIGDB(
					`${IGDB_BASE_API_URL}/games`,
					`fields *; limit ${limit}; search "${q}";`
				);
				res = addCoverUrl(res, '1080p');
				const finalRes = { results: res };
				return finalRes;
				// } catch (err) {
				// 	console.error(err);
				// }
			},
		});
		t.nonNull.field('gameDetails', {
			type: 'GamesRes',
			args: {
				gameDetailsId: nonNull(idArg()),
			},
			resolve: async (_parent, { gameDetailsId }) => {
				try {
					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/games`,
						`fields *; where id = ${gameDetailsId};`
					);
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('gamesFromGenres', {
			type: 'GamesRes',
			args: {
				genreIds: nonNull(list(nonNull('ID'))),
				limit: intArg({ default: 500 }),
			},
			resolve: async (_parent, { genreIds, limit }) => {
				try {
					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/games`,
						`fields *; where genres = (${genreIds.join(',')}); limit ${limit};`
					);
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.nonNull.field('topRatedGames', {
			type: 'GamesRes',
			args: {
				limit: intArg({ default: 500 }),
			},
			resolve: async (_parent, { limit }) => {
				try {
					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/games`,
						`fields *; sort rating desc; limit ${limit};`
					);
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
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
