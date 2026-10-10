import { POST } from '../route';
import { generateText } from 'ai';
import { tmdbClient, igdbClient } from '@/lib/api';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('@ai-sdk/groq', () => ({
  createGroq: vi.fn(() => vi.fn(() => 'mocked-groq-model')),
}));

vi.mock('ai', () => ({
  generateText: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
  tmdbClient: {
    searchMovies: vi.fn(),
    searchShows: vi.fn(),
  },
  igdbClient: {
    searchGames: vi.fn(),
  },
}));

describe('POST /api/discover', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, GROQ_API_KEY: 'test-key' };
  });

  it('should return 500 if GROQ_API_KEY is missing', async () => {
    delete (process.env as any).GROQ_API_KEY;
    const req = new Request('http://localhost/api/discover', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'test', mediaType: 'MOVIE' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('GROQ_API_KEY is not set');
  });

  it('should generate text, fetch TMDB movies, and stream the result', async () => {
    // Mock the AI response to return a bulleted list
    (generateText as any).mockResolvedValue({
      text: '- Inception\n- Interstellar',
    });

    // Mock TMDB responses
    (tmdbClient.searchMovies as any)
      .mockResolvedValueOnce({ results: [{ id: 1, title: 'Inception' }] })
      .mockResolvedValueOnce({ results: [{ id: 2, title: 'Interstellar' }] });

    const req = new Request('http://localhost/api/discover', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'Sci-fi movies', mediaType: 'MOVIE' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    // Read the stream
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = (await reader?.read()) || { done: true };
      if (done) break;
      result += decoder.decode(value);
    }

    const lines = result.trim().split('\n');
    expect(lines).toHaveLength(2);
    expect(JSON.parse(lines[0])).toEqual({ type: 'MOVIE', data: { id: 1, title: 'Inception' } });
    expect(JSON.parse(lines[1])).toEqual({ type: 'MOVIE', data: { id: 2, title: 'Interstellar' } });

    expect(generateText).toHaveBeenCalledTimes(1);
    expect(tmdbClient.searchMovies).toHaveBeenCalledTimes(2);
  });

  it('should retry generation if the AI returns an empty string', async () => {
    // Mock AI to fail once, then succeed
    (generateText as any)
      .mockResolvedValueOnce({ text: '' })
      .mockResolvedValueOnce({ text: '- Halo' });

    (igdbClient.searchGames as any).mockResolvedValueOnce({ results: [{ id: 3, name: 'Halo' }] });

    const req = new Request('http://localhost/api/discover', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'FPS', mediaType: 'GAME' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = (await reader?.read()) || { done: true };
      if (done) break;
      result += decoder.decode(value);
    }

    expect(result).toContain('Halo');
    expect(generateText).toHaveBeenCalledTimes(2); // Should have retried
    expect(igdbClient.searchGames).toHaveBeenCalledTimes(1);
  });
});
