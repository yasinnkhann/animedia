import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getCalendarIcs } from '@/app/api/calendar/[userId]/route';
import { GET as getUpcomingReleases } from '@/app/api/calendar/upcoming/route';
import { POST as getNextEpisodes } from '@/app/api/calendar/shows/next-episodes/route';

const {
  mockPrismaUser,
  mockPrismaMovie,
  mockPrismaShow,
  mockPrismaGame,
  mockGetUpcomingMovies,
  mockGetOnTheAirShows,
  mockGetUpcomingNewShows,
  mockGetShowDetails,
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
  mockGetUpcomingNewShows: vi.fn(),
  mockGetShowDetails: vi.fn(),
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
    getUpcomingNewShows: (...args: any[]) => mockGetUpcomingNewShows(...args),
    getShowDetails: (...args: any[]) => mockGetShowDetails(...args),
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
      { id: '101', name: 'Dune: Part Three', release_date: '2028-12-18' },
    ]);
    mockPrismaShow.findMany.mockResolvedValue([
      { id: '202', name: 'Stranger Things S5', release_date: '2028-11-30' },
    ]);
    mockPrismaGame.findMany.mockResolvedValue([
      { id: '303', name: 'GTA VI', release_date: '2028-10-25' },
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
    expect(icsText).toContain('DTSTART;VALUE=DATE:20281218');
    expect(icsText).toContain('DTSTART;VALUE=DATE:20281130');
    expect(icsText).toContain('DTSTART;VALUE=DATE:20281025');
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
          first_release_date: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days from now
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
    expect(data.games).toHaveLength(1);
    expect(data.games[0].name).toBe('Upcoming Game');
  });
});

describe('POST /api/calendar/shows/next-episodes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns next episode air dates for ongoing shows', async () => {
    mockGetShowDetails.mockResolvedValue({
      id: 103540,
      name: 'Percy Jackson and the Olympians',
      next_episode_to_air: {
        air_date: '2028-11-27',
        season_number: 3,
        episode_number: 3,
        name: 'I Learn How to Grow Zombies',
      },
    });

    const req = new Request('http://localhost:3000/api/calendar/shows/next-episodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showIds: ['103540'] }),
    });

    const res = await getNextEpisodes(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.episodes['103540']).toBeDefined();
    expect(data.episodes['103540'].airDate).toBe('2028-11-27');
    expect(data.episodes['103540'].seasonNumber).toBe(3);
    expect(data.episodes['103540'].episodeNumber).toBe(3);
  });
});
