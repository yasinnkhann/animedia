import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getCalendarIcs } from '@/app/api/calendar/[userId]/route';
import { GET as getUpcomingReleases } from '@/app/api/calendar/upcoming/route';

const {
  mockPrismaUser,
  mockPrismaMovie,
  mockPrismaShow,
  mockPrismaGame,
  mockGetUpcomingMovies,
  mockGetOnTheAirShows,
  mockGetUpcomingGames,
} = vi.hoisted(() => ({
  mockPrismaUser: {
    findUnique: vi.fn(),
  },
  mockPrismaMovie: {
    findMany: vi.fn(),
  },
  mockPrismaShow: {
    findMany: vi.fn(),
  },
  mockPrismaGame: {
    findMany: vi.fn(),
  },
  mockGetUpcomingMovies: vi.fn(),
  mockGetOnTheAirShows: vi.fn(),
  mockGetUpcomingGames: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: mockPrismaUser,
    movie: mockPrismaMovie,
    show: mockPrismaShow,
    game: mockPrismaGame,
  },
}));

vi.mock('@/lib/api', () => ({
  tmdbClient: {
    getUpcomingMovies: (...args: any[]) => mockGetUpcomingMovies(...args),
    getOnTheAirShows: (...args: any[]) => mockGetOnTheAirShows(...args),
  },
  igdbClient: {
    getUpcomingGames: (...args: any[]) => mockGetUpcomingGames(...args),
  },
}));

describe('GET /api/calendar/[userId] (.ics feed)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 if user not found', async () => {
    mockPrismaUser.findUnique.mockResolvedValue(null);

    const res = await getCalendarIcs(new Request('http://localhost:3000/api/calendar/user-123'), {
      params: Promise.resolve({ userId: 'user-123' }),
    });

    expect(res.status).toBe(404);
  });

  it('generates valid RFC 5545 iCalendar content with events', async () => {
    mockPrismaUser.findUnique.mockResolvedValue({ id: 'user-123', name: 'Yasin' });
    mockPrismaMovie.findMany.mockResolvedValue([
      { id: '101', name: 'Dune: Part Three', release_date: '2026-12-18' },
    ]);
    mockPrismaShow.findMany.mockResolvedValue([
      { id: '202', name: 'Stranger Things S5', release_date: '2026-11-30' },
    ]);
    mockPrismaGame.findMany.mockResolvedValue([
      { id: '303', name: 'GTA VI', release_date: '2026-10-25' },
    ]);

    const res = await getCalendarIcs(new Request('http://localhost:3000/api/calendar/user-123'), {
      params: Promise.resolve({ userId: 'user-123' }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/calendar');

    const icsText = await res.text();
    expect(icsText).toContain('BEGIN:VCALENDAR');
    expect(icsText).toContain('END:VCALENDAR');
    expect(icsText).toContain('SUMMARY:Dune: Part Three (Movie Release)');
    expect(icsText).toContain('SUMMARY:Stranger Things S5 (TV Show Release)');
    expect(icsText).toContain('SUMMARY:GTA VI (Game Release)');
    expect(icsText).toContain('DTSTART;VALUE=DATE:20261218');
    expect(icsText).toContain('DTSTART;VALUE=DATE:20261130');
    expect(icsText).toContain('DTSTART;VALUE=DATE:20261025');
  });
});

describe('GET /api/calendar/upcoming', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('aggregates and formats upcoming movies, shows, and games', async () => {
    mockGetUpcomingMovies.mockResolvedValue({
      results: [{ id: 1, title: 'Upcoming Movie', release_date: '2026-12-01', vote_average: 8.2 }],
    });
    mockGetOnTheAirShows.mockResolvedValue({
      results: [{ id: 2, name: 'Airing Show', first_air_date: '2026-11-28', vote_average: 7.9 }],
    });
    mockGetUpcomingGames.mockResolvedValue({
      results: [
        {
          id: 3,
          name: 'Upcoming Game',
          first_release_date: 1795000000,
          platforms: [{ name: 'PC' }],
          rating: 85,
        },
      ],
    });

    const res = await getUpcomingReleases();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.movies).toHaveLength(1);
    expect(data.movies[0].name).toBe('Upcoming Movie');
    expect(data.shows).toHaveLength(1);
    expect(data.shows[0].name).toBe('Airing Show');
    expect(data.games).toHaveLength(1);
    expect(data.games[0].name).toBe('Upcoming Game');
    expect(data.games[0].platforms).toContain('PC');
  });
});
