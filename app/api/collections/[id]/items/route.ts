import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { MediaType } from '@prisma/client';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id: collectionId } = resolvedParams;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection || collection.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { mediaType, mediaId, mediaTitle, mediaImage } = await req.json();

    if (!mediaType || !mediaId || !mediaTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const item = await prisma.collectionItem.create({
      data: {
        collectionId,
        mediaType: mediaType as MediaType,
        mediaId,
        mediaTitle,
        mediaImage,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Item already in collection' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id: collectionId } = resolvedParams;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection || collection.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const mediaType = searchParams.get('mediaType');
    const mediaId = searchParams.get('mediaId');

    if (!mediaType || !mediaId) {
      return NextResponse.json({ error: 'Missing mediaType or mediaId' }, { status: 400 });
    }

    await prisma.collectionItem.delete({
      where: {
        collectionId_mediaType_mediaId: {
          collectionId,
          mediaType: mediaType as MediaType,
          mediaId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
