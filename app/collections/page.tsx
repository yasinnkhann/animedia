import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import CollectionsClient from './CollectionsClient';
import PageAnimationWrapper from '@/components/PageAnimationWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Collections | AniMedia',
  description: 'Manage your custom media collections.',
};

export default async function CollectionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-lg font-semibold'>Please log in to view your collections.</p>
      </div>
    );
  }

  const collections = await prisma.collection.findMany({
    where: {
      OR: [{ userId: session.user.id }, { collaborators: { some: { id: session.user.id } } }],
    },
    include: {
      _count: {
        select: { items: true },
      },
      items: {
        take: 4,
        orderBy: { addedAt: 'desc' },
      },
      user: { select: { name: true, image: true } },
      collaborators: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <PageAnimationWrapper className='mt-[calc(var(--header-height-mobile)+1rem)] px-4 pb-32 md:px-16'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-4xl font-extrabold tracking-tight text-foreground'>
              My Collections
            </h1>
            <p className='mt-2 text-muted-foreground'>
              Curate your favorite movies, shows, and games into shareable lists.
            </p>
          </div>
        </div>

        <CollectionsClient initialCollections={collections} currentUserId={session.user.id} />
      </div>
    </PageAnimationWrapper>
  );
}
