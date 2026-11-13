import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/media/details/route';

const {
  mockTmdbClient,
  mockIgdbClient,
  mockPrismaMovie,
  mockPrismaShow,
  mockPrismaGame,
  mockRevalidateTag,
} = vi.hoisted(() => ({
  mockTmdbClient: {
    getMovieDetails: vi.fn(),
    getShowDetails: vi.fn(),
    getSeasonDetails: vi.fn(),
    getRecommendedMovies: vi.fn(),
  },
  mockIgdbClient: {
    getGameDetails: vi.fn(),
  },
  mockPrismaMovie: {
    updateMany: vi.fn(),
  },
  mockPrismaShow: {
    updateMany: vi.fn(),
  },
  mockPrismaGame: {
    updateMany: vi.fn(),
  },
  mockRevalidateTag: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
  tmdbClient: mockTmdbClient,
  igdbClient: mockIgdbClient,
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    movie: mockPrismaMovie,
    show: mockPrismaShow,
    game: mockPrismaGame,
  },
}));

vi.mock('next/cache', () => ({
  revalidateTag: mockRevalidateTag,
}));

describe('GET /api/media/details', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Validation & Edge Cases', () => {
    it('returns 400 when type or id is missing', async () => {
      const reqNoType = new Request('http://localhost:3000/api/media/details?id=123');
      const resNoType = await GET(reqNoType);
      expect(resNoType.status).toBe(400);
      const jsonNoType = await resNoType.json();
      expect(jsonNoType.error).toBe('Missing type or id parameter');

      const reqNoId = new Request('http://localhost:3000/api/media/details?type=movie');
      const resNoId = await GET(reqNoId);
      expect(resNoId.status).toBe(400);
      const jsonNoId = await resNoId.json();
      expect(jsonNoId.error).toBe('Missing type or id parameter');
    });

    it('returns 400 when type=SEASON is missing season parameter', async () => {
      const req = new Request('http://localhost:3000/api/media/details?type=season&id=123');
      const res = await GET(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Missing season parameter');
    });

    it('returns 400 for unsupported media types', async () => {
      const req = new Request('http://localhost:3000/api/media/details?type=book&id=123');
      const res = await GET(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Unsupported media type');
    });

    it('gracefully returns null (200 OK) when an unhandled error occurs', async () => {
      mockTmdbClient.getMovieDetails.mockRejectedValueOnce(new Error('Network error'));
      const req = new Request('http://localhost:3000/api/media/details?type=movie&id=999');
      const res = await GET(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeNull();
    });
  });

  describe('Movie Details', () => {
    it('fetches movie details and backfills missing metadata in database', async () => {
      const mockMovieData = {
        id: 27205,
        title: 'Inception',
        poster_path: '/inception.jpg',
        release_date: '2010-07-16',
      };
      mockTmdbClient.getMovieDetails.mockResolvedValueOnce(mockMovieData);
      mockPrismaMovie.updateMany.mockResolvedValueOnce({ count: 1 });

      const req = new Request('http://localhost:3000/api/media/details?type=movie&id=27205');
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual(mockMovieData);

      expect(mockTmdbClient.getMovieDetails).toHaveBeenCalledWith('27205');
      expect(mockPrismaMovie.updateMany).toHaveBeenCalledWith({
        where: {
          id: '27205',
          OR: [{ image: null }, { release_date: null }],
        },
        data: {
          image: '/inception.jpg',
          release_date: '2010-07-16',
        },
      });
      expect(mockRevalidateTag).toHaveBeenCalledWith('user-media', 'max');
    });

    it('does not revalidateTag if no movie rows needed backfilling', async () => {
      mockTmdbClient.getMovieDetails.mockResolvedValueOnce({
        id: 27205,
        poster_path: '/poster.jpg',
      });
      mockPrismaMovie.updateMany.mockResolvedValueOnce({ count: 0 });

      const req = new Request('http://localhost:3000/api/media/details?type=movie&id=27205');
      await GET(req);

      expect(mockRevalidateTag).not.toHaveBeenCalled();
    });
  });

  describe('Show Details', () => {
    it('fetches show details, calculates aired episodes excluding future seasons, and backfills database', async () => {
      const mockShowData = {
        id: 111111,
        name: 'Blood of Zeus',
        poster_path: '/boz.jpg',
        first_air_date: '2020-10-27',
        number_of_episodes: 24,
        seasons: [
          { season_number: 1, name: 'Season 1', episode_count: 8, air_date: '2020-10-27' },
          { season_number: 2, name: 'Season 2', episode_count: 8, air_date: '2024-05-10' },
          { season_number: 3, name: 'Season 3', episode_count: 8, air_date: '2025-05-08' },
        ],
      };
      mockTmdbClient.getShowDetails.mockResolvedValueOnce(mockShowData);
      mockPrismaShow.updateMany.mockResolvedValueOnce({ count: 1 });

      const req = new Request('http://localhost:3000/api/media/details?type=show&id=111111');
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.id).toBe(111111);

      expect(mockTmdbClient.getShowDetails).toHaveBeenCalledWith('111111');
      expect(mockPrismaShow.updateMany).toHaveBeenCalledWith({
        where: {
          id: '111111',
          OR: [{ image: null }, { release_date: null }, { total_episodes: null }],
        },
        data: {
          image: '/boz.jpg',
          release_date: '2020-10-27',
          total_episodes: 24,
        },
      });
      expect(mockRevalidateTag).toHaveBeenCalledWith('user-media', 'max');
    });
  });

  describe('Game Details', () => {
    it('fetches game details and backfills cover image & release date', async () => {
      const mockGameData = {
        results: [
          {
            id: 1942,
            name: 'The Witcher 3: Wild Hunt',
            coverUrl: 'https://images.igdb.com/cover.jpg',
            first_release_date: 1431993600, // May 19, 2015 UTC
          },
        ],
      };
      mockIgdbClient.getGameDetails.mockResolvedValueOnce(mockGameData);
      mockPrismaGame.updateMany.mockResolvedValueOnce({ count: 1 });

      const req = new Request('http://localhost:3000/api/media/details?type=game&id=1942');
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.id).toBe(1942);

      expect(mockIgdbClient.getGameDetails).toHaveBeenCalledWith('1942');
      expect(mockPrismaGame.updateMany).toHaveBeenCalledWith({
        where: {
          id: '1942',
          OR: [{ image: null }, { release_date: null }],
        },
        data: {
          image: 'https://images.igdb.com/cover.jpg',
          release_date: new Date(1431993600 * 1000).toISOString(),
        },
      });
      expect(mockRevalidateTag).toHaveBeenCalledWith('user-media', 'max');
    });
  });

  describe('Season & Recommendations', () => {
    it('fetches season details when season number is provided', async () => {
      const mockSeason = { id: 100, season_number: 2, episodes: [] };
      mockTmdbClient.getSeasonDetails.mockResolvedValueOnce(mockSeason);

      const req = new Request(
        'http://localhost:3000/api/media/details?type=season&id=111111&season=2'
      );
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual(mockSeason);
      expect(mockTmdbClient.getSeasonDetails).toHaveBeenCalledWith('111111', 2);
    });

    it('fetches recommended movies for a movie ID', async () => {
      const mockRecs = { results: [{ id: 1, title: 'Rec Movie' }] };
      mockTmdbClient.getRecommendedMovies.mockResolvedValueOnce(mockRecs);

      const req = new Request(
        'http://localhost:3000/api/media/details?type=recommended_movies&id=27205'
      );
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual(mockRecs);
      expect(mockTmdbClient.getRecommendedMovies).toHaveBeenCalledWith('27205');
    });
  });
});
