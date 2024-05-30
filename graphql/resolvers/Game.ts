import { IGDB_BASE_API_URL } from 'utils/constants';
import { postIGDB, addIGDBCoverUrl } from '../utils';
import { extendType, nonNull, stringArg, list, intArg, idArg } from 'nexus';

export const GameQueries = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('searchedGames', {
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
				} catch (err) {
					console.error(err);
				}
				return finalRes;
			},
		});
		t.nonNull.field('gameDetails', {
			type: 'GamesRes',
			args: {
				gameId: nonNull(idArg()),
			},
			resolve: async (_parent, { gameId }) => {
				const finalRes = { results: [], total_results: null };
				try {
					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/games`,
						`fields *; where id = ${gameId};`
					);
					await addIGDBCoverUrl(res, '1080p');
					finalRes.results = res;
				} catch (err) {
					console.error(err);
				}
				return finalRes;
			},
		});
		t.field('gamePlatforms', {
			type: list('GamePlatform'),
			args: {
				limit: intArg({ default: 500 }),
			},
			resolve: async (_parent, { limit }) => {
				try {
					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/platforms`,
						`fields name; limit ${limit};`
					);
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.field('gameCompany', {
			type: list('GameCompany'),
			args: {
				gameId: nonNull(idArg()),
			},
			resolve: async (_parent, { gameId }) => {
				try {
					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/companies`,
						`fields *; where developed = [${gameId}];`
					);
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.field('gameCollections', {
			type: 'GameCollections',
			args: {
				gameId: nonNull(idArg()),
			},
			resolve: async (_parent, { gameId }) => {
				try {
					let collections = (
						await postIGDB(
							`${IGDB_BASE_API_URL}/collections`,
							`fields *; where games = [${gameId}];`
						)
					)[0];

					const finalRes = {
						id: collections?.id,
						name: collections?.name,
						games: [],
					};

					if (collections?.games && collections.games.length > 0) {
						const gamesData = await Promise.all(
							collections.games.map(async (collectionGameId: string) => {
								const res = await postIGDB(
									`${IGDB_BASE_API_URL}/games`,
									`fields name, first_release_date, cover, rating; where id = ${collectionGameId};`
								);
								await addIGDBCoverUrl(res, '1080p');
								return res[0];
							})
						);

						collections = gamesData.sort(
							(a, b) => a.first_release_date - b.first_release_date
						);
					}
					finalRes.games = collections;
					return finalRes;
				} catch (err) {
					console.error(err);
					throw new Error('Error fetching game collections');
				}
			},
		});
		t.field('gameThemes', {
			type: list('GameTheme'),
			args: {
				limit: intArg({ default: 500 }),
			},
			resolve: async (_parent, { limit }) => {
				try {
					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/themes`,
						`fields name; limit ${limit};`
					);
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.field('similarGames', {
			type: list(nonNull('RelatedGame')),
			args: {
				gameIds: nonNull(list(nonNull('ID'))),
				limit: intArg({ default: 500 }),
			},
			resolve: async (_parent, { gameIds, limit }) => {
				try {
					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/games`,
						`fields name, first_release_date, rating, cover; limit ${limit}; where id = (${gameIds.join(',')});`
					);
					await addIGDBCoverUrl(res, '1080p');
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.field('dlcGames', {
			type: list(nonNull('RelatedGame')),
			args: {
				gameIds: nonNull(list(nonNull('ID'))),
				limit: intArg({ default: 500 }),
			},
			resolve: async (_parent, { gameIds, limit }) => {
				try {
					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/games`,
						`fields name, first_release_date, rating, cover; limit ${limit}; where id = (${gameIds.join(',')});`,
						1,
						0
					);
					await addIGDBCoverUrl(res, '1080p');
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.field('gamePreviews', {
			type: list(nonNull('GamePreview')),
			args: {
				gameId: nonNull(idArg()),
			},
			resolve: async (_parent, { gameId }) => {
				let finalRes = [];
				try {
					const videoRes = await postIGDB(
						`${IGDB_BASE_API_URL}/game_videos`,
						`fields game, video_id, name; where game = ${gameId};`
					);

					if (videoRes.length > 0) {
						finalRes.push(videoRes[0]);
					}

					let screenshotsRes = await postIGDB(
						`${IGDB_BASE_API_URL}/screenshots`,
						`fields game, url; where game = ${gameId};`
					);
					screenshotsRes = screenshotsRes.map((ss: any) => ({
						...ss,
						url: ss.url.replace('thumb', '1080p'),
					}));
					finalRes = finalRes.concat(screenshotsRes);
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
