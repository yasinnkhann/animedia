import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NotificationType, MediaType, WatchStatus } from '@prisma/client';

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

    // Find all movies and shows in PLAN_TO_WATCH
    const movies = await prisma.movie.findMany({
      where: { status: WatchStatus.PLAN_TO_WATCH, release_date: { not: null } },
    });

    const shows = await prisma.show.findMany({
      where: { status: WatchStatus.PLAN_TO_WATCH, release_date: { not: null } },
    });

    const games = await prisma.game.findMany({
      where: { wishlist: true, release_date: { not: null } },
    });

    const notificationsToCreate: any[] = [];

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
          notificationsToCreate.push({
            userId: item.userId,
            type: NotificationType.RELEASE_ALERT,
            mediaType: type,
            mediaId: item.id,
            mediaTitle: item.name,
            mediaImage: item.image,
            message: `${item.name} releases today! Time to dive in.`,
          });
        }
      }
    };

    checkReleasesToday(movies, MediaType.MOVIE);
    checkReleasesToday(shows, MediaType.SHOW);
    checkReleasesToday(games, MediaType.GAME);

    // Insert all notifications
    let createdCount = 0;
    if (notificationsToCreate.length > 0) {
      const result = await prisma.notification.createMany({
        data: notificationsToCreate,
        skipDuplicates: true, // Prevent duplicate notifications if run twice
      });
      createdCount = result.count;
    }

    return NextResponse.json({ success: true, alertedCount: createdCount });
  } catch (error) {
    console.error('Error running release alerts cron:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
