import { tmdbClient } from '@/lib/api';
import _ from 'lodash';
import type { Movie, Show } from '@prisma/client';

export async function getForYouRecommendations(userMovies: Movie[], userShows: Show[]) {
  // We don't want to overwhelm the API, so pick up to 3 recent items (movies/shows) to base recommendations on
  const moviesToUse = userMovies.slice(-2);
  const showsToUse = userShows.slice(-2);

  const recommendedPromises: Promise<any>[] = [];

  for (const movie of moviesToUse) {
    recommendedPromises.push(
      tmdbClient
        .getRecommendedMovies(movie.id)
        .then(res =>
          (res.results || []).map((item: any) => ({
            ...item,
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
            recommendedReason: `Because you tracked ${show.name}`,
          }))
        )
        .catch(() => [])
    );
  }

  const resultsArrays = await Promise.all(recommendedPromises);
  const allResults = resultsArrays.flat();

  // Deduplicate based on id
  const uniqueResults = _.uniqBy(allResults, 'id');

  // Filter out any items the user is already tracking!
  const trackedMovieIds = new Set(userMovies.map(m => String(m.id)));
  const trackedShowIds = new Set(userShows.map(s => String(s.id)));

  const finalRecommendations = uniqueResults.filter((item: any) => {
    // TMDB items have 'title' if movie, 'name' if show
    if (item.title && trackedMovieIds.has(String(item.id))) return false;
    if (item.name && trackedShowIds.has(String(item.id))) return false;
    return true;
  });

  // Shuffle or take top 20
  return _.shuffle(finalRecommendations).slice(0, 20);
}
