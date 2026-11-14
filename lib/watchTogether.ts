import type { Movie, Show } from '@prisma/client';

export interface BlendedMediaItem {
  id: string;
  name: string;
  mediaType: 'movie' | 'show';
  image?: string | null;
  poster_path?: string | null;
  release_date?: string | null;
  first_air_date?: string | null;
  userRating?: number | null;
  friendRating?: number | null;
  userStatus?: string | null;
  friendStatus?: string | null;
  reason?: string;
}

export interface WatchTogetherBlendResult {
  compatibilityScore: number; // 0 - 100
  mutualCount: number;
  mutualPlanToWatch: BlendedMediaItem[];
  mutualFavorites: BlendedMediaItem[];
  friendPicksForYou: BlendedMediaItem[];
  yourPicksForFriend: BlendedMediaItem[];
}

interface UserMediaLibrary {
  movies: Movie[];
  shows: Show[];
}

/**
 * Calculates a complete "Watch Together" blend between two users.
 */
export function calculateWatchTogetherBlend(
  user1: UserMediaLibrary,
  user2: UserMediaLibrary
): WatchTogetherBlendResult {
  const user1Movies = user1.movies || [];
  const user1Shows = user1.shows || [];
  const user2Movies = user2.movies || [];
  const user2Shows = user2.shows || [];

  const u1MovieMap = new Map(user1Movies.map(m => [String(m.id), m]));
  const u1ShowMap = new Map(user1Shows.map(s => [String(s.id), s]));

  const u2MovieMap = new Map(user2Movies.map(m => [String(m.id), m]));
  const u2ShowMap = new Map(user2Shows.map(s => [String(s.id), s]));

  // 1. MUTUAL PLAN-TO-WATCH (Both want to watch)
  const mutualPlanToWatch: BlendedMediaItem[] = [];

  // Check Movies
  for (const m1 of user1Movies) {
    const m2 = u2MovieMap.get(String(m1.id));
    if (m2) {
      const isU1Queue = m1.status === 'PLAN_TO_WATCH' || m1.status === 'WATCHING';
      const isU2Queue = m2.status === 'PLAN_TO_WATCH' || m2.status === 'WATCHING';
      const neitherFinished =
        m1.status !== 'COMPLETED' &&
        m2.status !== 'COMPLETED' &&
        m1.status !== 'DROPPED' &&
        m2.status !== 'DROPPED';

      if (isU1Queue && isU2Queue && neitherFinished) {
        mutualPlanToWatch.push({
          id: String(m1.id),
          name: m1.name,
          mediaType: 'movie',
          image: m1.image || m2.image,
          release_date: m1.release_date || m2.release_date,
          userStatus: m1.status,
          friendStatus: m2.status,
          userRating: m1.rating,
          friendRating: m2.rating,
          reason: 'Both have this on Plan to Watch',
        });
      }
    }
  }

  // Check Shows
  for (const s1 of user1Shows) {
    const s2 = u2ShowMap.get(String(s1.id));
    if (s2) {
      const isU1Queue = s1.status === 'PLAN_TO_WATCH' || s1.status === 'WATCHING';
      const isU2Queue = s2.status === 'PLAN_TO_WATCH' || s2.status === 'WATCHING';
      const neitherFinished =
        s1.status !== 'COMPLETED' &&
        s2.status !== 'COMPLETED' &&
        s1.status !== 'DROPPED' &&
        s2.status !== 'DROPPED';

      if (isU1Queue && isU2Queue && neitherFinished) {
        mutualPlanToWatch.push({
          id: String(s1.id),
          name: s1.name,
          mediaType: 'show',
          image: s1.image || s2.image,
          release_date: s1.release_date || s2.release_date,
          userStatus: s1.status,
          friendStatus: s2.status,
          userRating: s1.rating,
          friendRating: s2.rating,
          reason: 'Both have this on Plan to Watch',
        });
      }
    }
  }

  // 2. MUTUAL FAVORITES (Both watched and rated highly)
  const mutualFavorites: BlendedMediaItem[] = [];
  const sharedRatedDiffs: number[] = [];

  for (const m1 of user1Movies) {
    const m2 = u2MovieMap.get(String(m1.id));
    if (m2) {
      const r1 = m1.rating;
      const r2 = m2.rating;

      if (typeof r1 === 'number' && typeof r2 === 'number' && r1 > 0 && r2 > 0) {
        sharedRatedDiffs.push(Math.abs(r1 - r2));
        if (r1 >= 7 && r2 >= 7) {
          mutualFavorites.push({
            id: String(m1.id),
            name: m1.name,
            mediaType: 'movie',
            image: m1.image || m2.image,
            release_date: m1.release_date || m2.release_date,
            userRating: r1,
            friendRating: r2,
            userStatus: m1.status,
            friendStatus: m2.status,
            reason: `You rated ${r1}★ • Friend rated ${r2}★`,
          });
        }
      } else if (m1.status === 'COMPLETED' && m2.status === 'COMPLETED') {
        mutualFavorites.push({
          id: String(m1.id),
          name: m1.name,
          mediaType: 'movie',
          image: m1.image || m2.image,
          release_date: m1.release_date || m2.release_date,
          userRating: r1,
          friendRating: r2,
          userStatus: m1.status,
          friendStatus: m2.status,
          reason: 'Both completed this title',
        });
      }
    }
  }

  for (const s1 of user1Shows) {
    const s2 = u2ShowMap.get(String(s1.id));
    if (s2) {
      const r1 = s1.rating;
      const r2 = s2.rating;

      if (typeof r1 === 'number' && typeof r2 === 'number' && r1 > 0 && r2 > 0) {
        sharedRatedDiffs.push(Math.abs(r1 - r2));
        if (r1 >= 7 && r2 >= 7) {
          mutualFavorites.push({
            id: String(s1.id),
            name: s1.name,
            mediaType: 'show',
            image: s1.image || s2.image,
            release_date: s1.release_date || s2.release_date,
            userRating: r1,
            friendRating: r2,
            userStatus: s1.status,
            friendStatus: s2.status,
            reason: `You rated ${r1}★ • Friend rated ${r2}★`,
          });
        }
      } else if (s1.status === 'COMPLETED' && s2.status === 'COMPLETED') {
        mutualFavorites.push({
          id: String(s1.id),
          name: s1.name,
          mediaType: 'show',
          image: s1.image || s2.image,
          release_date: s1.release_date || s2.release_date,
          userRating: r1,
          friendRating: r2,
          userStatus: s1.status,
          friendStatus: s2.status,
          reason: 'Both completed this title',
        });
      }
    }
  }

  // Sort mutual favorites by highest combined rating
  mutualFavorites.sort((a, b) => {
    const avgA = ((a.userRating || 7) + (a.friendRating || 7)) / 2;
    const avgB = ((b.userRating || 7) + (b.friendRating || 7)) / 2;
    return avgB - avgA;
  });

  // 3. FRIEND'S PICKS FOR YOU (Friend loved, but you haven't watched yet)
  const friendPicksForYou: BlendedMediaItem[] = [];

  for (const m2 of user2Movies) {
    const m1 = u1MovieMap.get(String(m2.id));
    const friendLoved =
      (typeof m2.rating === 'number' && m2.rating >= 8) ||
      m2.rewatch_count > 0 ||
      (m2.status === 'COMPLETED' && (!m2.rating || m2.rating >= 7));

    // You haven't watched it (either not tracked at all or still on PLAN_TO_WATCH)
    const youHaventWatched = !m1 || m1.status === 'PLAN_TO_WATCH';
    const notDislikedByYou =
      !m1 || (m1.status !== 'DROPPED' && (m1.rating === null || m1.rating > 4));

    if (friendLoved && youHaventWatched && notDislikedByYou) {
      friendPicksForYou.push({
        id: String(m2.id),
        name: m2.name,
        mediaType: 'movie',
        image: m2.image,
        release_date: m2.release_date,
        friendRating: m2.rating,
        userStatus: m1?.status || null,
        friendStatus: m2.status,
        reason:
          m2.rating && m2.rating >= 8
            ? `Friend rated ${m2.rating}/10 ★`
            : m2.rewatch_count > 0
              ? `Friend rewatched (${m2.rewatch_count + 1}x)`
              : 'Friend completed and recommends',
      });
    }
  }

  for (const s2 of user2Shows) {
    const s1 = u1ShowMap.get(String(s2.id));
    const friendLoved =
      (typeof s2.rating === 'number' && s2.rating >= 8) ||
      s2.rewatch_count > 0 ||
      (s2.status === 'COMPLETED' && (!s2.rating || s2.rating >= 7));

    const youHaventWatched = !s1 || s1.status === 'PLAN_TO_WATCH';
    const notDislikedByYou =
      !s1 || (s1.status !== 'DROPPED' && (s1.rating === null || s1.rating > 4));

    if (friendLoved && youHaventWatched && notDislikedByYou) {
      friendPicksForYou.push({
        id: String(s2.id),
        name: s2.name,
        mediaType: 'show',
        image: s2.image,
        release_date: s2.release_date,
        friendRating: s2.rating,
        userStatus: s1?.status || null,
        friendStatus: s2.status,
        reason:
          s2.rating && s2.rating >= 8
            ? `Friend rated ${s2.rating}/10 ★`
            : s2.rewatch_count > 0
              ? `Friend rewatched (${s2.rewatch_count + 1}x)`
              : 'Friend completed and recommends',
      });
    }
  }

  // Sort by friend rating / rewatch desc
  friendPicksForYou.sort((a, b) => (b.friendRating || 7) - (a.friendRating || 7));

  // 4. YOUR PICKS FOR FRIEND (You loved, friend hasn't watched yet)
  const yourPicksForFriend: BlendedMediaItem[] = [];

  for (const m1 of user1Movies) {
    const m2 = u2MovieMap.get(String(m1.id));
    const youLoved =
      (typeof m1.rating === 'number' && m1.rating >= 8) ||
      m1.rewatch_count > 0 ||
      (m1.status === 'COMPLETED' && (!m1.rating || m1.rating >= 7));

    const friendHaventWatched = !m2 || m2.status === 'PLAN_TO_WATCH';
    const notDislikedByFriend =
      !m2 || (m2.status !== 'DROPPED' && (m2.rating === null || m2.rating > 4));

    if (youLoved && friendHaventWatched && notDislikedByFriend) {
      yourPicksForFriend.push({
        id: String(m1.id),
        name: m1.name,
        mediaType: 'movie',
        image: m1.image,
        release_date: m1.release_date,
        userRating: m1.rating,
        userStatus: m1.status,
        friendStatus: m2?.status || null,
        reason:
          m1.rating && m1.rating >= 8
            ? `You rated ${m1.rating}/10 ★`
            : m1.rewatch_count > 0
              ? `You rewatched (${m1.rewatch_count + 1}x)`
              : 'You completed and loved',
      });
    }
  }

  for (const s1 of user1Shows) {
    const s2 = u2ShowMap.get(String(s1.id));
    const youLoved =
      (typeof s1.rating === 'number' && s1.rating >= 8) ||
      s1.rewatch_count > 0 ||
      (s1.status === 'COMPLETED' && (!s1.rating || s1.rating >= 7));

    const friendHaventWatched = !s2 || s2.status === 'PLAN_TO_WATCH';
    const notDislikedByFriend =
      !s2 || (s2.status !== 'DROPPED' && (s2.rating === null || s2.rating > 4));

    if (youLoved && friendHaventWatched && notDislikedByFriend) {
      yourPicksForFriend.push({
        id: String(s1.id),
        name: s1.name,
        mediaType: 'show',
        image: s1.image,
        release_date: s1.release_date,
        userRating: s1.rating,
        userStatus: s1.status,
        friendStatus: s2?.status || null,
        reason:
          s1.rating && s1.rating >= 8
            ? `You rated ${s1.rating}/10 ★`
            : s1.rewatch_count > 0
              ? `You rewatched (${s1.rewatch_count + 1}x)`
              : 'You completed and loved',
      });
    }
  }

  yourPicksForFriend.sort((a, b) => (b.userRating || 7) - (a.userRating || 7));

  // 5. CALCULATE TASTE COMPATIBILITY SCORE (0 - 100%)
  let compatibility = 65; // Default welcoming baseline

  if (sharedRatedDiffs.length > 0) {
    const avgDiff = sharedRatedDiffs.reduce((a, b) => a + b, 0) / sharedRatedDiffs.length;
    // Difference of 0 stars = 100%, 0.5 stars = 95%, 1 star = 90%, 2 stars = 80%, etc.
    compatibility = Math.max(30, Math.round(100 - avgDiff * 10));
  } else if (mutualFavorites.length > 0) {
    compatibility = 75;
  }

  // Bonus for mutual watchlist overlap
  const queueBonus = Math.min(mutualPlanToWatch.length * 2, 8);
  const finalCompatibility = Math.min(99, Math.max(45, compatibility + queueBonus));

  return {
    compatibilityScore: finalCompatibility,
    mutualCount: mutualPlanToWatch.length + mutualFavorites.length,
    mutualPlanToWatch,
    mutualFavorites,
    friendPicksForYou,
    yourPicksForFriend,
  };
}
