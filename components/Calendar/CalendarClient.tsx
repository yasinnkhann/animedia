'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useUserMedia } from '@/components/UserMediaProvider';
import { CalendarReleaseItem, CalendarScope, CalendarViewMode, CalendarMediaFilter } from './types';
import CalendarTimelineView from './CalendarTimelineView';
import CalendarMonthView from './CalendarMonthView';
import CalendarSyncModal from './CalendarSyncModal';
import { TbSearch, TbCalendar, TbListTree } from 'react-icons/tb';
import { BsCalendarEvent, BsCalendarPlus } from 'react-icons/bs';
import { FaFilm, FaTv, FaGamepad } from 'react-icons/fa6';

export default function CalendarClient() {
  const { data: session } = useSession();
  const { userMovies, userShows, userGames, isLoading: isUserMediaLoading } = useUserMedia();

  const [scope, setScope] = useState<CalendarScope>('my');
  const [viewMode, setViewMode] = useState<CalendarViewMode>('timeline');
  const [mediaFilter, setMediaFilter] = useState<CalendarMediaFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Fetch upcoming releases for "Explore / All" mode
  const { data: upcomingData, isLoading: isUpcomingLoading } = useQuery<{
    movies: CalendarReleaseItem[];
    shows: CalendarReleaseItem[];
    games: CalendarReleaseItem[];
  }>({
    queryKey: ['calendarUpcoming'],
    queryFn: async () => {
      const res = await fetch('/api/calendar/upcoming');
      if (!res.ok) throw new Error('Failed to fetch upcoming releases');
      return res.json();
    },
    staleTime: 1000 * 60 * 30, // 30 min
    refetchOnWindowFocus: false,
  });

  // Tracked IDs set for instant lookup
  const trackedMovieIds = useMemo(() => new Set(userMovies.map(m => String(m.id))), [userMovies]);
  const trackedShowIds = useMemo(() => new Set(userShows.map(s => String(s.id))), [userShows]);
  const trackedGameIds = useMemo(() => new Set(userGames.map(g => String(g.id))), [userGames]);

  // My Planned Releases
  const myReleases = useMemo<CalendarReleaseItem[]>(() => {
    const list: CalendarReleaseItem[] = [];

    userMovies.forEach(m => {
      if (m.release_date && (m.status === 'PLAN_TO_WATCH' || m.status === 'WATCHING')) {
        list.push({
          id: String(m.id),
          name: m.name,
          releaseDate: m.release_date,
          image: m.image,
          mediaType: 'MOVIE',
          rating: m.rating,
          status: m.status,
          isTracked: true,
        });
      }
    });

    userShows.forEach(s => {
      if (s.release_date && (s.status === 'PLAN_TO_WATCH' || s.status === 'WATCHING')) {
        list.push({
          id: String(s.id),
          name: s.name,
          releaseDate: s.release_date,
          image: s.image,
          mediaType: 'SHOW',
          rating: s.rating,
          status: s.status,
          isTracked: true,
        });
      }
    });

    userGames.forEach(g => {
      if (g.release_date && (g.status === 'PLAN_TO_PLAY' || g.status === 'PLAYING')) {
        list.push({
          id: String(g.id),
          name: g.name,
          releaseDate: g.release_date,
          image: g.image,
          mediaType: 'GAME',
          rating: g.rating,
          status: g.status,
          isTracked: true,
        });
      }
    });

    return list;
  }, [userMovies, userShows, userGames]);

  // Global upcoming releases
  const globalReleases = useMemo<CalendarReleaseItem[]>(() => {
    if (!upcomingData) return [];
    const list: CalendarReleaseItem[] = [];

    (upcomingData.movies || []).forEach(m => {
      list.push({
        ...m,
        mediaType: 'MOVIE',
        isTracked: trackedMovieIds.has(String(m.id)),
      });
    });

    (upcomingData.shows || []).forEach(s => {
      list.push({
        ...s,
        mediaType: 'SHOW',
        isTracked: trackedShowIds.has(String(s.id)),
      });
    });

    (upcomingData.games || []).forEach(g => {
      list.push({
        ...g,
        mediaType: 'GAME',
        isTracked: trackedGameIds.has(String(g.id)),
      });
    });

    return list;
  }, [upcomingData, trackedMovieIds, trackedShowIds, trackedGameIds]);

  // Base list depending on scope
  const rawList = scope === 'my' ? myReleases : globalReleases;

  // Filter by media type and search query
  const filteredList = useMemo(() => {
    return rawList.filter(item => {
      if (mediaFilter !== 'ALL' && item.mediaType !== mediaFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return item.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [rawList, mediaFilter, searchQuery]);

  const isLoading = scope === 'my' ? isUserMediaLoading : isUpcomingLoading;

  return (
    <main className='min-h-screen px-4 pb-24 pt-8 sm:px-10 md:px-20 lg:px-40'>
      {/* Page Header */}
      <div className='flex flex-col gap-6 border-b border-border/50 pb-6 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
              <BsCalendarEvent size={20} />
            </div>
            <h1 className='text-3xl font-extrabold tracking-tight text-foreground'>
              Release Calendar
            </h1>
          </div>
          <p className='mt-2 text-sm text-muted-foreground'>
            Track upcoming movies, TV show premieres, and video game launch dates in one place.
          </p>
        </div>

        {/* Sync Button */}
        <button
          onClick={() => setIsSyncModalOpen(true)}
          className='text-primary-foreground flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold shadow-lg transition-all hover:bg-primary/90'
        >
          <BsCalendarPlus size={16} />
          <span>Sync to Calendar</span>
        </button>
      </div>

      {/* Controls Bar: Scope, Filter, View, Search */}
      <div className='mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        {/* Scope Tabs (My Schedule vs Explore Upcoming) */}
        <div className='flex self-start rounded-xl bg-muted/60 p-1'>
          <button
            onClick={() => setScope('my')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              scope === 'my'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            My Watchlist Schedule
            {myReleases.length > 0 && (
              <span className='ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary'>
                {myReleases.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setScope('all')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              scope === 'all'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Explore All Upcoming
          </button>
        </div>

        {/* View mode toggle (Timeline vs Month Grid) */}
        <div className='flex items-center gap-2 self-start sm:self-auto'>
          <div className='flex rounded-xl bg-muted/60 p-1'>
            <button
              onClick={() => setViewMode('timeline')}
              title='Timeline View'
              aria-label='Timeline View'
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TbListTree size={16} />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('month')}
              title='Month Grid View'
              aria-label='Month Grid View'
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'month'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TbCalendar size={16} />
              <span>Month Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Bar: Media type pills & Search filter */}
      <div className='mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        {/* Media Filter Pills */}
        <div className='flex flex-wrap items-center gap-2'>
          <button
            onClick={() => setMediaFilter('ALL')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              mediaFilter === 'ALL'
                ? 'text-primary-foreground bg-primary shadow-sm'
                : 'border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            All Media
          </button>
          <button
            onClick={() => setMediaFilter('MOVIE')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              mediaFilter === 'MOVIE'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <FaFilm size={12} />
            <span>Movies</span>
          </button>
          <button
            onClick={() => setMediaFilter('SHOW')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              mediaFilter === 'SHOW'
                ? 'bg-purple-500 text-white shadow-sm'
                : 'border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <FaTv size={12} />
            <span>TV Shows</span>
          </button>
          <button
            onClick={() => setMediaFilter('GAME')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              mediaFilter === 'GAME'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <FaGamepad size={12} />
            <span>Games</span>
          </button>
        </div>

        {/* Search Input */}
        <div className='relative w-full sm:w-64'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground'>
            <TbSearch size={16} />
          </div>
          <input
            type='text'
            placeholder='Search titles...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full rounded-full border border-border bg-card p-2 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className='mt-8'>
        {isLoading ? (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <div className='mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
            <p className='text-sm text-muted-foreground'>Loading releases...</p>
          </div>
        ) : viewMode === 'timeline' ? (
          <CalendarTimelineView
            items={filteredList}
            scope={scope}
            onExploreClick={() => setScope('all')}
          />
        ) : (
          <CalendarMonthView items={filteredList} />
        )}
      </div>

      {/* Sync Modal */}
      <CalendarSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        userId={session?.user?.id}
      />
    </main>
  );
}
