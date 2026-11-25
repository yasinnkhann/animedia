import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WatchStatus, GameStatus } from '@prisma/client';

export const runtime = 'nodejs';
export const revalidate = 3600; // Cache feed for 1 hour

function formatIcsDate(dateStr: string): string | null {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  } catch {
    return null;
  }
}

function getNextDay(dateStr: string): string | null {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    d.setUTCDate(d.getUTCDate() + 1);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  } catch {
    return null;
  }
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export async function GET(_request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    if (!userId) {
      return new NextResponse('User ID required', { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const [movies, shows, games] = await Promise.all([
      prisma.movie.findMany({
        where: {
          userId,
          status: WatchStatus.PLAN_TO_WATCH,
          release_date: { not: null },
        },
      }),
      prisma.show.findMany({
        where: {
          userId,
          status: WatchStatus.PLAN_TO_WATCH,
          release_date: { not: null },
        },
      }),
      prisma.game.findMany({
        where: {
          userId,
          status: GameStatus.PLAN_TO_PLAY,
          release_date: { not: null },
        },
      }),
    ]);

    const userName = user.name ? `${user.name}'s ` : '';
    const nowIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const events: string[] = [];

    const addEvent = (
      id: string,
      title: string,
      releaseDate: string,
      type: 'Movie' | 'TV Show' | 'Game',
      routePrefix: string
    ) => {
      const dtStart = formatIcsDate(releaseDate);
      const dtEnd = getNextDay(releaseDate);
      if (!dtStart || !dtEnd) return;

      const safeTitle = escapeIcsText(title);
      const url = `https://animedia.vercel.app/${routePrefix}/${id}`;

      events.push(
        [
          'BEGIN:VEVENT',
          `UID:animedia-${type.toLowerCase()}-${id}-${userId}@animedia.vercel.app`,
          `DTSTAMP:${nowIso}`,
          `DTSTART;VALUE=DATE:${dtStart}`,
          `DTEND;VALUE=DATE:${dtEnd}`,
          `SUMMARY:${safeTitle} (${type} Release)`,
          `DESCRIPTION:${safeTitle} releases today! Tracked on your AniMedia watchlist.\\n${url}`,
          `URL:${url}`,
          'STATUS:CONFIRMED',
          'TRANSP:TRANSPARENT',
          'END:VEVENT',
        ].join('\r\n')
      );
    };

    const todayString = new Date().toISOString().split('T')[0];
    const isUpcoming = (dateStr?: string | null) => {
      if (!dateStr) return false;
      return dateStr.split('T')[0] >= todayString;
    };

    movies.forEach(m => {
      if (m.release_date && isUpcoming(m.release_date)) {
        addEvent(m.id, m.name, m.release_date, 'Movie', 'movie');
      }
    });

    shows.forEach(s => {
      if (s.release_date && isUpcoming(s.release_date)) {
        addEvent(s.id, s.name, s.release_date, 'TV Show', 'show');
      }
    });

    games.forEach(g => {
      if (g.release_date && isUpcoming(g.release_date)) {
        addEvent(g.id, g.name, g.release_date, 'Game', 'game');
      }
    });

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AniMedia//Release Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${userName}AniMedia Releases`,
      'X-WR-TIMEZONE:UTC',
      `X-WR-CALDESC:Upcoming releases from ${userName}AniMedia watchlist and backlog.`,
      ...events,
      'END:VCALENDAR',
    ].join('\r\n');

    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'inline; filename="animedia-releases.ics"',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating calendar .ics feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
