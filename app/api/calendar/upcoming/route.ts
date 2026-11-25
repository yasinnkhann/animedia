import { NextResponse } from 'next/server';
import { tmdbClient, igdbClient } from '@/lib/api';

export const runtime = 'nodejs';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const todayString = new Date().toISOString().split('T')[0];

    const [upcomingMoviesRes, newShowsRes, onTheAirShowsRes, upcomingGamesRes] =
      await Promise.allSettled([
        tmdbClient.getUpcomingMovies(1),
        tmdbClient.getUpcomingNewShows(1),
        tmdbClient.getOnTheAirShows(1),
        igdbClient.getUpcomingGames(30, 1),
      ]);

    const movies =
      upcomingMoviesRes.status === 'fulfilled' && upcomingMoviesRes.value?.results
        ? upcomingMoviesRes.value.results
            .filter((m: any) => m.release_date && m.release_date >= todayString)
            .map((m: any) => ({
              id: String(m.id),
              name: m.title || m.name,
              releaseDate: m.release_date,
              image: m.poster_path,
              overview: m.overview || '',
              rating: m.vote_average ? Math.round(m.vote_average * 10) / 10 : null,
              mediaType: 'MOVIE' as const,
            }))
        : [];

    // Combine brand-new upcoming shows + currently airing shows with next episode info
    const newShows =
      newShowsRes.status === 'fulfilled' && newShowsRes.value?.results
        ? newShowsRes.value.results
            .filter((s: any) => s.first_air_date && s.first_air_date >= todayString)
            .map((s: any) => ({
              id: String(s.id),
              name: s.name,
              releaseDate: s.first_air_date,
              image: s.poster_path,
              overview: s.overview || '',
              rating: s.vote_average ? Math.round(s.vote_average * 10) / 10 : null,
              mediaType: 'SHOW' as const,
              episodeInfo: {
                seasonNumber: 1,
                episodeNumber: 1,
                episodeName: 'Series Premiere',
              },
            }))
        : [];

    // For top on-the-air shows, get next episode info in parallel
    const onTheAirRaw =
      onTheAirShowsRes.status === 'fulfilled' && onTheAirShowsRes.value?.results
        ? onTheAirShowsRes.value.results.slice(0, 10)
        : [];

    const onTheAirDetails = await Promise.allSettled(
      onTheAirRaw.map((s: any) => tmdbClient.getShowDetails(s.id))
    );

    const ongoingShows: any[] = [];
    onTheAirDetails.forEach(res => {
      if (res.status === 'fulfilled' && res.value) {
        const details = res.value;
        const nextEp = details.next_episode_to_air;
        if (nextEp && nextEp.air_date && nextEp.air_date >= todayString) {
          ongoingShows.push({
            id: String(details.id),
            name: details.name,
            releaseDate: nextEp.air_date,
            image: details.poster_path,
            overview: nextEp.overview || details.overview || '',
            rating: details.vote_average ? Math.round(details.vote_average * 10) / 10 : null,
            mediaType: 'SHOW' as const,
            episodeInfo: {
              seasonNumber: nextEp.season_number,
              episodeNumber: nextEp.episode_number,
              episodeName: nextEp.name || undefined,
            },
          });
        }
      }
    });

    // Merge and deduplicate shows by ID
    const showMap = new Map<string, any>();
    [...ongoingShows, ...newShows].forEach(s => {
      if (!showMap.has(s.id)) showMap.set(s.id, s);
    });
    const shows = Array.from(showMap.values());

    const games =
      upcomingGamesRes.status === 'fulfilled' && upcomingGamesRes.value?.results
        ? upcomingGamesRes.value.results
            .filter((g: any) => g.first_release_date)
            .map((g: any) => {
              const dateStr = new Date(Number(g.first_release_date) * 1000)
                .toISOString()
                .split('T')[0];
              return {
                id: String(g.id),
                name: g.name,
                releaseDate: dateStr,
                image: g.coverUrl || g.cover?.url || null,
                overview: g.summary || '',
                rating: g.rating ? Math.round(g.rating / 10) : null,
                platforms: Array.isArray(g.platforms) ? g.platforms.map((p: any) => p.name) : [],
                mediaType: 'GAME' as const,
              };
            })
            .filter((g: any) => g.releaseDate >= todayString)
        : [];

    return NextResponse.json({
      movies,
      shows,
      games,
    });
  } catch (error) {
    console.error('Error in /api/calendar/upcoming:', error);
    return NextResponse.json(
      { movies: [], shows: [], games: [], error: 'Failed to fetch upcoming releases' },
      { status: 500 }
    );
  }
}
