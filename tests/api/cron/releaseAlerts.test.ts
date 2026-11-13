import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/cron/release-alerts/route';
import { NotificationType, MediaType, WatchStatus, GameStatus } from '@prisma/client';

const { mockPrismaMovie, mockPrismaShow, mockPrismaGame, mockPrismaNotification } = vi.hoisted(
  () => ({
    mockPrismaMovie: {
      findMany: vi.fn(),
    },
    mockPrismaShow: {
      findMany: vi.fn(),
    },
    mockPrismaGame: {
      findMany: vi.fn(),
    },
    mockPrismaNotification: {
      findMany: vi.fn(),
      createMany: vi.fn(),
    },
  })
);

vi.mock('@/lib/prisma', () => ({
  prisma: {
    movie: mockPrismaMovie,
    show: mockPrismaShow,
    game: mockPrismaGame,
    notification: mockPrismaNotification,
  },
}));

describe('GET /api/cron/release-alerts', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, CRON_SECRET: 'test-cron-secret' };
  });

  it('rejects unauthorized requests in production when bearer token does not match', async () => {
    (process.env as any).NODE_ENV = 'production';
    const req = new Request('http://localhost:3000/api/cron/release-alerts', {
      headers: { authorization: 'Bearer wrong-secret' },
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('creates notifications for items releasing today while deduplicating existing alerts', async () => {
    (process.env as any).NODE_ENV = 'development';
    const todayString = new Date().toISOString().split('T')[0];

    // Mock 1 movie releasing today, 1 show releasing in the future, 1 game releasing today
    mockPrismaMovie.findMany.mockResolvedValueOnce([
      {
        id: '101',
        name: 'Movie Today',
        userId: 'user-1',
        status: WatchStatus.PLAN_TO_WATCH,
        release_date: `${todayString}`,
        image: '/movie.jpg',
      },
    ]);

    mockPrismaShow.findMany.mockResolvedValueOnce([
      {
        id: '201',
        name: 'Show Future',
        userId: 'user-1',
        status: WatchStatus.PLAN_TO_WATCH,
        release_date: '2099-01-01',
        image: '/show.jpg',
      },
    ]);

    mockPrismaGame.findMany.mockResolvedValueOnce([
      {
        id: '301',
        name: 'Game Today Already Alerted',
        userId: 'user-1',
        status: GameStatus.PLAN_TO_PLAY,
        release_date: new Date(`${todayString}T12:00:00Z`).toISOString(),
        image: '/game.jpg',
      },
    ]);

    // Mock that the game already received an alert today
    mockPrismaNotification.findMany.mockResolvedValueOnce([
      {
        userId: 'user-1',
        mediaId: '301',
        mediaType: MediaType.GAME,
      },
    ]);

    mockPrismaNotification.createMany.mockResolvedValueOnce({ count: 1 });

    const req = new Request('http://localhost:3000/api/cron/release-alerts');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ success: true, alertedCount: 1 });

    // Ensure only the movie was inserted, and the duplicate game alert was filtered out
    expect(mockPrismaNotification.createMany).toHaveBeenCalledWith({
      data: [
        {
          userId: 'user-1',
          type: NotificationType.RELEASE_ALERT,
          mediaType: MediaType.MOVIE,
          mediaId: '101',
          mediaTitle: 'Movie Today',
          mediaImage: '/movie.jpg',
          message: 'Movie Today releases today! Time to dive in.',
        },
      ],
    });
  });

  it('handles errors gracefully and returns 500', async () => {
    (process.env as any).NODE_ENV = 'development';
    mockPrismaMovie.findMany.mockRejectedValueOnce(new Error('DB failure'));

    const req = new Request('http://localhost:3000/api/cron/release-alerts');
    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});
