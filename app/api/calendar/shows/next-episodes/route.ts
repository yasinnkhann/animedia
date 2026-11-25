import { NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/api';

export const runtime = 'nodejs';
export const revalidate = 1800; // Cache 30 mins

interface NextEpisodeInfo {
  airDate: string;
  seasonNumber: number;
  episodeNumber: number;
  episodeName?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const showIds: string[] = Array.isArray(body?.showIds) ? body.showIds.slice(0, 50) : [];

    if (showIds.length === 0) {
      return NextResponse.json({ episodes: {} });
    }

    const todayString = new Date().toISOString().split('T')[0];

    const results = await Promise.allSettled(
      showIds.map(async id => {
        try {
          const details = await tmdbClient.getShowDetails(id);
          const nextEp = details?.next_episode_to_air;
          if (nextEp && nextEp.air_date && nextEp.air_date >= todayString) {
            return {
              id: String(id),
              info: {
                airDate: nextEp.air_date,
                seasonNumber: nextEp.season_number,
                episodeNumber: nextEp.episode_number,
                episodeName: nextEp.name || undefined,
              } as NextEpisodeInfo,
            };
          }
        } catch (err) {
          console.error(`Error fetching next episode for show ${id}:`, err);
        }
        return { id: String(id), info: null };
      })
    );

    const episodes: Record<string, NextEpisodeInfo | null> = {};
    results.forEach(res => {
      if (res.status === 'fulfilled' && res.value) {
        episodes[res.value.id] = res.value.info;
      }
    });

    return NextResponse.json({ episodes });
  } catch (error) {
    console.error('Error in /api/calendar/shows/next-episodes:', error);
    return NextResponse.json(
      { episodes: {}, error: 'Failed to fetch episode dates' },
      { status: 500 }
    );
  }
}
