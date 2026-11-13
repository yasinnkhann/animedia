import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockGetServerSession,
  mockPrismaMovie,
  mockPrismaShow,
  mockPrismaGame,
  mockRevalidatePath,
  mockRevalidateTag,
} = vi.hoisted(() => ({
  mockGetServerSession: vi.fn(),
  mockPrismaMovie: {
    update: vi.fn(),
  },
  mockPrismaShow: {
    update: vi.fn(),
  },
  mockPrismaGame: {
    update: vi.fn(),
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
    game: mockPrismaGame,
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
  revalidateTag: mockRevalidateTag,
}));

import { updateMediaPersonalDetails } from '@/app/actions/media';

describe('updateMediaPersonalDetails Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws an error if user is not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null);

    await expect(
      updateMediaPersonalDetails('550', 'MOVIE', { notes: 'Great film' })
    ).rejects.toThrow('Not authenticated');
  });

  it('updates Movie notes, tags, and rewatch count with sanitization and bounds', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });
    const updatedMovie = {
      id: '550',
      userId: 'user-1',
      notes: 'Loved the plot twist!',
      tags: ['favorite', 'cult-classic'],
      rewatch_count: 3,
    };
    mockPrismaMovie.update.mockResolvedValue(updatedMovie);

    const result = await updateMediaPersonalDetails('550', 'MOVIE', {
      notes: '  Loved the plot twist!  ',
      tags: ['Favorite', 'cult-classic', 'FAVORITE', ''],
      rewatchCount: 3.8,
    });

    expect(result).toEqual(updatedMovie);
    expect(mockPrismaMovie.update).toHaveBeenCalledWith({
      where: {
        id_userId: {
          id: '550',
          userId: 'user-1',
        },
      },
      data: {
        notes: 'Loved the plot twist!',
        tags: ['favorite', 'cult-classic'],
        rewatch_count: 3,
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    expect(mockRevalidateTag).toHaveBeenCalledWith('user-media', 'max');
  });

  it('allows clearing notes by passing null', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });
    mockPrismaMovie.update.mockResolvedValue({ id: '550', notes: null });

    await updateMediaPersonalDetails('550', 'MOVIE', { notes: null });

    expect(mockPrismaMovie.update).toHaveBeenCalledWith({
      where: {
        id_userId: {
          id: '550',
          userId: 'user-1',
        },
      },
      data: {
        notes: null,
      },
    });
  });

  it('updates Show personal details', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });
    const updatedShow = {
      id: '1399',
      userId: 'user-1',
      notes: 'Season 1 was legendary',
      tags: ['fantasy'],
      rewatch_count: 2,
    };
    mockPrismaShow.update.mockResolvedValue(updatedShow);

    const result = await updateMediaPersonalDetails('1399', 'SHOW', {
      notes: 'Season 1 was legendary',
      tags: ['fantasy'],
      rewatchCount: 2,
    });

    expect(result).toEqual(updatedShow);
    expect(mockPrismaShow.update).toHaveBeenCalledWith({
      where: {
        id_userId: {
          id: '1399',
          userId: 'user-1',
        },
      },
      data: {
        notes: 'Season 1 was legendary',
        tags: ['fantasy'],
        rewatch_count: 2,
      },
    });
  });

  it('updates Game personal details and clamps rewatch count between 0 and 999', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });
    const updatedGame = {
      id: '1020',
      userId: 'user-1',
      rewatch_count: 999,
    };
    mockPrismaGame.update.mockResolvedValue(updatedGame);

    const result = await updateMediaPersonalDetails('1020', 'GAME', {
      rewatchCount: 5000, // should clamp to 999
    });

    expect(result).toEqual(updatedGame);
    expect(mockPrismaGame.update).toHaveBeenCalledWith({
      where: {
        id_userId: {
          id: '1020',
          userId: 'user-1',
        },
      },
      data: {
        rewatch_count: 999,
      },
    });
  });

  it('throws an error for an invalid media type', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' } });

    await expect(
      updateMediaPersonalDetails('123', 'INVALID' as any, { notes: 'test' })
    ).rejects.toThrow('Invalid media type');
  });
});
