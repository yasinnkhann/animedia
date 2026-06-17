import { tmdbClient, igdbClient } from '@/lib/api';
import _ from 'lodash';
import type { Movie, Show, Game } from '@prisma/client';

import { unstable_cache } from 'next/cache';

const fetchAndCalculateRecommendations = unstable_cache(
  async (moviesToUse: Movie[], showsToUse: Show[], gamesToUse: Game[]) => {
    const recommendedPromises: Promise<any>[] = [];

    for (const movie of moviesToUse) {
      recommendedPromises.push(
        tmdbClient
          .getRecommendedMovies(movie.id)
          .then(res =>
            (res.results || []).map((item: any) => ({
              ...item,
              mediaType: 'movie',
              recommendedReason: `Because you tracked ${movie.name}`,
            }))
          )
          .catch(() => [])
      );
    }

    for (const show of showsToUse) {
      recommendedPromises.push(
        tmdbClient
          .getRecommendedShows(show.id)
          .then(res =>
            (res.results || []).map((item: any) => ({
              ...item,
              mediaType: 'show',
              recommendedReason: `Because you tracked ${show.name}`,
            }))
          )
          .catch(() => [])
      );
    }

    for (const game of gamesToUse) {
      recommendedPromises.push(
        igdbClient
          .getRecommendedGames(game.id)
          .then(res =>
            (res.results || []).map((item: any) => ({
              ...item,
              mediaType: 'game',
              recommendedReason: `Because you tracked ${game.name}`,
            }))
          )
          .catch(() => [])
      );
    }

    const resultsArrays = await Promise.all(recommendedPromises);
    const allResults = resultsArrays.flat();

    // Deduplicate based on type and id
    const uniqueResults = _.uniqBy(allResults, item => `${item.mediaType}-${item.id}`);

    // --- Fallback Content for Empty States ---
    const hasMovies = uniqueResults.some((r: any) => r.mediaType === 'movie');
    const hasShows = uniqueResults.some((r: any) => r.mediaType === 'show');
    const hasGames = uniqueResults.some((r: any) => r.mediaType === 'game');

    const fallbackPromises: Promise<any>[] = [];

    if (!hasMovies) {
      fallbackPromises.push(
        tmdbClient
          .getTrending('movie', 'week')
          .then(res =>
            (res.results || []).map((item: any) => ({
              ...item,
              mediaType: 'movie',
              recommendedReason: 'Trending movies this week',
            }))
          )
          .catch(() => [])
      );
    }

    if (!hasShows) {
      fallbackPromises.push(
        tmdbClient
          .getTrending('tv', 'week')
          .then(res =>
            (res.results || []).map((item: any) => ({
              ...item,
              mediaType: 'show',
              recommendedReason: 'Trending shows this week',
            }))
          )
          .catch(() => [])
      );
    }

    if (!hasGames) {
      fallbackPromises.push(
        igdbClient
          .getPopularGames(20, 1)
          .then(res =>
            (res.results || []).map((item: any) => ({
              ...item,
              mediaType: 'game',
              recommendedReason: 'Popular games right now',
            }))
          )
          .catch(() => [])
      );
    }

    let finalRecommendations = uniqueResults;

    if (fallbackPromises.length > 0) {
      const fallbackResults = await Promise.all(fallbackPromises);
      const flatFallbacks = fallbackResults.flat();
      finalRecommendations = [...finalRecommendations, ...flatFallbacks];
    }

    // Shuffle
    return _.shuffle(finalRecommendations);
  },
  ['for-you-recs-base'],
  { revalidate: 3600 }
);

export async function getForYouRecommendations(
  userMovies: Movie[],
  userShows: Show[],
  userGames: Game[]
) {
  // We don't want to overwhelm the API, so pick up to 3 recent items to base recommendations on
  const moviesToUse = userMovies.slice(-3);
  const showsToUse = userShows.slice(-3);
  const gamesToUse = userGames.slice(-3);

  // Get base shuffled recommendations from cache
  const rawRecs = await fetchAndCalculateRecommendations(moviesToUse, showsToUse, gamesToUse);

  // Filter out any items the user is currently tracking dynamically
  const trackedMovieIds = new Set(userMovies.map(m => String(m.id)));
  const trackedShowIds = new Set(userShows.map(s => String(s.id)));
  const trackedGameIds = new Set(userGames.map(g => String(g.id)));

  const finalRecommendations = rawRecs.filter((item: any) => {
    if (item.mediaType === 'movie' && trackedMovieIds.has(String(item.id))) return false;
    if (item.mediaType === 'show' && trackedShowIds.has(String(item.id))) return false;
    if (item.mediaType === 'game' && trackedGameIds.has(String(item.id))) return false;
    return true;
  });

  return finalRecommendations;
}
