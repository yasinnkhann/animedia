import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetServerSession, mockPrismaReview } = vi.hoisted(() => ({
  mockGetServerSession: vi.fn(),
  mockPrismaReview: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
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
    review: mockPrismaReview,
  },
}));

import { GET, POST } from '@/app/api/reviews/route';

describe('/api/reviews API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/reviews', () => {
    it('fetches reviews filtered by mediaType and mediaId', async () => {
      const mockReviews = [
        {
          id: 'rev-1',
          content: 'Amazing movie!',
          rating: 9,
          user: { id: 'u1', name: 'Alice', image: null },
        },
      ];
      mockPrismaReview.findMany.mockResolvedValue(mockReviews);

      const req = new Request('http://localhost:3000/api/reviews?mediaType=MOVIE&mediaId=550');
      const res = await GET(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.reviews).toEqual(mockReviews);
      expect(mockPrismaReview.findMany).toHaveBeenCalledWith({
        where: { mediaType: 'MOVIE', mediaId: '550' },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('fetches reviews filtered by userId', async () => {
      mockPrismaReview.findMany.mockResolvedValue([]);

      const req = new Request('http://localhost:3000/api/reviews?userId=u123');
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(mockPrismaReview.findMany).toHaveBeenCalledWith({
        where: { userId: 'u123' },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('handles database errors gracefully and returns 500', async () => {
      mockPrismaReview.findMany.mockRejectedValue(new Error('DB error'));

      const req = new Request('http://localhost:3000/api/reviews?userId=u123');
      const res = await GET(req);

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.error).toBe('Internal Server Error');
    });
  });

  describe('POST /api/reviews', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const req = new Request('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType: 'MOVIE',
          mediaId: '550',
          mediaTitle: 'Fight Club',
          content: 'Great film',
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('returns 400 when required fields are missing', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });

      const req = new Request('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType: 'MOVIE',
          // missing mediaId, mediaTitle, content
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Missing required fields');
    });

    it('returns 400 when user has already reviewed the item', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });
      mockPrismaReview.findFirst.mockResolvedValue({ id: 'existing-rev' });

      const req = new Request('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType: 'MOVIE',
          mediaId: '550',
          mediaTitle: 'Fight Club',
          content: 'Another review',
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('You have already reviewed this item');
    });

    it('successfully creates a review and returns 200', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });
      mockPrismaReview.findFirst.mockResolvedValue(null);
      const createdReview = {
        id: 'rev-new',
        userId: 'user-1',
        mediaType: 'MOVIE',
        mediaId: '550',
        mediaTitle: 'Fight Club',
        content: 'Mindblowing!',
        rating: 10,
        user: { id: 'user-1', name: 'Bob', image: null },
      };
      mockPrismaReview.create.mockResolvedValue(createdReview);

      const req = new Request('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType: 'MOVIE',
          mediaId: '550',
          mediaTitle: 'Fight Club',
          content: 'Mindblowing!',
          rating: 10,
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.review).toEqual(createdReview);
      expect(mockPrismaReview.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          mediaType: 'MOVIE',
          mediaId: '550',
          mediaTitle: 'Fight Club',
          mediaImage: undefined,
          content: 'Mindblowing!',
          rating: 10,
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      });
    });

    it('handles database error on creation and returns 500', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });
      mockPrismaReview.findFirst.mockRejectedValue(new Error('Database dead'));

      const req = new Request('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType: 'MOVIE',
          mediaId: '550',
          mediaTitle: 'Fight Club',
          content: 'Mindblowing!',
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.error).toBe('Internal Server Error');
    });
  });
});
