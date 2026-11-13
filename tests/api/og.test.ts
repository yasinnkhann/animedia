import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/og/route';
import { NextRequest } from 'next/server';

describe('OpenGraph API Route (GET /api/og)', () => {
  it('generates a 200 image/png response for default request', async () => {
    const req = new NextRequest('http://localhost:3000/api/og');
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/png');
  });

  it('generates a 200 image/png response for Movie with backdrop, poster, rating, year, and genres', async () => {
    const url = new URL('http://localhost:3000/api/og');
    url.searchParams.set('type', 'MOVIE');
    url.searchParams.set('title', 'Inception');
    url.searchParams.set(
      'poster',
      'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg'
    );
    url.searchParams.set(
      'backdrop',
      'https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg'
    );
    url.searchParams.set('rating', '84');
    url.searchParams.set('userRating', '10');
    url.searchParams.set('rewatchCount', '2');
    url.searchParams.set('year', '2010');
    url.searchParams.set('genres', 'Action • Sci-Fi');
    url.searchParams.set('tagline', 'Your mind is the scene of the crime');

    const req = new NextRequest(url.toString());
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/png');
  });

  it('generates a 200 image/png response for TV Show', async () => {
    const url = new URL('http://localhost:3000/api/og');
    url.searchParams.set('type', 'SHOW');
    url.searchParams.set('title', 'Severance');
    url.searchParams.set('rating', '86');
    url.searchParams.set('year', '2022');
    url.searchParams.set('genres', 'Sci-Fi • Thriller');

    const req = new NextRequest(url.toString());
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/png');
  });

  it('generates a 200 image/png response for Game', async () => {
    const url = new URL('http://localhost:3000/api/og');
    url.searchParams.set('type', 'GAME');
    url.searchParams.set('title', 'Elden Ring');
    url.searchParams.set('rating', '95');
    url.searchParams.set('year', '2022');

    const req = new NextRequest(url.toString());
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/png');
  });

  it('generates a 200 image/png response for Profile Card with avatar and stats', async () => {
    const url = new URL('http://localhost:3000/api/og');
    url.searchParams.set('type', 'PROFILE');
    url.searchParams.set('title', 'Yasin');
    url.searchParams.set('avatar', 'https://avatars.githubusercontent.com/u/1?v=4');
    url.searchParams.set('movies', '142');
    url.searchParams.set('shows', '38');
    url.searchParams.set('games', '55');

    const req = new NextRequest(url.toString());
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/png');
  });

  it('generates a 200 image/png response for Collection Card', async () => {
    const url = new URL('http://localhost:3000/api/og');
    url.searchParams.set('type', 'COLLECTION');
    url.searchParams.set('title', 'Cyberpunk & Dystopia');
    url.searchParams.set('curator', 'Yasin');
    url.searchParams.set('itemCount', '15');

    const req = new NextRequest(url.toString());
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/png');
  });

  it('handles extremely long title gracefully with truncation', async () => {
    const longTitle = 'A'.repeat(120);
    const url = new URL(`http://localhost:3000/api/og?title=${encodeURIComponent(longTitle)}`);

    const req = new NextRequest(url.toString());
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/png');
  });
});
