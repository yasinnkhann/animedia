import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockCreateGroq, mockStreamText } = vi.hoisted(() => ({
  mockCreateGroq: vi.fn(() => vi.fn()),
  mockStreamText: vi.fn(),
}));

vi.mock('@ai-sdk/groq', () => ({
  createGroq: mockCreateGroq,
}));

vi.mock('ai', () => ({
  streamText: mockStreamText,
}));

import { POST } from '@/app/api/summarize-reviews/route';

describe('POST /api/summarize-reviews', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, GROQ_API_KEY: 'test-groq-key' };
  });

  it('returns 500 when GROQ_API_KEY is not set', async () => {
    delete (process.env as any).GROQ_API_KEY;

    const req = new Request('http://localhost:3000/api/summarize-reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviews: ['Great movie!'] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('GROQ_API_KEY is not set');
  });

  it('returns 400 when reviews are missing or not an array', async () => {
    const req = new Request('http://localhost:3000/api/summarize-reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('No reviews provided');
  });

  it('returns 400 when all reviews are empty or non-string', async () => {
    const req = new Request('http://localhost:3000/api/summarize-reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviews: ['', '   ', null, 123] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('No valid reviews provided');
  });

  it('caps reviews at 20 and streams the AI generated summary', async () => {
    const asyncIterable = {
      async *[Symbol.asyncIterator]() {
        yield 'A cinematic ';
        yield 'masterpiece.';
      },
    };

    mockStreamText.mockResolvedValue({
      textStream: asyncIterable,
    });

    // Provide 25 reviews to test clamping to 20
    const manyReviews = Array.from({ length: 25 }, (_, i) => `Review number ${i + 1}`);

    const req = new Request('http://localhost:3000/api/summarize-reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mediaTitle: 'Inception',
        reviews: manyReviews,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/plain');

    const text = await res.text();
    expect(text).toBe('A cinematic masterpiece.');

    expect(mockStreamText).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringContaining('Inception'),
        prompt: expect.not.stringContaining('Review 21'), // verify clamped at 20
      })
    );
  });

  it('handles errors thrown by streamText and returns 500', async () => {
    mockStreamText.mockRejectedValue(new Error('Groq rate limited'));

    const req = new Request('http://localhost:3000/api/summarize-reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mediaTitle: 'Inception',
        reviews: ['Terrific acting.'],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Groq rate limited');
  });
});
