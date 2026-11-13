import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetServerSession, mockPrismaFollows, mockPrismaActivity } = vi.hoisted(() => ({
  mockGetServerSession: vi.fn(),
  mockPrismaFollows: {
    findMany: vi.fn(),
  },
  mockPrismaActivity: {
    findMany: vi.fn(),
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: mockGetServerSession,
}));

vi.mock('@/lib/authOptions', () => ({
  authOptions: {},
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    follows: mockPrismaFollows,
    activity: mockPrismaActivity,
  },
}));

import { GET } from '@/app/api/feed/route';

describe('GET /api/feed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/feed');
    const res = await GET(req);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('returns empty activities when user is following no one', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-me' } });
    mockPrismaFollows.findMany.mockResolvedValue([]);
    mockPrismaActivity.findMany.mockResolvedValue([]);

    const req = new Request('http://localhost:3000/api/feed');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.activities).toEqual([]);
    expect(mockPrismaActivity.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: { in: [] } },
      })
    );
  });

  it('fetches and returns paginated activities of followed users excluding self', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-me' } });
    mockPrismaFollows.findMany.mockResolvedValue([
      { followingId: 'friend-1' },
      { followingId: 'friend-2' },
      { followingId: 'user-me' }, // should be filtered out
    ]);

    const mockActivities = [
      {
        id: 'act-1',
        type: 'STATUS_CHANGED',
        mediaTitle: 'Inception',
        user: { id: 'friend-1', name: 'Friend One', image: null },
        likes: [],
        _count: { comments: 0 },
      },
    ];
    mockPrismaActivity.findMany.mockResolvedValue(mockActivities);

    const req = new Request('http://localhost:3000/api/feed?page=2&limit=10');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.activities).toEqual(mockActivities);
    expect(mockPrismaActivity.findMany).toHaveBeenCalledWith({
      where: { userId: { in: ['friend-1', 'friend-2'] } },
      include: {
        user: { select: { id: true, name: true, image: true } },
        likes: true,
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      skip: 10,
    });
  });

  it('handles database errors gracefully and returns 500', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-me' } });
    mockPrismaFollows.findMany.mockRejectedValue(new Error('Database disconnected'));

    const req = new Request('http://localhost:3000/api/feed');
    const res = await GET(req);

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Internal Server Error');
  });
});
