import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockGetServerSession,
  mockPrismaMovie,
  mockPrismaShow,
  mockPrismaActivity,
  mockRevalidatePath,
  mockRevalidateTag,
} = vi.hoisted(() => ({
  mockGetServerSession: vi.fn(),
  mockPrismaMovie: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  mockPrismaShow: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  mockPrismaActivity: {
    create: vi.fn(),
  },
  mockRevalidatePath: vi.fn(),
  mockRevalidateTag: vi.fn(),
}));

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

vi.mock('@/lib/actions/tmdbActions', () => ({
  getMovieDetailsAction: vi.fn(),
  getShowDetailsAction: vi.fn(),
}));

vi.mock('@/lib/actions/igdbActions', () => ({
  getGameDetailsAction: vi.fn(),
}));

vi.mock('next-auth', () => ({
  getServerSession: mockGetServerSession,
}));

vi.mock('@/lib/authOptions', () => ({
  authOptions: {},
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    movie: mockPrismaMovie,
    show: mockPrismaShow,
    activity: mockPrismaActivity,
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
  revalidateTag: mockRevalidateTag,
}));

import { startShowRewatch, startMovieRewatch } from '@/app/actions/media';

describe('Media Rewatch Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('startShowRewatch', () => {
    it('throws error when user is unauthenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      await expect(startShowRewatch('1399')).rejects.toThrow('Not authenticated');
    });

    it('throws error when show is not found in database', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });
      mockPrismaShow.findUnique.mockResolvedValue(null);

      await expect(startShowRewatch('1399')).rejects.toThrow('Show not found');
    });

    it('sets status to WATCHING, resets current_episode to 1, and increments rewatch_count', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });
      mockPrismaShow.findUnique.mockResolvedValue({
        id: '1399',
        name: 'Game of Thrones',
        status: 'COMPLETED',
        current_episode: 73,
        rewatch_count: 0,
        image: '/got.jpg',
      });

      const updatedShow = {
        id: '1399',
        name: 'Game of Thrones',
        status: 'WATCHING',
        current_episode: 1,
        rewatch_count: 1,
        image: '/got.jpg',
      };
      mockPrismaShow.update.mockResolvedValue(updatedShow);

      const result = await startShowRewatch('1399');

      expect(mockPrismaShow.update).toHaveBeenCalledWith({
        where: {
          id_userId: {
            id: '1399',
            userId: 'user-1',
          },
        },
        data: {
          status: 'WATCHING',
          current_episode: 1,
          rewatch_count: 1,
        },
      });
      expect(result).toEqual(updatedShow);
      expect(mockRevalidatePath).toHaveBeenCalledWith('/');
      expect(mockRevalidateTag).toHaveBeenCalledWith('user-media', 'max');
    });

    it('correctly increments existing rewatch_count (e.g. from 2 to 3)', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });
      mockPrismaShow.findUnique.mockResolvedValue({
        id: '1399',
        name: 'Game of Thrones',
        status: 'COMPLETED',
        current_episode: 73,
        rewatch_count: 2,
        image: '/got.jpg',
      });

      mockPrismaShow.update.mockResolvedValue({
        id: '1399',
        name: 'Game of Thrones',
        status: 'WATCHING',
        current_episode: 1,
        rewatch_count: 3,
      });

      await startShowRewatch('1399');

      expect(mockPrismaShow.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            status: 'WATCHING',
            current_episode: 1,
            rewatch_count: 3,
          },
        })
      );
    });
  });

  describe('startMovieRewatch', () => {
    it('throws error when unauthenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      await expect(startMovieRewatch('550')).rejects.toThrow('Not authenticated');
    });

    it('throws error when movie is not found', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });
      mockPrismaMovie.findUnique.mockResolvedValue(null);

      await expect(startMovieRewatch('550')).rejects.toThrow('Movie not found');
    });

    it('sets status to WATCHING and increments rewatch_count', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });
      mockPrismaMovie.findUnique.mockResolvedValue({
        id: '550',
        name: 'Fight Club',
        status: 'COMPLETED',
        rewatch_count: 1,
        image: '/fc.jpg',
      });

      const updatedMovie = {
        id: '550',
        name: 'Fight Club',
        status: 'WATCHING',
        rewatch_count: 2,
        image: '/fc.jpg',
      };
      mockPrismaMovie.update.mockResolvedValue(updatedMovie);

      const result = await startMovieRewatch('550');

      expect(mockPrismaMovie.update).toHaveBeenCalledWith({
        where: {
          id_userId: {
            id: '550',
            userId: 'user-1',
          },
        },
        data: {
          status: 'WATCHING',
          rewatch_count: 2,
        },
      });
      expect(result).toEqual(updatedMovie);
      expect(mockRevalidatePath).toHaveBeenCalledWith('/');
      expect(mockRevalidateTag).toHaveBeenCalledWith('user-media', 'max');
    });
  });
});
