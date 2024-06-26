import { IGDB_BASE_API_URL } from 'utils/constants';
import { postIGDB, addIGDBCoverUrl, addIGDBMugShotUrl } from '../utils';
import { extendType, nonNull, stringArg, list, intArg, idArg, objectType } from 'nexus';

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
					const { count } = await postIGDB(`${IGDB_BASE_API_URL}/games/count`, `search "${q}";`);

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
				const finalRes = { results: [], total_results: 0 };
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
		t.field('gameGenres', {
			type: list(nonNull('GameGenre')),
			resolve: async () => {
				try {
					const res = await postIGDB(`${IGDB_BASE_API_URL}/genres`, `fields *; limit 500;`);
					return res;
				} catch (err) {
					console.error(err);
				}
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

						collections = gamesData.sort((a, b) => a.first_release_date - b.first_release_date);
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
					const res = await postIGDB(`${IGDB_BASE_API_URL}/themes`, `fields name; limit ${limit};`);
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
				const finalRes = [];
				try {
					const videoRes = await postIGDB(
						`${IGDB_BASE_API_URL}/game_videos`,
						`fields game, video_id, name; where game = ${gameId};`
					);

					finalRes.push(...videoRes);

					let screenshotsRes = await postIGDB(
						`${IGDB_BASE_API_URL}/screenshots`,
						`fields game, url; where game = ${gameId};`
					);
					screenshotsRes = screenshotsRes.map((ss: any) => ({
						...ss,
						url: ss.url.replace('thumb', '1080p'),
					}));
					finalRes.push(...screenshotsRes);
				} catch (err) {
					console.error(err);
				}
				return finalRes;
			},
		});
		t.field('popularGames', {
			type: 'GamesRes',
			args: {
				limit: nonNull(intArg()),
				page: nonNull(intArg()),
			},
			resolve: async (_parent, { limit, page }) => {
				const finalRes = { results: [], total_results: 0 };
				try {
					const { count } = await postIGDB(`${IGDB_BASE_API_URL}/games/count`);

					finalRes.total_results = count;

					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/games`,
						`fields *; limit ${limit}; offset ${page * limit - limit}; sort rating_count desc;`
					);
					await addIGDBCoverUrl(res, '1080p');
					finalRes.results = res;
				} catch (err) {
					console.error(err);
				}
				return finalRes;
			},
		});
		t.field('topRatedGames', {
			type: 'GamesRes',
			args: {
				limit: nonNull(intArg()),
				page: nonNull(intArg()),
			},
			resolve: async (_parent, { limit, page }) => {
				const finalRes = { results: [], total_results: 0 };
				try {
					const { count } = await postIGDB(`${IGDB_BASE_API_URL}/games/count`);

					finalRes.total_results = count;

					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/games`,
						`fields *; limit ${limit}; offset ${page * limit - limit}; sort rating desc;`
					);
					await addIGDBCoverUrl(res, '1080p');
					finalRes.results = res;
				} catch (err) {
					console.error(err);
				}
				return finalRes;
			},
		});
		t.field('popularGamesByGenre', {
			type: 'GamesRes',
			args: {
				genreId: nonNull(idArg()),
				limit: nonNull(intArg()),
				page: nonNull(intArg()),
			},
			resolve: async (_parent, { genreId, limit, page }) => {
				const finalRes = { results: [], total_results: 0 };
				try {
					const { count } = await postIGDB(
						`${IGDB_BASE_API_URL}/games/count`,
						`where genres = ${genreId};`
					);

					finalRes.total_results = count;

					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/games`,
						`fields *; where genres = ${genreId}; limit ${limit}; offset ${page * limit - limit}; sort rating_count desc;`
					);
					await addIGDBCoverUrl(res, '1080p');
					finalRes.results = res;
				} catch (err) {
					console.error(err);
				}
				return finalRes;
			},
		});
		t.field('topRatedGamesByGenre', {
			type: 'GamesRes',
			args: {
				genreId: nonNull(idArg()),
				limit: nonNull(intArg()),
				page: nonNull(intArg()),
			},
			resolve: async (_parent, { genreId, limit, page }) => {
				const finalRes = { results: [], total_results: 0 };
				try {
					const { count } = await postIGDB(
						`${IGDB_BASE_API_URL}/games/count`,
						`where genres = ${genreId};`
					);

					finalRes.total_results = count;

					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/games`,
						`fields *; where genres = ${genreId}; limit ${limit}; offset ${page * limit - limit}; sort rating desc;`
					);
					await addIGDBCoverUrl(res, '1080p');
					finalRes.results = res;
				} catch (err) {
					console.error(err);
				}
				return finalRes;
			},
		});

		t.field('gameCharacters', {
			type: list(nonNull('GameCharacter')),
			args: {
				gameId: nonNull(idArg()),
				limit: intArg({ default: 20 }),
			},
			resolve: async (_parent, { gameId, limit }) => {
				try {
					let res = await postIGDB(
						`${IGDB_BASE_API_URL}/characters`,
						`fields country_name, description, games, gender, mug_shot, name, species; where games = [${gameId}]; limit ${limit};`
					);
					res = res.filter((obj: any) => obj.mug_shot);
					await addIGDBMugShotUrl(res, '1080p');
					return res;
				} catch (err) {
					console.error(err);
				}
			},
		});
		t.field('searchGameCharacters', {
			type: objectType({
				name: 'SearchCharacter',
				definition(t) {
					t.int('total_results');
					t.nonNull.list.field('results', {
						type: nonNull('GameCharacter'),
					});
				},
			}),
			args: {
				name: nonNull(stringArg()),
				limit: intArg({ default: 500 }),
			},
			resolve: async (_parent, { name, limit }) => {
				const finalRes = { results: [], total_results: 0 };
				const adjustedName = name
					.split(' ')
					.map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
					.join(' ');
				try {
					const { count } = await postIGDB(
						`${IGDB_BASE_API_URL}/characters/count`,
						`where name = "${adjustedName}";`
					);

					finalRes.total_results = count;

					const res = await postIGDB(
						`${IGDB_BASE_API_URL}/characters`,
						`fields country_name, description, games, gender, mug_shot, name, species; where name = "${adjustedName}"; limit ${limit};`
					);
					await addIGDBMugShotUrl(res, '1080p');
					finalRes.results = res;
				} catch (err) {
					console.error(err);
				}
				return finalRes;
			},
		});
	},
});
