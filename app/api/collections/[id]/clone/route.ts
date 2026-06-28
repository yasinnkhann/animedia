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

    // Fetch the original collection
    const originalCollection = await prisma.collection.findUnique({
      where: { id },
      include: {
        items: true,
        collaborators: true,
      },
    });

    if (!originalCollection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Check permissions: Must be public OR the user must be owner/collaborator
    const isOwner = session.user!.id === originalCollection.userId;
    const isCollaborator = originalCollection.collaborators.some(c => c.id === session.user!.id);
    
    if (!originalCollection.isPublic && !isOwner && !isCollaborator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create the cloned collection
    const clonedCollection = await prisma.collection.create({
      data: {
        userId: session.user!.id,
        name: `${originalCollection.name} (Clone)`,
        description: originalCollection.description,
        isPublic: true, // Default clones to public
      },
    });

    // Bulk insert the items
    if (originalCollection.items.length > 0) {
      const itemsToCreate = originalCollection.items.map(item => ({
        collectionId: clonedCollection.id,
        mediaType: item.mediaType,
        mediaId: item.mediaId,
        mediaTitle: item.mediaTitle,
        mediaImage: item.mediaImage,
        watched: false, // Reset watched status for the new owner
      }));

      await prisma.collectionItem.createMany({
        data: itemsToCreate,
      });
    }

    return NextResponse.json({ success: true, collectionId: clonedCollection.id });
  } catch (error) {
    console.error('Error cloning collection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
