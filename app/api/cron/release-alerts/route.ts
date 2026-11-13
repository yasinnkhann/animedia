import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NotificationType, MediaType, WatchStatus, GameStatus } from '@prisma/client';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: Request) {
  // Protect the route so only Vercel Cron can call it
  const authHeader = req.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const today = new Date();
    // Use UTC date for string matching since APIs like TMDB return 'YYYY-MM-DD'
    const todayString = today.toISOString().split('T')[0];
    const startOfDay = new Date(`${todayString}T00:00:00.000Z`);

    // Fetch planned media in parallel
    const [movies, shows, games, existingTodayAlerts] = await Promise.all([
      prisma.movie.findMany({
        where: { status: WatchStatus.PLAN_TO_WATCH, release_date: { not: null } },
      }),
      prisma.show.findMany({
        where: { status: WatchStatus.PLAN_TO_WATCH, release_date: { not: null } },
      }),
      prisma.game.findMany({
        where: { status: GameStatus.PLAN_TO_PLAY, release_date: { not: null } },
      }),
      prisma.notification.findMany({
        where: {
          type: NotificationType.RELEASE_ALERT,
          createdAt: { gte: startOfDay },
        },
        select: { userId: true, mediaId: true, mediaType: true },
      }),
    ]);

    // Track existing alerts created today to prevent duplicate spam
    const existingAlertKeys = new Set(
      existingTodayAlerts.map(a => `${a.userId}-${a.mediaType}-${a.mediaId}`)
    );

    const notificationsToCreate: Array<{
      userId: string;
      type: NotificationType;
      mediaType: MediaType;
      mediaId: string;
      mediaTitle: string;
      mediaImage: string | null;
      message: string;
    }> = [];

    // Helper to check if item releases today
    const checkReleasesToday = (items: any[], type: MediaType) => {
      for (const item of items) {
        if (!item.release_date) continue;

        let isToday = false;
        // Basic substring match for 'YYYY-MM-DD' formats
        if (item.release_date.startsWith(todayString)) {
          isToday = true;
        } else {
          // Attempt parsing if it's a different string format
          const date = new Date(item.release_date);
          if (!isNaN(date.getTime()) && date.toISOString().split('T')[0] === todayString) {
            isToday = true;
          }
        }

        if (isToday) {
          const key = `${item.userId}-${type}-${item.id}`;
          if (!existingAlertKeys.has(key)) {
            existingAlertKeys.add(key); // Prevent duplicate entries within the same run
            notificationsToCreate.push({
              userId: item.userId,
              type: NotificationType.RELEASE_ALERT,
              mediaType: type,
              mediaId: String(item.id),
              mediaTitle: item.name,
              mediaImage: item.image || null,
              message: `${item.name} releases today! Time to dive in.`,
            });
          }
        }
      }
    };

    checkReleasesToday(movies, MediaType.MOVIE);
    checkReleasesToday(shows, MediaType.SHOW);
    checkReleasesToday(games, MediaType.GAME);

    // Insert all deduped notifications
    let createdCount = 0;
    if (notificationsToCreate.length > 0) {
      const result = await prisma.notification.createMany({
        data: notificationsToCreate,
      });
      createdCount = result.count;
    }

    return NextResponse.json({ success: true, alertedCount: createdCount });
  } catch (error) {
    console.error('Error running release alerts cron:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
