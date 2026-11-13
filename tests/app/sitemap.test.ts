import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrismaMovie, mockPrismaShow, mockPrismaGame } = vi.hoisted(() => ({
  mockPrismaMovie: {
    findMany: vi.fn(),
  },
  mockPrismaShow: {
    findMany: vi.fn(),
  },
  mockPrismaGame: {
    findMany: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    movie: mockPrismaMovie,
    show: mockPrismaShow,
    game: mockPrismaGame,
  },
}));

import sitemap from '@/app/sitemap';
import { CLIENT_BASE_URL } from '@/utils/constants';

describe('sitemap route generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('includes static public routes by default', async () => {
    mockPrismaMovie.findMany.mockResolvedValue([]);
    mockPrismaShow.findMany.mockResolvedValue([]);
    mockPrismaGame.findMany.mockResolvedValue([]);

    const result = await sitemap();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: CLIENT_BASE_URL, priority: 1.0 }),
        expect.objectContaining({ url: `${CLIENT_BASE_URL}/discover` }),
        expect.objectContaining({ url: `${CLIENT_BASE_URL}/movies/popular` }),
        expect.objectContaining({ url: `${CLIENT_BASE_URL}/shows/popular` }),
        expect.objectContaining({ url: `${CLIENT_BASE_URL}/games/popular` }),
        expect.objectContaining({ url: `${CLIENT_BASE_URL}/people/popular` }),
        expect.objectContaining({ url: `${CLIENT_BASE_URL}/collections` }),
      ])
    );
  });

  it('appends dynamic movie, show, and game URLs when media exists in the database', async () => {
    mockPrismaMovie.findMany.mockResolvedValue([{ id: '550' }, { id: '603' }]);
    mockPrismaShow.findMany.mockResolvedValue([{ id: '1399' }]);
    mockPrismaGame.findMany.mockResolvedValue([{ id: '1020' }]);

    const result = await sitemap();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: `${CLIENT_BASE_URL}/movie/550`,
          changeFrequency: 'weekly',
          priority: 0.6,
        }),
        expect.objectContaining({
          url: `${CLIENT_BASE_URL}/movie/603`,
          changeFrequency: 'weekly',
          priority: 0.6,
        }),
        expect.objectContaining({
          url: `${CLIENT_BASE_URL}/show/1399`,
          changeFrequency: 'weekly',
          priority: 0.6,
        }),
        expect.objectContaining({
          url: `${CLIENT_BASE_URL}/game/1020`,
          changeFrequency: 'weekly',
          priority: 0.6,
        }),
      ])
    );
    expect(result.length).toBe(12 + 4);
  });

  it('gracefully falls back to static routes if database throws an error', async () => {
    mockPrismaMovie.findMany.mockRejectedValue(new Error('Connection terminated'));

    const result = await sitemap();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(12);
    expect(result.some(entry => entry.url === CLIENT_BASE_URL)).toBe(true);
  });
});
