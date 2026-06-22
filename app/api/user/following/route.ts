import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const following = await prisma.follows.findMany({
      where: { followerId: session.user.id },
      include: {
        following: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { following: { name: 'asc' } },
    });

    const friends = following.map(f => f.following);

    return NextResponse.json(friends);
  } catch (error) {
    console.error('Error fetching following users:', error);
    return NextResponse.json({ error: 'Failed to fetch following users' }, { status: 500 });
  }
}
