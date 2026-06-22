import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isOwner = collection.userId === session.user.id;
    const isSelfAdd = userId === session.user.id;

    if (!isOwner && !isSelfAdd) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updated = await prisma.collection.update({
      where: { id },
      data: {
        collaborators: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json({ collection: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isOwner = collection.userId === session.user.id;
    const isSelfRemove = userId === session.user.id;

    if (!isOwner && !isSelfRemove) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updated = await prisma.collection.update({
      where: { id },
      data: {
        collaborators: {
          disconnect: { id: userId },
        },
      },
    });

    return NextResponse.json({ collection: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
