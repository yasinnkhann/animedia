import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MediaCard from '@/components/MediaCard/MediaCard';

const mockUseUserMedia = vi.fn();

vi.mock('@/components/UserMediaProvider', () => ({
  useUserMedia: () => mockUseUserMedia(),
}));

describe('MediaCard Component - Automatic User Status & Badges', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserMedia.mockReturnValue({
      userMovies: [],
      userShows: [],
      userGames: [],
    });
  });

  const sampleGame = {
    id: 732,
    name: 'Grand Theft Auto: San Andreas',
    first_release_date: 1098748800,
    coverUrl: '//images.igdb.com/igdb/image/upload/t_1080p/co2lb9.jpg',
  };

  it('renders media card with title', () => {
    render(<MediaCard item={sampleGame} mediaType='GAME' />);
    expect(screen.getByText('Grand Theft Auto: San Andreas')).toBeInTheDocument();
    expect(screen.queryByText('PW')).not.toBeInTheDocument();
  });

  it('automatically resolves and renders square status badge and rating badge from userGames', () => {
    mockUseUserMedia.mockReturnValue({
      userMovies: [],
      userShows: [],
      userGames: [
        {
          id: '732',
          name: 'Grand Theft Auto: San Andreas',
          status: 'PLAN_TO_PLAY',
          rating: 10,
          rewatch_count: 0,
          notes: null,
        },
      ],
    });

    render(<MediaCard item={sampleGame} mediaType='GAME' />);

    // Square badge with "PW"
    const statusBadge = screen.getByText('PW');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge.className).toContain('bg-blue-500');

    // Rating badge with ★ 10
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('★')).toBeInTheDocument();
  });

  it('renders rewatch/replay counter and notes badges when present in userGames', () => {
    mockUseUserMedia.mockReturnValue({
      userMovies: [],
      userShows: [],
      userGames: [
        {
          id: '732',
          name: 'Grand Theft Auto: San Andreas',
          status: 'PLAYING',
          rating: 9,
          rewatch_count: 2,
          notes: 'Best GTA game ever!',
        },
      ],
    });

    render(<MediaCard item={sampleGame} mediaType='GAME' />);

    // Playing badge "W" in green
    const statusBadge = screen.getByText('W');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge.className).toContain('bg-green-500');

    // Replay badge "Rewatch #2"
    expect(screen.getByText('Rewatch #2')).toBeInTheDocument();

    // Notes badge
    expect(screen.getByTitle('Has private personal note')).toBeInTheDocument();
  });

  it('explicit userStatus prop overrides context lookup', () => {
    mockUseUserMedia.mockReturnValue({
      userMovies: [],
      userShows: [],
      userGames: [
        {
          id: '732',
          name: 'Grand Theft Auto: San Andreas',
          status: 'PLAN_TO_PLAY',
        },
      ],
    });

    render(<MediaCard item={sampleGame} mediaType='GAME' userStatus='C' />);

    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.queryByText('PW')).not.toBeInTheDocument();
  });

  it('does not render status badge when onRemove is passed', () => {
    mockUseUserMedia.mockReturnValue({
      userMovies: [],
      userShows: [],
      userGames: [
        {
          id: '732',
          name: 'Grand Theft Auto: San Andreas',
          status: 'PLAN_TO_PLAY',
        },
      ],
    });

    render(<MediaCard item={sampleGame} mediaType='GAME' onRemove={() => {}} />);

    expect(screen.queryByText('PW')).not.toBeInTheDocument();
    expect(screen.getByTitle('Remove from library')).toBeInTheDocument();
  });
});
