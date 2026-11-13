import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetServerSession, mockPrismaMovie, mockPrismaShow, mockPrismaGame } = vi.hoisted(
  () => ({
    mockGetServerSession: vi.fn(),
    mockPrismaMovie: {
      findMany: vi.fn(),
    },
    mockPrismaShow: {
      findMany: vi.fn(),
    },
    mockPrismaGame: {
      findMany: vi.fn(),
    },
  })
);

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
  unstable_cache: (fn: any) => fn,
}));

import { fetchUserMedia } from '@/app/actions/userMediaActions';

describe('fetchUserMedia Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty media arrays if the user is unauthenticated', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);

    const res = await fetchUserMedia();
    expect(res).toEqual({ userMovies: [], userShows: [], userGames: [] });
    expect(mockPrismaMovie.findMany).not.toHaveBeenCalled();
  });

  it('fetches and enriches movies, shows, and games for the authenticated user', async () => {
    mockGetServerSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    });

    mockPrismaMovie.findMany.mockResolvedValueOnce([
      { id: '27205', name: 'Inception', status: 'WATCHING', rating: 9, userId: 'user-123' },
    ]);
    mockPrismaShow.findMany.mockResolvedValueOnce([
      {
        id: '111111',
        name: 'Blood of Zeus',
        status: 'WATCHING',
        current_episode: 5,
        userId: 'user-123',
      },
    ]);
    mockPrismaGame.findMany.mockResolvedValueOnce([
      { id: '1942', name: 'The Witcher 3', status: 'PLAYING', userId: 'user-123' },
    ]);

    const res = await fetchUserMedia();

    expect(res.userMovies).toHaveLength(1);
    expect(res.userMovies[0]).toEqual({
      id: '27205',
      name: 'Inception',
      status: 'WATCHING',
      rating: 9,
      userId: 'user-123',
      mediaType: 'MOVIE',
    });

    expect(res.userShows).toHaveLength(1);
    expect(res.userShows[0]).toEqual({
      id: '111111',
      name: 'Blood of Zeus',
      status: 'WATCHING',
      current_episode: 5,
      userId: 'user-123',
      mediaType: 'SHOW',
    });

    expect(res.userGames).toHaveLength(1);
    expect(res.userGames[0]).toEqual({
      id: '1942',
      name: 'The Witcher 3',
      status: 'PLAYING',
      userId: 'user-123',
      mediaType: 'GAME',
    });

    expect(mockPrismaMovie.findMany).toHaveBeenCalledWith({ where: { userId: 'user-123' } });
    expect(mockPrismaShow.findMany).toHaveBeenCalledWith({ where: { userId: 'user-123' } });
    expect(mockPrismaGame.findMany).toHaveBeenCalledWith({ where: { userId: 'user-123' } });
  });

  it('handles database errors gracefully and returns empty arrays', async () => {
    mockGetServerSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    });
    mockPrismaMovie.findMany.mockRejectedValueOnce(new Error('Database unavailable'));

    const res = await fetchUserMedia();
    expect(res).toEqual({ userMovies: [], userShows: [], userGames: [] });
  });
});
