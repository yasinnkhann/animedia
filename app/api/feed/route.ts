import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Get users the current user is following
    const follows = await prisma.follows.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true },
    });

    const followingIds = follows.map(f => f.followingId).filter(id => id !== session?.user?.id);

    const activities = await prisma.activity.findMany({
      where: {
        userId: { in: followingIds },
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
