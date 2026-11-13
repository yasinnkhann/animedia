import { tmdbClient, igdbClient } from '@/lib/api';
import _ from 'lodash';
import type { Movie, Show, Game } from '@prisma/client';
import { unstable_cache } from 'next/cache';

export interface SeedMediaItem {
  id: string;
  name: string;
  rating?: number | null;
  status?: string | null;
  rewatchCount?: number;
  reason: string;
}

/**
 * Calculates a recommendation seed quality score for a media item.
 * Higher score = stronger positive signal to base recommendations on.
 * Returns -1 for items that should be excluded (e.g. low ratings, dropped).
 */
export function scoreMediaForRecommendation(item: {
  id: string;
  name: string;
  rating?: number | null;
  status?: string | null;
  rewatch_count?: number | null;
  notes?: string | null;
  tags?: string[] | null;
}): number {
  // Disqualify dropped titles or titles rated 4/10 or below
  if (item.status === 'DROPPED') return -1;
  if (typeof item.rating === 'number' && item.rating > 0 && item.rating <= 4) return -1;

  let score = 0;

  // Base score from rating
  if (typeof item.rating === 'number' && item.rating > 0) {
    if (item.rating === 10) score += 100;
    else if (item.rating === 9) score += 85;
    else if (item.rating === 8) score += 70;
    else if (item.rating === 7) score += 55;
    else score += 30; // ratings 5-6
  } else {
    // Unrated: base on status engagement
    if (item.status === 'COMPLETED') score += 45;
    else if (item.status === 'WATCHING') score += 40;
    else if (item.status === 'PLAN_TO_WATCH') score += 15;
    else score += 10;
  }

  // Significant bonus for rewatched titles (strongest positive signal)
  if (item.rewatch_count && item.rewatch_count > 0) {
    score += Math.min(item.rewatch_count * 15, 45);
  }

  // Small bonus for personal investment (notes or tags)
  if (item.notes || (item.tags && item.tags.length > 0)) {
    score += 10;
  }

  return score;
}

/**
 * Builds a friendly, personalized reason for why recommendations are based on this seed.
 */
export function buildSeedReason(item: {
  name: string;
  rating?: number | null;
  status?: string | null;
  rewatch_count?: number | null;
}): string {
  if (typeof item.rating === 'number' && item.rating >= 8) {
    return `Because you rated ${item.name} ${item.rating}/10 ★`;
  }
  if (item.rewatch_count && item.rewatch_count > 0) {
    return `Because you rewatched ${item.name} (${item.rewatch_count + 1}x)`;
  }
  if (typeof item.rating === 'number' && item.rating === 7) {
    return `Because you liked ${item.name} (7/10)`;
  }
  if (item.status === 'COMPLETED') {
    return `Because you completed ${item.name}`;
  }
  if (item.status === 'WATCHING') {
    return `Because you're watching ${item.name}`;
  }
  return `Because you tracked ${item.name}`;
}

/**
 * Selects up to `maxCount` optimal seed items from the user's library.
 * Sorts by rating weight, giving top candidates priority with dynamic sampling.
 */
export function selectSeedItems<T extends { id: string; name: string }>(
  items: T[],
  maxCount = 3
): SeedMediaItem[] {
  if (!items || items.length === 0) return [];

  // Score all items and discard excluded ones (score <= 0)
  const scoredItems = items
    .map(item => ({ item, score: scoreMediaForRecommendation(item as any) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  if (scoredItems.length === 0) return [];

  // If we have high-rated candidates (score >= 55), sample from the top group
  // to keep recommendations dynamic and fresh on each visit
  const highTier = scoredItems.filter(s => s.score >= 55);
  let selected: Array<{ item: T; score: number }>;

  if (highTier.length > maxCount) {
    // Anchor on the top-scoring item and sample remaining slots from top candidates
    const anchor = highTier[0];
    const candidatePool = highTier.slice(1, 6);
    const sampledRemainder = _.sampleSize(candidatePool, maxCount - 1);
    selected = [anchor, ...sampledRemainder];
  } else if (highTier.length > 0) {
    // Take high tier first, fill remainder from general pool
    const remainder = scoredItems.filter(s => s.score < 55);
    selected = [...highTier, ...remainder.slice(0, maxCount - highTier.length)];
  } else {
    // If no high-tier items, take top scored items
    selected = scoredItems.slice(0, maxCount);
  }

  return selected.map(({ item }) => ({
    id: String(item.id),
    name: item.name,
    rating: (item as any).rating,
    status: (item as any).status,
    rewatchCount: (item as any).rewatch_count || 0,
    reason: buildSeedReason(item as any),
  }));
}

const fetchAndCalculateRecommendations = unstable_cache(
  async (
    moviesToUse: SeedMediaItem[],
    showsToUse: SeedMediaItem[],
    gamesToUse: SeedMediaItem[]
  ) => {
    const recommendedPromises: Promise<any>[] = [];

    for (const movie of moviesToUse) {
      recommendedPromises.push(
        tmdbClient
          .getRecommendedMovies(movie.id)
          .then(res =>
            (res.results || []).map((item: any) => ({
              ...item,
              mediaType: 'movie',
              recommendedReason: movie.reason,
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
              recommendedReason: show.reason,
            }))
          )
          .catch(() => [])
      );
    }

    if (gamesToUse.length > 0) {
      recommendedPromises.push(
        igdbClient
          .getRecommendedGamesForMultiple(gamesToUse.map(g => ({ id: g.id, name: g.name })))
          .then(res =>
            (res || []).map((item: any) => {
              // Find matching seed reason if applicable
              const seed = gamesToUse[0];
              return {
                ...item,
                mediaType: 'game',
                recommendedReason: seed?.reason || 'Recommended from your games',
              };
            })
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
        Promise.resolve(tmdbClient.getTrending('movie', 'week'))
          .then(res =>
            (res?.results || []).map((item: any) => ({
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
        Promise.resolve(tmdbClient.getTrending('tv', 'week'))
          .then(res =>
            (res?.results || []).map((item: any) => ({
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
        Promise.resolve(igdbClient.getPopularGames(20, 1))
          .then(res =>
            (res?.results || []).map((item: any) => ({
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

    // Shuffle final pool to provide an engaging variety
    return _.shuffle(finalRecommendations);
  },
  ['for-you-recs-v2'],
  { revalidate: 3600 }
);

export async function getForYouRecommendations(
  userMovies: Movie[],
  userShows: Show[],
  userGames: Game[]
) {
  try {
    // Select smart rating-weighted seeds instead of blind recency
    const moviesToUse = selectSeedItems(userMovies, 3);
    const showsToUse = selectSeedItems(userShows, 3);
    const gamesToUse = selectSeedItems(userGames, 3);

    // Get recommendations
    const rawRecs = await fetchAndCalculateRecommendations(moviesToUse, showsToUse, gamesToUse);

    // Filter out items the user is currently tracking
    const trackedMovieIds = new Set(userMovies.map(m => String(m.id)));
    const trackedShowIds = new Set(userShows.map(s => String(s.id)));
    const trackedGameIds = new Set(userGames.map(g => String(g.id)));

    // Exclude disliked/dropped titles from ever showing in recommendations
    const dislikedMovieIds = new Set(
      userMovies
        .filter(m => m.status === 'DROPPED' || (m.rating !== null && m.rating <= 4))
        .map(m => String(m.id))
    );
    const dislikedShowIds = new Set(
      userShows
        .filter(s => s.status === 'DROPPED' || (s.rating !== null && s.rating <= 4))
        .map(s => String(s.id))
    );
    const dislikedGameIds = new Set(
      userGames.filter(g => g.rating !== null && g.rating <= 4).map(g => String(g.id))
    );

    const finalRecommendations = rawRecs.filter((item: any) => {
      const idStr = String(item.id);
      if (item.mediaType === 'movie') {
        if (trackedMovieIds.has(idStr) || dislikedMovieIds.has(idStr)) return false;
      }
      if (item.mediaType === 'show') {
        if (trackedShowIds.has(idStr) || dislikedShowIds.has(idStr)) return false;
      }
      if (item.mediaType === 'game') {
        if (trackedGameIds.has(idStr) || dislikedGameIds.has(idStr)) return false;
      }
      return true;
    });

    return finalRecommendations;
  } catch (error) {
    console.error('Error getting For You recommendations:', error);
    return [];
  }
}
