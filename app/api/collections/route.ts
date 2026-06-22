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
    const userId = searchParams.get('userId');

    // If querying for a specific user's collections, ensure we only return public ones unless it's the current user
    const queryUserId = userId || session.user.id;
    const isOwner = queryUserId === session.user.id;

    const collections = await prisma.collection.findMany({
      where: isOwner
        ? {
            OR: [{ userId: queryUserId }, { collaborators: { some: { id: queryUserId } } }],
          }
        : {
            userId: queryUserId,
            isPublic: true,
          },
      include: {
        _count: {
          select: { items: true },
        },
        items: {
          take: 4,
          orderBy: { addedAt: 'desc' },
        },
        collaborators: {
          select: { id: true, name: true, image: true },
        },
        user: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ collections });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, isPublic } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        description: description?.trim(),
        isPublic: isPublic ?? true,
      },
    });

    return NextResponse.json({ collection }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
