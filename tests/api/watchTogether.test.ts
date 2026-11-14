import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/watch-together/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { tmdbClient } from '@/lib/api';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/authOptions', () => ({
  authOptions: {},
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    movie: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
    show: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock('@/lib/api', () => ({
  tmdbClient: {
    getRecommendedMovies: vi.fn(),
    getRecommendedShows: vi.fn(),
    getMovieDetails: vi.fn(),
    getShowDetails: vi.fn(),
  },
  igdbClient: {
    getRecommendedGamesForMultiple: vi.fn(),
  },
}));

describe('GET /api/watch-together', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/watch-together?friendId=friend-1');
    const res = await GET(req);

    expect(res.status).toBe(401);
  });

  it('returns 400 when friendId is missing', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', name: 'User 1' },
    } as any);

    const req = new Request('http://localhost:3000/api/watch-together');
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it('returns 400 when friendId is identical to current user', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', name: 'User 1' },
    } as any);

    const req = new Request('http://localhost:3000/api/watch-together?friendId=user-1');
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it('returns 404 when friend user does not exist', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', name: 'User 1' },
    } as any);

    (prisma.user.findUnique as any).mockImplementation(async ({ where }: any) => {
      if (where.id === 'user-1') return { id: 'user-1', name: 'User 1', image: null } as any;
      return null;
    });

    const req = new Request('http://localhost:3000/api/watch-together?friendId=non-existent');
    const res = await GET(req);

    expect(res.status).toBe(404);
  });

  it('computes blend and returns 200 with blend data and fresh recommendations', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', name: 'User 1', image: 'u1.jpg' },
    } as any);

    (prisma.user.findUnique as any).mockImplementation(async ({ where }: any) => {
      if (where.id === 'user-1') return { id: 'user-1', name: 'User 1', image: 'u1.jpg' } as any;
      if (where.id === 'friend-2')
        return { id: 'friend-2', name: 'Friend 2', image: 'f2.jpg' } as any;
      return null;
    });

    (prisma.movie.findMany as any).mockImplementation(async ({ where }: any) => {
      if (where.userId === 'user-1') {
        return [
          {
            id: '100',
            name: 'Shared Queue Movie',
            status: 'PLAN_TO_WATCH',
            rating: null,
            rewatch_count: 0,
          },
          { id: '200', name: 'User 1 Favorite', status: 'COMPLETED', rating: 10, rewatch_count: 1 },
        ] as any;
      }
      if (where.userId === 'friend-2') {
        return [
          {
            id: '100',
            name: 'Shared Queue Movie',
            status: 'PLAN_TO_WATCH',
            rating: null,
            rewatch_count: 0,
          },
          { id: '300', name: 'Friend Favorite', status: 'COMPLETED', rating: 9, rewatch_count: 0 },
        ] as any;
      }
      return [];
    });

    vi.mocked(prisma.show.findMany).mockResolvedValue([]);

    vi.mocked(tmdbClient.getRecommendedMovies).mockResolvedValue({
      results: [{ id: 901, title: 'Fresh Movie Discovery' }],
    } as any);
    vi.mocked(tmdbClient.getRecommendedShows).mockResolvedValue({
      results: [],
    } as any);

    const req = new Request('http://localhost:3000/api/watch-together?friendId=friend-2');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.friend.name).toBe('Friend 2');
    expect(json.blend.mutualPlanToWatch.length).toBe(1);
    expect(json.blend.mutualPlanToWatch[0].name).toBe('Shared Queue Movie');
    expect(json.blend.friendPicksForYou.length).toBe(1);
    expect(json.blend.friendPicksForYou[0].name).toBe('Friend Favorite');
    expect(json.blendedRecommendations).toBeDefined();
  });

  it('backfills missing image and release_date from TMDB and updates database', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', name: 'User 1' },
    } as any);

    (prisma.user.findUnique as any).mockImplementation(async ({ where }: any) => {
      if (where.id === 'user-1') return { id: 'user-1', name: 'User 1' } as any;
      if (where.id === 'friend-2') return { id: 'friend-2', name: 'Friend 2' } as any;
      return null;
    });

    (prisma.movie.findMany as any).mockImplementation(async ({ where }: any) => {
      if (where.userId === 'user-1' || where.userId === 'friend-2') {
        return [
          {
            id: '639933',
            name: 'The Northman',
            status: 'PLAN_TO_WATCH',
            image: null,
            release_date: null,
            rating: null,
            rewatch_count: 0,
          },
        ] as any;
      }
      return [];
    });

    vi.mocked(prisma.show.findMany).mockResolvedValue([]);
    vi.mocked(prisma.movie.updateMany).mockResolvedValue({ count: 1 } as any);

    vi.mocked(tmdbClient.getMovieDetails).mockResolvedValue({
      poster_path: '/the-northman.jpg',
      release_date: '2022-04-22',
    } as any);

    vi.mocked(tmdbClient.getRecommendedMovies).mockResolvedValue({ results: [] } as any);
    vi.mocked(tmdbClient.getRecommendedShows).mockResolvedValue({ results: [] } as any);

    const req = new Request('http://localhost:3000/api/watch-together?friendId=friend-2');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.blend.mutualPlanToWatch[0].image).toBe('/the-northman.jpg');
    expect(json.blend.mutualPlanToWatch[0].release_date).toBe('2022-04-22');
    expect(prisma.movie.updateMany).toHaveBeenCalledWith({
      where: {
        id: '639933',
        OR: [{ image: null }, { release_date: null }],
      },
      data: {
        image: '/the-northman.jpg',
        release_date: '2022-04-22',
      },
    });
  });
});
