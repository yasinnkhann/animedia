import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const comments = await prisma.activityComment.findMany({
      where: { activityId: id },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { content } = await req.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
    }

    const activity = await prisma.activity.findUnique({
      where: { id },
      select: { userId: true, mediaTitle: true, type: true, mediaId: true, mediaType: true },
    });

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    const comment = await prisma.activityComment.create({
      data: {
        content: content.trim(),
        activityId: id,
        userId: session.user.id,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    if (activity.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: activity.userId,
          senderId: session.user.id,
          type: 'ACTIVITY_COMMENT',
          mediaId: activity.mediaId,
          mediaType: activity.mediaType,
          mediaTitle: activity.mediaTitle,
          message: content.trim().substring(0, 50),
        },
      });
    }

    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
