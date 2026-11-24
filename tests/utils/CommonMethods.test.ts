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

  describe('getTheMovieDbImage', () => {
    it('prepends TMDB base image URL to relative paths', () => {
      expect(CommonMethods.getTheMovieDbImage('/poster.jpg')).toBe(
        'https://image.tmdb.org/t/p/original/poster.jpg'
      );
    });

    it('preserves full URLs without double-prefixing', () => {
      expect(CommonMethods.getTheMovieDbImage('https://image.tmdb.org/t/p/w500/poster.jpg')).toBe(
        'https://image.tmdb.org/t/p/w500/poster.jpg'
      );
      expect(CommonMethods.getTheMovieDbImage('http://example.com/poster.jpg')).toBe(
        'http://example.com/poster.jpg'
      );
    });

    it('handles protocol-relative URLs', () => {
      expect(CommonMethods.getTheMovieDbImage('//images.tmdb.org/t/p/w500/poster.jpg')).toBe(
        'https://images.tmdb.org/t/p/w500/poster.jpg'
      );
    });

    it('returns imageNotFound fallback for null or undefined', () => {
      expect(CommonMethods.getTheMovieDbImage(null)).toBeDefined();
      expect(CommonMethods.getTheMovieDbImage(undefined)).toBeDefined();
    });
  });

  describe('getUserStatusFromMedia and game status codes', () => {
    it('returns PP for PLAN_TO_PLAY on games', () => {
      const userMedias = [{ id: '732', status: 'PLAN_TO_PLAY', mediaType: 'game' }];
      expect(
        CommonMethods.getUserStatusFromMedia(userMedias as any, { id: 732, mediaType: 'game' })
      ).toBe('PP');
    });

    it('returns P for PLAYING on games', () => {
      const userMedias = [{ id: '732', status: 'PLAYING', mediaType: 'game' }];
      expect(
        CommonMethods.getUserStatusFromMedia(userMedias as any, { id: 732, mediaType: 'game' })
      ).toBe('P');
    });

    it('returns PW for PLAN_TO_WATCH on movies/shows', () => {
      const userMedias = [{ id: '550', status: 'PLAN_TO_WATCH', mediaType: 'movie' }];
      expect(
        CommonMethods.getUserStatusFromMedia(userMedias as any, { id: 550, mediaType: 'movie' })
      ).toBe('PW');
    });

    it('returns W for WATCHING on movies/shows', () => {
      const userMedias = [{ id: '550', status: 'WATCHING', mediaType: 'movie' }];
      expect(
        CommonMethods.getUserStatusFromMedia(userMedias as any, { id: 550, mediaType: 'movie' })
      ).toBe('W');
    });
  });

  describe('getWatchStatusBackgroundColor and getWatchStatusLabel', () => {
    it('returns correct background color for PP and P', () => {
      expect(CommonMethods.getWatchStatusBackgroundColor('PP')).toBe('bg-blue-500');
      expect(CommonMethods.getWatchStatusBackgroundColor('P')).toBe('bg-green-500');
      expect(CommonMethods.getWatchStatusBackgroundColor('PW')).toBe('bg-blue-500');
      expect(CommonMethods.getWatchStatusBackgroundColor('W')).toBe('bg-green-500');
      expect(CommonMethods.getWatchStatusBackgroundColor('C')).toBe('bg-yellow-500');
    });

    it('returns correct labels and tooltips', () => {
      expect(CommonMethods.getWatchStatusLabel('PP')).toBe('Plan to Play');
      expect(CommonMethods.getWatchStatusLabel('P')).toBe('Playing');
      expect(CommonMethods.getWatchStatusLabel('PW')).toBe('Plan to Watch');
      expect(CommonMethods.getWatchStatusLabel('W')).toBe('Watching');
      expect(CommonMethods.getWatchStatusLabel('C', true)).toBe('Played');
      expect(CommonMethods.getWatchStatusLabel('C', false)).toBe('Completed');
    });
  });
});
