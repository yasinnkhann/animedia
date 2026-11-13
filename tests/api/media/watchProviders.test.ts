import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/media/watch-providers/route';
import { getWatchProvidersAction } from '@/lib/actions/tmdbActions';

const { mockTmdbClient } = vi.hoisted(() => ({
  mockTmdbClient: {
    getMovieWatchProviders: vi.fn(),
    getShowWatchProviders: vi.fn(),
  },
}));

vi.mock('@/lib/api', () => ({
  tmdbClient: mockTmdbClient,
}));

describe('Watch Providers API & Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/media/watch-providers', () => {
    it('returns 400 if type parameter is missing', async () => {
      const req = new Request('http://localhost:3000/api/media/watch-providers?id=108978');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain('Missing or invalid type/id');
    });

    it('returns 400 if id parameter is missing', async () => {
      const req = new Request('http://localhost:3000/api/media/watch-providers?type=SHOW');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain('Missing or invalid type/id');
    });

    it('returns 400 if type is not MOVIE or SHOW', async () => {
      const req = new Request(
        'http://localhost:3000/api/media/watch-providers?type=GAME&id=108978'
      );
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain('Missing or invalid type/id');
    });

    it('fetches movie watch providers when type is MOVIE', async () => {
      const mockData = {
        id: 550,
        results: {
          US: {
            link: 'https://justwatch.com/movie/550',
            flatrate: [
              {
                provider_id: 8,
                provider_name: 'Netflix',
                logo_path: '/netflix.jpg',
              },
            ],
          },
        },
      };
      mockTmdbClient.getMovieWatchProviders.mockResolvedValue(mockData);

      const req = new Request('http://localhost:3000/api/media/watch-providers?type=MOVIE&id=550');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual(mockData);
      expect(mockTmdbClient.getMovieWatchProviders).toHaveBeenCalledWith('550');
    });

    it('fetches show watch providers when type is SHOW', async () => {
      const mockData = {
        id: 108978,
        results: {
          US: {
            link: 'https://justwatch.com/tv/108978',
            flatrate: [
              {
                provider_id: 9,
                provider_name: 'Amazon Prime Video',
                logo_path: '/prime.jpg',
              },
            ],
          },
        },
      };
      mockTmdbClient.getShowWatchProviders.mockResolvedValue(mockData);

      const req = new Request(
        'http://localhost:3000/api/media/watch-providers?type=SHOW&id=108978'
      );
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual(mockData);
      expect(mockTmdbClient.getShowWatchProviders).toHaveBeenCalledWith('108978');
    });

    it('returns graceful empty results when TMDB throws', async () => {
      mockTmdbClient.getShowWatchProviders.mockRejectedValue(new Error('Network error'));

      const req = new Request('http://localhost:3000/api/media/watch-providers?type=SHOW&id=99999');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.results).toEqual({});
    });
  });

  describe('getWatchProvidersAction', () => {
    it('fetches movie watch providers via Server Action', async () => {
      const mockData = { id: 550, results: {} };
      mockTmdbClient.getMovieWatchProviders.mockResolvedValue(mockData);

      const result = await getWatchProvidersAction('MOVIE', '550');
      expect(result).toEqual(mockData);
      expect(mockTmdbClient.getMovieWatchProviders).toHaveBeenCalledWith('550');
    });

    it('fetches show watch providers via Server Action', async () => {
      const mockData = { id: 108978, results: {} };
      mockTmdbClient.getShowWatchProviders.mockResolvedValue(mockData);

      const result = await getWatchProvidersAction('SHOW', '108978');
      expect(result).toEqual(mockData);
      expect(mockTmdbClient.getShowWatchProviders).toHaveBeenCalledWith('108978');
    });

    it('returns null on action error', async () => {
      mockTmdbClient.getMovieWatchProviders.mockRejectedValue(new Error('Failure'));

      const result = await getWatchProvidersAction('MOVIE', '99999');
      expect(result).toBeNull();
    });
  });
});
