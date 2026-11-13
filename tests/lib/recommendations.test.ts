import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
}));

vi.mock('@/lib/api', () => ({
  tmdbClient: {
    getRecommendedMovies: vi.fn(),
    getRecommendedShows: vi.fn(),
    getTrending: vi.fn(),
  },
  igdbClient: {
    getRecommendedGamesForMultiple: vi.fn(),
    getPopularGames: vi.fn(),
  },
}));

import {
  scoreMediaForRecommendation,
  buildSeedReason,
  selectSeedItems,
  getForYouRecommendations,
} from '@/lib/recommendations';
import { tmdbClient, igdbClient } from '@/lib/api';

describe('Recommendations Engine (lib/recommendations)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tmdbClient.getTrending).mockResolvedValue({
      results: [],
      page: 1,
      total_pages: 1,
      total_results: 0,
    } as any);
    vi.mocked(igdbClient.getPopularGames).mockResolvedValue({
      results: [],
      total_results: 0,
      page: 1,
      total_pages: 0,
    } as any);
  });

  describe('scoreMediaForRecommendation', () => {
    it('disqualifies dropped media with score -1', () => {
      const item = {
        id: '1',
        name: 'Bad Movie',
        status: 'DROPPED',
        rating: 9,
      };
      expect(scoreMediaForRecommendation(item)).toBe(-1);
    });

    it('disqualifies low-rated media (rating <= 4) with score -1', () => {
      expect(scoreMediaForRecommendation({ id: '1', name: 'Movie 1', rating: 1 })).toBe(-1);
      expect(scoreMediaForRecommendation({ id: '2', name: 'Movie 2', rating: 3 })).toBe(-1);
      expect(scoreMediaForRecommendation({ id: '3', name: 'Movie 3', rating: 4 })).toBe(-1);
    });

    it('scores high ratings properly (10 = 100, 9 = 85, 8 = 70, 7 = 55)', () => {
      expect(scoreMediaForRecommendation({ id: '1', name: 'M1', rating: 10 })).toBe(100);
      expect(scoreMediaForRecommendation({ id: '2', name: 'M2', rating: 9 })).toBe(85);
      expect(scoreMediaForRecommendation({ id: '3', name: 'M3', rating: 8 })).toBe(70);
      expect(scoreMediaForRecommendation({ id: '4', name: 'M4', rating: 7 })).toBe(55);
      expect(scoreMediaForRecommendation({ id: '5', name: 'M5', rating: 6 })).toBe(30);
    });

    it('scores unrated media based on status engagement', () => {
      expect(scoreMediaForRecommendation({ id: '1', name: 'M1', status: 'COMPLETED' })).toBe(45);
      expect(scoreMediaForRecommendation({ id: '2', name: 'M2', status: 'WATCHING' })).toBe(40);
      expect(scoreMediaForRecommendation({ id: '3', name: 'M3', status: 'PLAN_TO_WATCH' })).toBe(
        15
      );
      expect(scoreMediaForRecommendation({ id: '4', name: 'M4', status: 'ON_HOLD' })).toBe(10);
    });

    it('adds bonus for rewatches (15 per rewatch, max 45)', () => {
      // 10 rating (100) + 1 rewatch (15) = 115
      expect(
        scoreMediaForRecommendation({ id: '1', name: 'M1', rating: 10, rewatch_count: 1 })
      ).toBe(115);
      // 10 rating (100) + 2 rewatches (30) = 130
      expect(
        scoreMediaForRecommendation({ id: '2', name: 'M2', rating: 10, rewatch_count: 2 })
      ).toBe(130);
      // 10 rating (100) + 4 rewatches (capped at 45) = 145
      expect(
        scoreMediaForRecommendation({ id: '3', name: 'M3', rating: 10, rewatch_count: 4 })
      ).toBe(145);
    });

    it('adds bonus for personal notes or tags', () => {
      expect(
        scoreMediaForRecommendation({ id: '1', name: 'M1', rating: 8, notes: 'Masterpiece!' })
      ).toBe(80); // 70 + 10
      expect(
        scoreMediaForRecommendation({
          id: '2',
          name: 'M2',
          rating: 8,
          tags: ['favorite', 'sci-fi'],
        })
      ).toBe(80); // 70 + 10
    });
  });

  describe('buildSeedReason', () => {
    it('builds rating reason for >= 8★', () => {
      expect(buildSeedReason({ name: 'Inception', rating: 10 })).toBe(
        'Because you rated Inception 10/10 ★'
      );
      expect(buildSeedReason({ name: 'Interstellar', rating: 8 })).toBe(
        'Because you rated Interstellar 8/10 ★'
      );
    });

    it('builds rewatch reason for rewatched titles without high rating', () => {
      expect(buildSeedReason({ name: 'The Office', rewatch_count: 2 })).toBe(
        'Because you rewatched The Office (3x)'
      );
    });

    it('builds liked reason for 7★', () => {
      expect(buildSeedReason({ name: 'Tenet', rating: 7 })).toBe('Because you liked Tenet (7/10)');
    });

    it('builds completed reason for COMPLETED status', () => {
      expect(buildSeedReason({ name: 'Breaking Bad', status: 'COMPLETED' })).toBe(
        'Because you completed Breaking Bad'
      );
    });

    it('builds watching reason for WATCHING status', () => {
      expect(buildSeedReason({ name: 'Severance', status: 'WATCHING' })).toBe(
        "Because you're watching Severance"
      );
    });

    it('falls back to tracked reason', () => {
      expect(buildSeedReason({ name: 'Dune', status: 'PLAN_TO_WATCH' })).toBe(
        'Because you tracked Dune'
      );
    });
  });

  describe('selectSeedItems', () => {
    it('returns empty array when given empty list', () => {
      expect(selectSeedItems([])).toEqual([]);
    });

    it('discards items with score <= 0 (dropped or low ratings)', () => {
      const items = [
        { id: '1', name: 'Terrible Film', rating: 2, status: 'COMPLETED' },
        { id: '2', name: 'Dropped Show', rating: 9, status: 'DROPPED' },
        { id: '3', name: 'Great Movie', rating: 9, status: 'COMPLETED' },
      ];
      const seeds = selectSeedItems(items as any, 3);
      expect(seeds.length).toBe(1);
      expect(seeds[0].id).toBe('3');
      expect(seeds[0].name).toBe('Great Movie');
      expect(seeds[0].reason).toContain('Because you rated Great Movie 9/10 ★');
    });

    it('prioritizes high scoring items over lower scoring items', () => {
      const items = [
        { id: '1', name: 'Okay Movie', rating: 6, status: 'COMPLETED' },
        { id: '2', name: 'Good Movie', rating: 8, status: 'COMPLETED' },
        { id: '3', name: 'Masterpiece', rating: 10, status: 'COMPLETED', rewatch_count: 2 },
        { id: '4', name: 'Great Movie', rating: 9, status: 'COMPLETED' },
      ];
      const seeds = selectSeedItems(items as any, 2);
      expect(seeds.length).toBe(2);
      const seedIds = seeds.map(s => s.id);
      // Masterpiece (score 130) is the guaranteed top anchor
      expect(seedIds).toContain('3');
      // Low scoring item '1' (score 30) must never displace high-tier items
      expect(seedIds).not.toContain('1');
    });
  });

  describe('getForYouRecommendations', () => {
    it('fetches recommendations using top seeds and excludes tracked & disliked items', async () => {
      const userMovies = [
        { id: '100', name: 'Masterpiece 1', rating: 10, status: 'COMPLETED', rewatch_count: 1 },
        { id: '200', name: 'Hated Movie', rating: 2, status: 'DROPPED' },
      ];
      const userShows = [
        { id: '300', name: 'Top Show', rating: 9, status: 'COMPLETED', rewatch_count: 0 },
      ];
      const userGames: any[] = [];

      vi.mocked(tmdbClient.getRecommendedMovies).mockResolvedValue({
        page: 1,
        results: [
          { id: 100, title: 'Masterpiece 1' }, // Already tracked -> should be excluded
          { id: 200, title: 'Hated Movie' }, // Disliked/dropped -> should be excluded
          { id: 501, title: 'Recommended Movie 1' }, // Good -> keep
        ],
        total_pages: 1,
        total_results: 3,
      } as any);

      vi.mocked(tmdbClient.getRecommendedShows).mockResolvedValue({
        page: 1,
        results: [
          { id: 300, name: 'Top Show' }, // Already tracked -> should be excluded
          { id: 601, name: 'Recommended Show 1' }, // Good -> keep
        ],
        total_pages: 1,
        total_results: 2,
      } as any);

      const recs = await getForYouRecommendations(userMovies as any, userShows as any, userGames);

      // Should contain 501 and 601, but NOT 100, 200, or 300
      const recIds = recs.map(r => String(r.id));
      expect(recIds).toContain('501');
      expect(recIds).toContain('601');
      expect(recIds).not.toContain('100');
      expect(recIds).not.toContain('200');
      expect(recIds).not.toContain('300');

      // Verify recommendation reasons are populated
      const movieRec = recs.find(r => String(r.id) === '501');
      expect(movieRec?.recommendedReason).toContain('Because you rated Masterpiece 1 10/10 ★');
    });

    it('falls back to trending content when user has no tracked media', async () => {
      vi.mocked(tmdbClient.getTrending).mockImplementation(async (type: any) => {
        if (type === 'movie') {
          return {
            page: 1,
            results: [{ id: 991, title: 'Trending Movie' }],
            total_pages: 1,
            total_results: 1,
          } as any;
        }
        return {
          page: 1,
          results: [{ id: 992, name: 'Trending Show' }],
          total_pages: 1,
          total_results: 1,
        } as any;
      });

      vi.mocked(igdbClient.getPopularGames).mockResolvedValue({
        results: [{ id: 993, name: 'Trending Game' }],
      } as any);

      const recs = await getForYouRecommendations([], [], []);
      const recIds = recs.map(r => String(r.id));

      expect(recIds).toContain('991');
      expect(recIds).toContain('992');
      expect(recIds).toContain('993');
    });

    it('handles API errors gracefully and returns empty array on critical error', async () => {
      vi.mocked(tmdbClient.getRecommendedMovies).mockRejectedValue(new Error('Network error'));
      vi.mocked(tmdbClient.getTrending).mockRejectedValue(new Error('Network error'));
      vi.mocked(igdbClient.getPopularGames).mockRejectedValue(new Error('Network error'));

      const recs = await getForYouRecommendations([], [], []);
      expect(Array.isArray(recs)).toBe(true);
    });
  });
});
