import { IGDB_BASE_API_URL } from 'utils/constants';
import { postIGDB, addIGDBCoverUrl, addIGDBMugShotUrl } from '../utils';
import { extendType, nonNull, stringArg, list, intArg, idArg, objectType } from 'nexus';
import { safeResolver } from '../utils/resolver-helpers';
import {
  parseInput,
  GameSearchInput,
  GameDetailsInput,
  GameLimitInput,
  GameGenreInput,
  GameIdsInput,
  GameCharacterInput,
  GameCharacterSearchInput,
  GamePaginationInput,
} from '../validations/inputs';

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
      resolve: safeResolver(async (_parent, { q, limit, page }) => {
        const input = parseInput(GameSearchInput, { q, limit, page });
        const finalRes = { results: [], total_results: 0 };

        const { count } = await postIGDB(
          `${IGDB_BASE_API_URL}/games/count`,
          `search "${input.q}";`
        );

        finalRes.total_results = count;

        const res = await postIGDB(
          `${IGDB_BASE_API_URL}/games`,
          `fields *; search "${input.q}"; limit ${input.limit ?? 10}; offset ${(input.page ?? 1) * (input.limit ?? 10) - (input.limit ?? 10)};`
        );
        await addIGDBCoverUrl(res, '1080p');
        finalRes.results = res;

        return finalRes;
      }),
    });
    t.nonNull.field('gameDetails', {
      type: 'GamesRes',
      args: {
        gameId: nonNull(idArg()),
      },
      resolve: safeResolver(async (_parent, { gameId }) => {
        const input = parseInput(GameDetailsInput, { gameId });
        const finalRes = { results: [], total_results: 0 };

        const res = await postIGDB(
          `${IGDB_BASE_API_URL}/games`,
          `fields *; where id = ${input.gameId};`
        );
        await addIGDBCoverUrl(res, '1080p');
        finalRes.results = res;

        return finalRes;
      }),
    });
    t.field('gameGenres', {
      type: list(nonNull('GameGenre')),
      resolve: safeResolver(async () => {
        const res = await postIGDB(`${IGDB_BASE_API_URL}/genres`, `fields *; limit 500;`);
        return res;
      }),
    });
    t.field('gamePlatforms', {
      type: list('GamePlatform'),
      args: {
        limit: intArg({ default: 500 }),
      },
      resolve: safeResolver(async (_parent, { limit }) => {
        const input = parseInput(GameLimitInput, { limit });
        const res = await postIGDB(
          `${IGDB_BASE_API_URL}/platforms`,
          `fields name; limit ${input.limit};`
        );
        return res;
      }),
    });
    t.field('gameCompany', {
      type: list('GameCompany'),
      args: {
        gameId: nonNull(idArg()),
      },
      resolve: safeResolver(async (_parent, { gameId }) => {
        const input = parseInput(GameDetailsInput, { gameId });
        const res = await postIGDB(
          `${IGDB_BASE_API_URL}/companies`,
          `fields *; where developed = [${input.gameId}];`
        );
        return res;
      }),
    });
    t.field('gameCollections', {
      type: 'GameCollections',
      args: {
        gameId: nonNull(idArg()),
      },
      resolve: safeResolver(async (_parent, { gameId }) => {
        const input = parseInput(GameDetailsInput, { gameId });
        let collections = (
          await postIGDB(
            `${IGDB_BASE_API_URL}/collections`,
            `fields *; where games = [${input.gameId}];`
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
      }),
    });
    t.field('gameThemes', {
      type: list('GameTheme'),
      args: {
        limit: intArg({ default: 500 }),
      },
      resolve: safeResolver(async (_parent, { limit }) => {
        const input = parseInput(GameLimitInput, { limit });
        const res = await postIGDB(
          `${IGDB_BASE_API_URL}/themes`,
          `fields name; limit ${input.limit};`
        );
        return res;
      }),
    });
    t.field('similarGames', {
      type: list(nonNull('RelatedGame')),
      args: {
        gameIds: nonNull(list(nonNull('ID'))),
        limit: intArg({ default: 500 }),
      },
      resolve: safeResolver(async (_parent, { gameIds, limit }) => {
        const input = parseInput(GameIdsInput, { gameIds, limit });
        const res = await postIGDB(
          `${IGDB_BASE_API_URL}/games`,
          `fields name, first_release_date, rating, cover; limit ${input.limit}; where id = (${input.gameIds.join(',')});`
        );
        await addIGDBCoverUrl(res, '1080p');
        return res;
      }),
    });
    t.field('dlcGames', {
      type: list(nonNull('RelatedGame')),
      args: {
        gameIds: nonNull(list(nonNull('ID'))),
        limit: intArg({ default: 500 }),
      },
      resolve: safeResolver(async (_parent, { gameIds, limit }) => {
        const input = parseInput(GameIdsInput, { gameIds, limit });
        const res = await postIGDB(
          `${IGDB_BASE_API_URL}/games`,
          `fields name, first_release_date, rating, cover; limit ${input.limit}; where id = (${input.gameIds.join(',')});`,
          1,
          0
        );
        await addIGDBCoverUrl(res, '1080p');
        return res;
      }),
    });
    t.field('gamePreviews', {
      type: list(nonNull('GamePreview')),
      args: {
        gameId: nonNull(idArg()),
      },
      resolve: safeResolver(async (_parent, { gameId }) => {
        const input = parseInput(GameDetailsInput, { gameId });
        const finalRes = [];
        const videoRes = await postIGDB(
          `${IGDB_BASE_API_URL}/game_videos`,
          `fields game, video_id, name; where game = ${input.gameId};`
        );

        finalRes.push(...videoRes);

        let screenshotsRes = await postIGDB(
          `${IGDB_BASE_API_URL}/screenshots`,
          `fields game, url; where game = ${input.gameId};`
        );
        screenshotsRes = screenshotsRes.map((ss: any) => ({
          ...ss,
          url: ss.url.replace('thumb', '1080p'),
        }));
        finalRes.push(...screenshotsRes);
        return finalRes;
      }),
    });
    t.field('popularGames', {
      type: 'GamesRes',
      args: {
        limit: nonNull(intArg()),
        page: nonNull(intArg()),
      },
      resolve: safeResolver(async (_parent, { limit, page }) => {
        const input = parseInput(GamePaginationInput, { limit, page });
        const finalRes = { results: [], total_results: 0 };

        const { count } = await postIGDB(`${IGDB_BASE_API_URL}/games/count`);

        finalRes.total_results = count;

        const res = await postIGDB(
          `${IGDB_BASE_API_URL}/games`,
          `fields *; limit ${input.limit ?? 10}; offset ${(input.page ?? 1) * (input.limit ?? 10) - (input.limit ?? 10)}; sort rating_count desc;`
        );
        await addIGDBCoverUrl(res, '1080p');
        finalRes.results = res;

        return finalRes;
      }),
    });
    t.field('topRatedGames', {
      type: 'GamesRes',
      args: {
        limit: nonNull(intArg()),
        page: nonNull(intArg()),
      },
      resolve: safeResolver(async (_parent, { limit, page }) => {
        const input = parseInput(GamePaginationInput, { limit, page });
        const finalRes = { results: [], total_results: 0 };

        const { count } = await postIGDB(`${IGDB_BASE_API_URL}/games/count`);

        finalRes.total_results = count;

        const res = await postIGDB(
          `${IGDB_BASE_API_URL}/games`,
          `fields *; limit ${input.limit ?? 10}; offset ${(input.page ?? 1) * (input.limit ?? 10) - (input.limit ?? 10)}; sort rating desc;`
        );
        await addIGDBCoverUrl(res, '1080p');
        finalRes.results = res;

        return finalRes;
      }),
    });
    t.field('popularGamesByGenre', {
      type: 'GamesRes',
      args: {
        genreId: nonNull(idArg()),
        limit: nonNull(intArg()),
        page: nonNull(intArg()),
      },
      resolve: safeResolver(async (_parent, { genreId, limit, page }) => {
        const input = parseInput(GameGenreInput, { genreId, limit, page });
        const finalRes = { results: [], total_results: 0 };

        const { count } = await postIGDB(
          `${IGDB_BASE_API_URL}/games/count`,
          `where genres = ${input.genreId};`
        );

        finalRes.total_results = count;

        const res = await postIGDB(
          `${IGDB_BASE_API_URL}/games`,
          `fields *; where genres = ${input.genreId}; limit ${input.limit ?? 10}; offset ${(input.page ?? 1) * (input.limit ?? 10) - (input.limit ?? 10)}; sort rating_count desc;`
        );
        await addIGDBCoverUrl(res, '1080p');
        finalRes.results = res;

        return finalRes;
      }),
    });
    t.field('topRatedGamesByGenre', {
      type: 'GamesRes',
      args: {
        genreId: nonNull(idArg()),
        limit: nonNull(intArg()),
        page: nonNull(intArg()),
      },
      resolve: safeResolver(async (_parent, { genreId, limit, page }) => {
        const input = parseInput(GameGenreInput, { genreId, limit, page });
        const finalRes = { results: [], total_results: 0 };

        const { count } = await postIGDB(
          `${IGDB_BASE_API_URL}/games/count`,
          `where genres = ${input.genreId};`
        );

        finalRes.total_results = count;

        const res = await postIGDB(
          `${IGDB_BASE_API_URL}/games`,
          `fields *; where genres = ${input.genreId}; limit ${input.limit ?? 10}; offset ${(input.page ?? 1) * (input.limit ?? 10) - (input.limit ?? 10)}; sort rating desc;`
        );
        await addIGDBCoverUrl(res, '1080p');
        finalRes.results = res;

        return finalRes;
      }),
    });

    t.field('gameCharacters', {
      type: list(nonNull('GameCharacter')),
      args: {
        gameId: nonNull(idArg()),
        limit: intArg({ default: 20 }),
      },
      resolve: safeResolver(async (_parent, { gameId, limit }) => {
        const input = parseInput(GameCharacterInput, { gameId, limit });
        let res = await postIGDB(
          `${IGDB_BASE_API_URL}/characters`,
          `fields country_name, description, games, gender, mug_shot, name, species; where games = [${input.gameId}]; limit ${input.limit};`
        );
        res = res.filter((obj: any) => obj.mug_shot);
        await addIGDBMugShotUrl(res, '1080p');
        return res;
      }),
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
      resolve: safeResolver(async (_parent, { name, limit }) => {
        const input = parseInput(GameCharacterSearchInput, { name, limit });
        const finalRes = { results: [], total_results: 0 };
        const adjustedName = input.name
          .split(' ')
          .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        const { count } = await postIGDB(
          `${IGDB_BASE_API_URL}/characters/count`,
          `where name = "${adjustedName}";`
        );

        finalRes.total_results = count;

        const res = await postIGDB(
          `${IGDB_BASE_API_URL}/characters`,
          `fields country_name, description, games, gender, mug_shot, name, species; where name = "${adjustedName}"; limit ${input.limit};`
        );
        await addIGDBMugShotUrl(res, '1080p');
        finalRes.results = res;

        return finalRes;
      }),
    });
  },
});
