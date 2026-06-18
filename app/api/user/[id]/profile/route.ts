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

    const [userMovies, userShows, userGames] = await Promise.all([
      prisma.movie.findMany({ where: { userId: targetUserId } }),
      prisma.show.findMany({ where: { userId: targetUserId } }),
      prisma.game.findMany({ where: { userId: targetUserId } }),
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

    return NextResponse.json({
      user,
      media: {
        userMovies,
        userShows,
        userGames,
      },
      isFollowing,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
