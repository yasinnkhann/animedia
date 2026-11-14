import { describe, it, expect } from 'vitest';
import { calculateWatchTogetherBlend } from '@/lib/watchTogether';

describe('Watch Together Blend Engine (lib/watchTogether)', () => {
  it('correctly identifies mutual plan-to-watch items', () => {
    const user1 = {
      movies: [
        {
          id: '101',
          name: 'Dune: Part Two',
          status: 'PLAN_TO_WATCH',
          rating: null,
          rewatch_count: 0,
        },
        { id: '102', name: 'Oppenheimer', status: 'COMPLETED', rating: 9, rewatch_count: 0 },
      ],
      shows: [{ id: '201', name: 'Severance', status: 'WATCHING', rating: null, rewatch_count: 0 }],
    };

    const user2 = {
      movies: [
        {
          id: '101',
          name: 'Dune: Part Two',
          status: 'PLAN_TO_WATCH',
          rating: null,
          rewatch_count: 0,
        },
        { id: '102', name: 'Oppenheimer', status: 'PLAN_TO_WATCH', rating: null, rewatch_count: 0 },
      ],
      shows: [
        { id: '201', name: 'Severance', status: 'PLAN_TO_WATCH', rating: null, rewatch_count: 0 },
      ],
    };

    const result = calculateWatchTogetherBlend(user1 as any, user2 as any);

    // Mutual Plan to Watch should include 101 (Dune) and 201 (Severance), but NOT 102 (User 1 already completed it)
    const mutualIds = result.mutualPlanToWatch.map(m => m.id);
    expect(mutualIds).toContain('101');
    expect(mutualIds).toContain('201');
    expect(mutualIds).not.toContain('102');
  });

  it('correctly identifies mutual favorites and computes rating alignment', () => {
    const user1 = {
      movies: [
        { id: '1', name: 'Inception', status: 'COMPLETED', rating: 10, rewatch_count: 2 },
        { id: '2', name: 'Interstellar', status: 'COMPLETED', rating: 8, rewatch_count: 0 },
      ],
      shows: [],
    };

    const user2 = {
      movies: [
        { id: '1', name: 'Inception', status: 'COMPLETED', rating: 9, rewatch_count: 1 },
        { id: '2', name: 'Interstellar', status: 'COMPLETED', rating: 8, rewatch_count: 0 },
      ],
      shows: [],
    };

    const result = calculateWatchTogetherBlend(user1 as any, user2 as any);

    expect(result.mutualFavorites.length).toBe(2);
    expect(result.mutualFavorites[0].id).toBe('1');
    expect(result.mutualFavorites[0].userRating).toBe(10);
    expect(result.mutualFavorites[0].friendRating).toBe(9);

    // Very close ratings (diff 1 and diff 0) should yield high compatibility
    expect(result.compatibilityScore).toBeGreaterThanOrEqual(80);
  });

  it('recommends friend favorites you have not watched yet', () => {
    const user1 = {
      movies: [],
      shows: [],
    };

    const user2 = {
      movies: [
        { id: '10', name: 'Spider-Verse', status: 'COMPLETED', rating: 10, rewatch_count: 1 },
        { id: '11', name: 'Bad Movie', status: 'COMPLETED', rating: 4, rewatch_count: 0 },
      ],
      shows: [{ id: '20', name: 'Shogun', status: 'COMPLETED', rating: 9, rewatch_count: 0 }],
    };

    const result = calculateWatchTogetherBlend(user1 as any, user2 as any);

    const pickIds = result.friendPicksForYou.map(p => p.id);
    expect(pickIds).toContain('10');
    expect(pickIds).toContain('20');
    // Bad movie (rating 4) should never be recommended
    expect(pickIds).not.toContain('11');
  });

  it('does not recommend items that user has marked as DROPPED', () => {
    const user1 = {
      movies: [{ id: '50', name: 'Hated Film', status: 'DROPPED', rating: 2, rewatch_count: 0 }],
      shows: [],
    };

    const user2 = {
      movies: [{ id: '50', name: 'Hated Film', status: 'COMPLETED', rating: 10, rewatch_count: 0 }],
      shows: [],
    };

    const result = calculateWatchTogetherBlend(user1 as any, user2 as any);
    const pickIds = result.friendPicksForYou.map(p => p.id);
    expect(pickIds).not.toContain('50');
  });

  it('handles empty libraries without errors', () => {
    const result = calculateWatchTogetherBlend(
      { movies: [], shows: [] } as any,
      { movies: [], shows: [] } as any
    );

    expect(result.compatibilityScore).toBeGreaterThanOrEqual(45);
    expect(result.mutualPlanToWatch).toEqual([]);
    expect(result.mutualFavorites).toEqual([]);
    expect(result.friendPicksForYou).toEqual([]);
    expect(result.yourPicksForFriend).toEqual([]);
  });
});
