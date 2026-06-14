import { IGDB_BASE_API_URL } from '../../utils/constants';
import { postIGDB, addIGDBCoverUrl, addIGDBMugShotUrl } from '../../utils/igdbUtils';

export class IGDBClient {
  async getGameDetails(gameId: string) {
    const finalRes = { results: [] as any[], total_results: 0 };
    const res = await postIGDB(`${IGDB_BASE_API_URL}/games`, `fields *; where id = ${gameId};`);
    if (res && res.length > 0) {
      await addIGDBCoverUrl(res, '1080p');
      finalRes.results = res;
    }
    return finalRes;
  }

  async getGameGenres() {
    return await postIGDB(`${IGDB_BASE_API_URL}/genres`, `fields *; limit 500;`);
  }

  async getGamePlatforms(limit: number = 500) {
    return await postIGDB(`${IGDB_BASE_API_URL}/platforms`, `fields name; limit ${limit};`);
  }

  async getGameCompany(gameId: string) {
    return await postIGDB(
      `${IGDB_BASE_API_URL}/companies`,
      `fields *; where developed = [${gameId}];`
    );
  }

  async getGameCollections(gameId: string) {
    let collections = (
      await postIGDB(`${IGDB_BASE_API_URL}/collections`, `fields *; where games = [${gameId}];`)
    )[0];

    const finalRes = {
      id: collections?.id,
      name: collections?.name,
      games: [] as any[],
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

      finalRes.games = gamesData.sort((a, b) => a.first_release_date - b.first_release_date);
    }
    return finalRes;
  }

  async getGameThemes(limit: number = 500) {
    return await postIGDB(`${IGDB_BASE_API_URL}/themes`, `fields name; limit ${limit};`);
  }

  async getSimilarGames(gameIds: string[]) {
    const finalRes = { results: [] as any[] };
    const res = await postIGDB(
      `${IGDB_BASE_API_URL}/games`,
      `fields name, cover, rating; where id = (${gameIds.join(',')});`
    );
    await addIGDBCoverUrl(res, '1080p');
    finalRes.results = res;
    return finalRes;
  }

  async getGameCharacters(gameId: string) {
    const finalRes = { results: [] as any[] };
    const res = await postIGDB(
      `${IGDB_BASE_API_URL}/characters`,
      `fields name, mug_shot; where games = [${gameId}];`
    );
    await addIGDBMugShotUrl(res, '1080p');
    finalRes.results = res;
    return finalRes;
  }

  async getDlcGames(gameIds: string[]) {
    const finalRes = { results: [] as any[] };
    const res = await postIGDB(
      `${IGDB_BASE_API_URL}/games`,
      `fields name, cover, rating; where id = (${gameIds.join(',')});`
    );
    await addIGDBCoverUrl(res, '1080p');
    finalRes.results = res;
    return finalRes;
  }

  async getGamePreviews(gameId: string) {
    const res = await postIGDB(
      `${IGDB_BASE_API_URL}/game_videos`,
      `fields video_id, name; where game = ${gameId};`
    );
    return res;
  }

  async searchGames(q: string, limit: number, page: number) {
    const finalRes = { results: [] as any[], total_results: 0 };

    const { count } = await postIGDB(`${IGDB_BASE_API_URL}/games/count`, `search "${q}";`);

    finalRes.total_results = count;

    const res = await postIGDB(
      `${IGDB_BASE_API_URL}/games`,
      `fields *; search "${q}"; limit ${limit}; offset ${page * limit - limit};`
    );
    await addIGDBCoverUrl(res, '1080p');
    finalRes.results = res;

    return finalRes;
  }

  async getPopularGames(limit: number, page: number) {
    const finalRes = { results: [] as any[], total_results: 0 };
    const { count } = await postIGDB(`${IGDB_BASE_API_URL}/games/count`);
    finalRes.total_results = count;

    const res = await postIGDB(
      `${IGDB_BASE_API_URL}/games`,
      `fields *; limit ${limit}; offset ${page * limit - limit}; sort rating_count desc;`
    );
    await addIGDBCoverUrl(res, '1080p');
    finalRes.results = res;

    return finalRes;
  }

  async getTopRatedGames(limit: number, page: number) {
    const finalRes = { results: [] as any[], total_results: 0 };
    const { count } = await postIGDB(`${IGDB_BASE_API_URL}/games/count`);
    finalRes.total_results = count;

    const res = await postIGDB(
      `${IGDB_BASE_API_URL}/games`,
      `fields *; limit ${limit}; offset ${page * limit - limit}; sort rating desc;`
    );
    await addIGDBCoverUrl(res, '1080p');
    finalRes.results = res;

    return finalRes;
  }

  async getGamesByGenre(genreId: number, sortBy: string, limit: number, page: number) {
    const finalRes = { results: [] as any[], total_results: 0 };
    const { count } = await postIGDB(
      `${IGDB_BASE_API_URL}/games/count`,
      `where genres = ${genreId};`
    );
    finalRes.total_results = count;

    const res = await postIGDB(
      `${IGDB_BASE_API_URL}/games`,
      `fields *; where genres = ${genreId}; limit ${limit}; offset ${page * limit - limit}; sort ${sortBy} desc;`
    );
    await addIGDBCoverUrl(res, '1080p');
    finalRes.results = res;

    return finalRes;
  }
}

export const igdbClient = new IGDBClient();
