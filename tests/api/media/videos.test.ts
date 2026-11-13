import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/media/videos/route';
import { getMediaVideosAction } from '@/lib/actions/tmdbActions';
import { tmdbClient } from '@/lib/api';
import { selectBestTrailer, type TMDBVideo } from '@/components/Media/TrailerModal';

vi.mock('@/lib/api', () => ({
  tmdbClient: {
    getMovieVideos: vi.fn(),
    getShowVideos: vi.fn(),
  },
}));

describe('Media Videos & Trailer Modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/media/videos', () => {
    it('returns 400 if type parameter is missing', async () => {
      const req = new Request('http://localhost:3000/api/media/videos?id=123');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBeDefined();
    });

    it('returns 400 if id parameter is missing', async () => {
      const req = new Request('http://localhost:3000/api/media/videos?type=MOVIE');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBeDefined();
    });

    it('returns 400 if type is not MOVIE or SHOW', async () => {
      const req = new Request('http://localhost:3000/api/media/videos?type=GAME&id=123');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBeDefined();
    });

    it('fetches movie videos when type is MOVIE', async () => {
      const mockData = {
        id: 123,
        results: [
          {
            id: 'v1',
            key: 'abc123Key',
            name: 'Official Trailer',
            site: 'YouTube',
            type: 'Trailer',
            official: true,
          },
        ],
      };
      vi.mocked(tmdbClient.getMovieVideos).mockResolvedValueOnce(mockData as any);

      const req = new Request('http://localhost:3000/api/media/videos?type=MOVIE&id=123');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(tmdbClient.getMovieVideos).toHaveBeenCalledWith('123');
      expect(json.results[0].key).toBe('abc123Key');
    });

    it('fetches show videos when type is SHOW', async () => {
      const mockData = {
        id: 456,
        results: [
          {
            id: 'v2',
            key: 'showKey789',
            name: 'Teaser',
            site: 'YouTube',
            type: 'Teaser',
            official: true,
          },
        ],
      };
      vi.mocked(tmdbClient.getShowVideos).mockResolvedValueOnce(mockData as any);

      const req = new Request('http://localhost:3000/api/media/videos?type=SHOW&id=456');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(tmdbClient.getShowVideos).toHaveBeenCalledWith('456');
      expect(json.results[0].key).toBe('showKey789');
    });

    it('returns graceful empty results when TMDB throws', async () => {
      vi.mocked(tmdbClient.getMovieVideos).mockRejectedValueOnce(new Error('Network error'));

      const req = new Request('http://localhost:3000/api/media/videos?type=MOVIE&id=999');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual({ id: '999', results: [] });
    });
  });

  describe('getMediaVideosAction', () => {
    it('fetches movie videos via Server Action', async () => {
      const mockData = { id: 101, results: [{ key: 'mov101', site: 'YouTube' }] };
      vi.mocked(tmdbClient.getMovieVideos).mockResolvedValueOnce(mockData as any);

      const result = await getMediaVideosAction('MOVIE', '101');
      expect(tmdbClient.getMovieVideos).toHaveBeenCalledWith('101');
      expect(result).toEqual(mockData);
    });

    it('fetches show videos via Server Action', async () => {
      const mockData = { id: 202, results: [{ key: 'show202', site: 'YouTube' }] };
      vi.mocked(tmdbClient.getShowVideos).mockResolvedValueOnce(mockData as any);

      const result = await getMediaVideosAction('SHOW', '202');
      expect(tmdbClient.getShowVideos).toHaveBeenCalledWith('202');
      expect(result).toEqual(mockData);
    });

    it('returns null on action error', async () => {
      vi.mocked(tmdbClient.getMovieVideos).mockRejectedValueOnce(new Error('Action error'));

      const result = await getMediaVideosAction('MOVIE', '500');
      expect(result).toBeNull();
    });
  });

  describe('selectBestTrailer', () => {
    it('returns null for null, undefined, or empty arrays', () => {
      expect(selectBestTrailer(null)).toBeNull();
      expect(selectBestTrailer(undefined)).toBeNull();
      expect(selectBestTrailer([])).toBeNull();
    });

    it('returns null if there are no YouTube videos with keys', () => {
      const videos: TMDBVideo[] = [
        { id: '1', key: '', name: 'Vimeo', site: 'Vimeo', type: 'Trailer' },
        { id: '2', key: '123', name: 'Other', site: 'DailyMotion', type: 'Trailer' },
      ];
      expect(selectBestTrailer(videos)).toBeNull();
    });

    it('prioritizes official Trailer over unofficial Trailer', () => {
      const videos: TMDBVideo[] = [
        {
          id: '1',
          key: 'unofficial_trailer',
          name: 'Fan Trailer',
          site: 'YouTube',
          type: 'Trailer',
          official: false,
        },
        {
          id: '2',
          key: 'official_trailer',
          name: 'Official Trailer',
          site: 'YouTube',
          type: 'Trailer',
          official: true,
        },
      ];
      const selected = selectBestTrailer(videos);
      expect(selected?.key).toBe('official_trailer');
    });

    it('prioritizes any Trailer over an official Teaser', () => {
      const videos: TMDBVideo[] = [
        {
          id: '1',
          key: 'teaser',
          name: 'Official Teaser',
          site: 'YouTube',
          type: 'Teaser',
          official: true,
        },
        {
          id: '2',
          key: 'trailer',
          name: 'Trailer',
          site: 'YouTube',
          type: 'Trailer',
          official: false,
        },
      ];
      const selected = selectBestTrailer(videos);
      expect(selected?.key).toBe('trailer');
    });

    it('selects official Teaser if no Trailer is found', () => {
      const videos: TMDBVideo[] = [
        {
          id: '1',
          key: 'clip',
          name: 'Behind the Scenes',
          site: 'YouTube',
          type: 'Clip',
          official: true,
        },
        {
          id: '2',
          key: 'teaser',
          name: 'Official Teaser',
          site: 'YouTube',
          type: 'Teaser',
          official: true,
        },
      ];
      const selected = selectBestTrailer(videos);
      expect(selected?.key).toBe('teaser');
    });

    it('falls back to the first available YouTube video if no trailer/teaser matches', () => {
      const videos: TMDBVideo[] = [
        { id: '1', key: 'clip1', name: 'Clip', site: 'YouTube', type: 'Clip', official: false },
        {
          id: '2',
          key: 'bloopers',
          name: 'Bloopers',
          site: 'YouTube',
          type: 'Bloopers',
          official: false,
        },
      ];
      const selected = selectBestTrailer(videos);
      expect(selected?.key).toBe('clip1');
    });
  });
});
