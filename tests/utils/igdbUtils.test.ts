import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
}));

vi.mock('@/lib/redis', () => ({
  redis: {
    get: async () => 'mock-twitch-token',
    set: async () => 'OK',
  },
}));

import { addIGDBCoverUrl, addIGDBMugShotUrl } from '@/utils/igdbUtils';

describe('igdbUtils batching', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('batches multiple game cover IDs into a single IGDB /covers request', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 101, url: '//images.igdb.com/igdb/image/upload/t_thumb/co1.jpg' },
        { id: 102, url: '//images.igdb.com/igdb/image/upload/t_thumb/co2.jpg' },
      ],
    } as Response);

    const games: any[] = [
      { id: 1, name: 'Game 1', cover: 101 },
      { id: 2, name: 'Game 2', cover: 102 },
      { id: 3, name: 'Game 3', cover: null },
    ];

    await addIGDBCoverUrl(games, 'cover_big');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(games[0].coverUrl).toBe('//images.igdb.com/igdb/image/upload/t_cover_big/co1.jpg');
    expect(games[1].coverUrl).toBe('//images.igdb.com/igdb/image/upload/t_cover_big/co2.jpg');
    expect(games[2].coverUrl).toBeNull();
  });

  it('batches multiple mug_shot IDs into a single IGDB /character_mug_shots request', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{ id: 201, url: '//images.igdb.com/igdb/image/upload/t_thumb/ms1.jpg' }],
    } as Response);

    const characters: any[] = [
      { id: 1, name: 'Char 1', mug_shot: 201 },
      { id: 2, name: 'Char 2', mug_shot: null },
    ];

    await addIGDBMugShotUrl(characters, 'cover_big');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(characters[0].mugShotUrl).toBe(
      '//images.igdb.com/igdb/image/upload/t_cover_big/ms1.jpg'
    );
    expect(characters[1].mugShotUrl).toBeNull();
  });
});
