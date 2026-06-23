import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const activity = await prisma.activity.findUnique({
      where: { id },
      select: { userId: true, mediaTitle: true, type: true, mediaId: true, mediaType: true },
    });

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    const existingLike = await prisma.activityLike.findUnique({
      where: {
        activityId_userId: {
          activityId: id,
          userId: session.user.id,
        },
      },
    });

    if (existingLike) {
      await prisma.activityLike.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.activityLike.create({
        data: {
          activityId: id,
          userId: session.user.id,
        },
      });

      // Send notification if not liking own activity
      if (activity.userId !== session.user.id) {
        await prisma.notification.create({
          data: {
            userId: activity.userId,
            senderId: session.user.id,
            type: 'ACTIVITY_LIKE',
            mediaId: activity.mediaId,
            mediaType: activity.mediaType,
            mediaTitle: activity.mediaTitle,
          },
        });
      }

      return NextResponse.json({ liked: true });
    }
  } catch (error: any) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
