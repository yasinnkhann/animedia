import { describe, it, expect } from 'vitest';
import { CommonMethods } from '@/utils/CommonMethods';

describe('CommonMethods', () => {
  describe('formatDate', () => {
    it('formats YYYY-MM-DD strings deterministically in UTC without off-by-one timezone shifts', () => {
      expect(CommonMethods.formatDate('2026-10-15')).toBe('Oct 15, 2026');
      expect(CommonMethods.formatDate('2020-10-27')).toBe('Oct 27, 2020');
    });

    it('returns undefined for empty or invalid dates', () => {
      expect(CommonMethods.formatDate(null)).toBeUndefined();
      expect(CommonMethods.formatDate(undefined)).toBeUndefined();
      expect(CommonMethods.formatDate('not-a-date')).toBeUndefined();
    });
  });

  describe('getAiredEpisodeCount', () => {
    it('returns total episodes when all seasons have aired', () => {
      const showDetails = {
        number_of_episodes: 24,
        number_of_seasons: 3,
        seasons: [
          { name: 'Season 1', season_number: 1, episode_count: 8, air_date: '2020-10-27' },
          { name: 'Season 2', season_number: 2, episode_count: 8, air_date: '2024-05-10' },
          { name: 'Season 3', season_number: 3, episode_count: 8, air_date: '2025-05-08' },
        ],
      };

      expect(CommonMethods.getAiredEpisodeCount(showDetails)).toBe(24);
    });

    it('subtracts episodes from unaired or future seasons', () => {
      const showDetails = {
        number_of_episodes: 24,
        number_of_seasons: 3,
        seasons: [
          { name: 'Specials', season_number: 0, episode_count: 4, air_date: null },
          { name: 'Season 1', season_number: 1, episode_count: 8, air_date: '2022-09-01' },
          { name: 'Season 2', season_number: 2, episode_count: 8, air_date: '2024-08-29' },
          { name: 'Season 3', season_number: 3, episode_count: 8, air_date: null },
        ],
      };

      expect(CommonMethods.getAiredEpisodeCount(showDetails)).toBe(16);
    });

    it('returns null when number_of_episodes is missing', () => {
      expect(CommonMethods.getAiredEpisodeCount(null)).toBeNull();
      expect(CommonMethods.getAiredEpisodeCount({})).toBeNull();
    });
  });
});
