import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id: collectionId, itemId } = resolvedParams;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: { collaborators: { select: { id: true } } },
    });

    if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isOwner = collection.userId === session.user?.id;
    const isCollaborator = collection.collaborators.some((c: any) => c.id === session.user?.id);

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { watched } = await req.json();

    if (watched === undefined) {
      return NextResponse.json({ error: 'Missing watched field' }, { status: 400 });
    }

    const item = await prisma.collectionItem.update({
      where: { id: itemId },
      data: { watched },
    });

    return NextResponse.json({ item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
