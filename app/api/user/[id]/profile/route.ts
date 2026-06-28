import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const loggedInUserId = session?.user?.id;
    const targetUserId = (await params).id;

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        created_at: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [userMovies, userShows, userGames, activities] = await Promise.all([
      prisma.movie.findMany({ where: { userId: targetUserId } }),
      prisma.show.findMany({ where: { userId: targetUserId } }),
      prisma.game.findMany({ where: { userId: targetUserId } }),
      prisma.activity.findMany({
        where: { userId: targetUserId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          likes: true,
          _count: {
            select: { comments: true },
          },
        },
      }),
    ]);

    let isFollowing = false;
    if (loggedInUserId) {
      const follow = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: loggedInUserId,
            followingId: targetUserId,
          },
        },
      });
      isFollowing = !!follow;
    }

    // Calculate Stats
    const completedMovies = userMovies.filter(m => m.status === 'COMPLETED').length;
    const completedShows = userShows.filter(s => s.status === 'COMPLETED').length;
    const completedGames = userGames.filter(g => !g.wishlist && g.rating !== null).length;
    const episodesWatched = userShows.reduce((acc, s) => acc + s.current_episode, 0);

    const ratedMedia = [...userMovies, ...userShows, ...userGames].filter(m => m.rating !== null);
    const avgRating =
      ratedMedia.length > 0
        ? (ratedMedia.reduce((a, b) => a + b.rating!, 0) / ratedMedia.length).toFixed(1)
        : 'N/A';

    const stats = {
      completedMovies,
      completedShows,
      completedGames,
      episodesWatched,
      avgRating,
    };

    return NextResponse.json({
      user,
      media: {
        userMovies,
        userShows,
        userGames,
      },
      stats,
      activities,
      isFollowing,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
