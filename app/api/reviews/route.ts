import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { MediaType } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaType = searchParams.get('mediaType');
    const mediaId = searchParams.get('mediaId');
    const userId = searchParams.get('userId');

    let whereClause: any = {};
    if (mediaType && mediaId) {
      whereClause = { mediaType: mediaType as MediaType, mediaId };
    } else if (userId) {
      whereClause = { userId };
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { mediaType, mediaId, mediaTitle, mediaImage, content, rating } = body;

    if (!mediaType || !mediaId || !mediaTitle || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure a user only leaves 1 review per item
    const existingReview = await prisma.review.findFirst({
      where: { userId: session.user.id, mediaType, mediaId },
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this item' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        mediaType,
        mediaId: String(mediaId),
        mediaTitle,
        mediaImage,
        content,
        rating: typeof rating === 'number' ? rating : null,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
