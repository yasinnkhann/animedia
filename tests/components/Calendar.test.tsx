import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  getReleaseCountdown,
  formatFriendlyDate,
  groupReleasesByTimeline,
  parseLocalDate,
} from '@/components/Calendar/calendarUtils';
import ReleaseCard from '@/components/Calendar/ReleaseCard';
import CalendarTimelineView from '@/components/Calendar/CalendarTimelineView';
import { CalendarReleaseItem } from '@/components/Calendar/types';

vi.mock('@/components/UserMediaProvider', () => ({
  useUserMedia: () => ({
    userMovies: [],
    userShows: [],
    userGames: [],
    refetchUserMedia: vi.fn(),
  }),
}));

vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: 'test-user-123', name: 'Test User' } },
    status: 'authenticated',
  }),
}));

describe('Calendar Utilities', () => {
  it('parses local dates safely across timezones', () => {
    const d = parseLocalDate('2026-12-25');
    expect(d).not.toBeNull();
    expect(d?.getUTCFullYear()).toBe(2026);
    expect(d?.getUTCMonth()).toBe(11); // December is index 11
    expect(d?.getUTCDate()).toBe(25);
  });

  it('calculates countdown accurately', () => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Today
    const todayCountdown = getReleaseCountdown(todayStr);
    expect(todayCountdown.category).toBe('today');
    expect(todayCountdown.label).toContain('Today');

    // Tomorrow
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const tomorrowCountdown = getReleaseCountdown(tomorrowStr);
    expect(tomorrowCountdown.category).toBe('tomorrow');
    expect(tomorrowCountdown.label).toBe('Tomorrow');

    // In 4 days
    const fourDays = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
    const fourDaysStr = fourDays.toISOString().split('T')[0];
    const fourDaysCountdown = getReleaseCountdown(fourDaysStr);
    expect(fourDaysCountdown.category).toBe('this_week');
    expect(fourDaysCountdown.label).toContain('days');

    // Past
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const pastCountdown = getReleaseCountdown(yesterdayStr);
    expect(pastCountdown.category).toBe('past');
    expect(pastCountdown.label).toContain('Released');
  });

  it('formats friendly date correctly', () => {
    expect(formatFriendlyDate('2026-10-15')).toContain('Oct 15, 2026');
    expect(formatFriendlyDate(null)).toBe('TBA');
  });

  it('groups items into chronological timeline buckets', () => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const nextWeek = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const nextMonth = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const items: CalendarReleaseItem[] = [
      { id: '1', name: 'Game Today', releaseDate: todayStr, mediaType: 'GAME' },
      { id: '2', name: 'Movie Next Week', releaseDate: nextWeek, mediaType: 'MOVIE' },
      { id: '3', name: 'Show Next Month', releaseDate: nextMonth, mediaType: 'SHOW' },
    ];

    const groups = groupReleasesByTimeline(items);
    expect(groups.length).toBeGreaterThanOrEqual(2);
    expect(groups.some(g => g.id === 'today')).toBe(true);
    expect(groups.some(g => g.id === 'this_week')).toBe(true);
  });
});

describe('ReleaseCard Component', () => {
  const sampleGame: CalendarReleaseItem = {
    id: '12345',
    name: 'Grand Theft Auto VI',
    releaseDate: '2026-11-20',
    mediaType: 'GAME',
    image: 'https://images.igdb.com/igdb/image/upload/t_1080p/co2lb9.jpg',
    rating: 9.8,
    platforms: ['PS5', 'Xbox Series X'],
    isTracked: true,
  };

  it('renders game title, platforms, and tracked status', () => {
    render(<ReleaseCard item={sampleGame} />);

    expect(screen.getByText('Grand Theft Auto VI')).toBeInTheDocument();
    expect(screen.getByText('Game')).toBeInTheDocument();
    expect(screen.getByText('PS5')).toBeInTheDocument();
    expect(screen.getByText('Xbox Series X')).toBeInTheDocument();
    expect(screen.getByText(/In Watchlist/i)).toBeInTheDocument();
  });

  it('renders quick add button when untracked', () => {
    const untrackedMovie: CalendarReleaseItem = {
      id: '999',
      name: 'Avengers: Secret Wars',
      releaseDate: '2027-05-01',
      mediaType: 'MOVIE',
      isTracked: false,
    };

    render(<ReleaseCard item={untrackedMovie} />);

    expect(screen.getByText('Avengers: Secret Wars')).toBeInTheDocument();
    expect(screen.getByText(/Add to Plan to Watch/i)).toBeInTheDocument();
  });
});

describe('CalendarTimelineView Component', () => {
  it('renders empty state when no items exist', () => {
    const onExplore = vi.fn();
    render(<CalendarTimelineView items={[]} scope='my' onExploreClick={onExplore} />);

    expect(screen.getByText('No Upcoming Releases')).toBeInTheDocument();
    const exploreBtn = screen.getByRole('button', { name: /Explore Global Releases/i });
    expect(exploreBtn).toBeInTheDocument();

    fireEvent.click(exploreBtn);
    expect(onExplore).toHaveBeenCalled();
  });
});
