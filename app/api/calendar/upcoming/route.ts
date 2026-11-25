import { NextResponse } from 'next/server';
import { tmdbClient, igdbClient } from '@/lib/api';

export const runtime = 'nodejs';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const [upcomingMoviesRes, onTheAirShowsRes, upcomingGamesRes] = await Promise.allSettled([
      tmdbClient.getUpcomingMovies(1),
      tmdbClient.getOnTheAirShows(1),
      igdbClient.getUpcomingGames(30, 1),
    ]);

    const movies =
      upcomingMoviesRes.status === 'fulfilled' && upcomingMoviesRes.value?.results
        ? upcomingMoviesRes.value.results
            .filter((m: any) => m.release_date)
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

    const shows =
      onTheAirShowsRes.status === 'fulfilled' && onTheAirShowsRes.value?.results
        ? onTheAirShowsRes.value.results
            .filter((s: any) => s.first_air_date)
            .map((s: any) => ({
              id: String(s.id),
              name: s.name,
              releaseDate: s.first_air_date,
              image: s.poster_path,
              overview: s.overview || '',
              rating: s.vote_average ? Math.round(s.vote_average * 10) / 10 : null,
              mediaType: 'SHOW' as const,
            }))
        : [];

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
