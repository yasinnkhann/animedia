import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { BiGlobe, BiLockAlt, BiUser, BiCollection } from 'react-icons/bi';
import PageAnimationWrapper from '@/components/PageAnimationWrapper';
import RemoveItemButton from '@/components/Collections/RemoveItemButton';
import InviteCollaboratorsButton from '@/components/Collections/InviteCollaboratorsButton';
import ToggleWatchedButton from '@/components/Collections/ToggleWatchedButton';
import CloneCollectionButton from '@/components/Collections/CloneCollectionButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      items: { take: 1, orderBy: { addedAt: 'desc' } }, // Use latest item for poster
    },
  });

  if (!collection || !collection.isPublic) {
    return { title: 'Collection Not Found | AniMedia' };
  }

  const title = `${collection.name} by ${collection.user.name || 'User'} | AniMedia`;
  const description =
    collection.description || `Check out this curated media collection on AniMedia.`;
  const posterUrl = collection.items[0]?.mediaImage || '';

  const ogUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/og`);
  ogUrl.searchParams.set('title', collection.name);
  if (posterUrl) ogUrl.searchParams.set('poster', posterUrl);
  ogUrl.searchParams.set('type', 'COLLECTION');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, image: true } },
      collaborators: { select: { id: true, name: true, image: true } },
      items: { orderBy: { addedAt: 'desc' } },
    },
  });

  const session = await getServerSession(authOptions);
  const isOwner = !!(session?.user?.id && session.user.id === collection?.userId);
  const isCollaborator = !!(
    session?.user?.id && collection?.collaborators.some(c => c.id === session?.user?.id)
  );

  if (!collection) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-lg font-semibold text-red-500'>Collection not found.</p>
      </div>
    );
  }

  if (!collection.isPublic && !isOwner && !isCollaborator) {
    return (
      <div className='flex h-screen flex-col items-center justify-center gap-4'>
        <BiLockAlt size={64} className='text-slate-500' />
        <h1 className='text-2xl font-bold'>Private Collection</h1>
        <p className='text-muted-foreground'>This collection is private and cannot be viewed.</p>
      </div>
    );
  }

  return (
    <PageAnimationWrapper className='mt-[calc(var(--header-height-mobile)+1rem)] px-4 pb-32 md:px-16'>
      <div className='mx-auto max-w-6xl'>
        {/* Header Section */}
        <div className='mb-12 flex flex-col items-center space-y-6 text-center'>
          <div className='rounded-full bg-primary/20 p-4'>
            <BiCollection size={48} className='text-primary' />
          </div>
          <h1 className='bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent'>
            {collection.name}
          </h1>
          {collection.description && (
            <p className='max-w-2xl text-lg text-muted-foreground'>{collection.description}</p>
          )}
          <div className='flex items-center gap-4 text-sm font-medium text-foreground'>
            <div className='flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2'>
              {collection.user.image ? (
                <Image
                  src={collection.user.image}
                  alt={collection.user.name || 'User'}
                  width={24}
                  height={24}
                  className='rounded-full'
                />
              ) : (
                <BiUser size={20} />
              )}
              <span>Owner: {collection.user.name || 'User'}</span>
            </div>

            {collection.collaborators.length > 0 && (
              <div className='flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2'>
                <div className='flex -space-x-2'>
                  {collection.collaborators.map(collab => (
                    <div
                      key={collab.id}
                      className='relative h-6 w-6 overflow-hidden rounded-full border border-border bg-card'
                    >
                      {collab.image ? (
                        <Image
                          src={collab.image}
                          alt={collab.name || 'User'}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='flex h-full w-full items-center justify-center bg-slate-500 text-[10px] font-bold text-white'>
                          {collab.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <span>Collaborators</span>
              </div>
            )}

            {isOwner && <InviteCollaboratorsButton collectionId={collection.id} />}
            <div className='flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2'>
              <BiGlobe size={20} className='text-primary' />
              <span>Public</span>
            </div>
            <div className='flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2'>
              <span className='font-bold'>{collection.items.length}</span> Items
            </div>
          </div>
          {/* Conditionally render clone button for logged-in non-owners */}
          {session?.user?.id && !isOwner && !isCollaborator && (
            <div className='flex justify-center mt-8'>
              <CloneCollectionButton collectionId={collection.id} />
            </div>
          )}
        </div>

        {/* Items Grid */}
        {collection.items.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center'>
            <BiCollection size={48} className='mb-4 text-muted-foreground opacity-50' />
            <h3 className='text-xl font-bold text-muted-foreground'>No items in this collection</h3>
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {collection.items.map((item: any) => {
              const linkUrl =
                item.mediaType === 'MOVIE'
                  ? `/movie/${item.mediaId}`
                  : item.mediaType === 'SHOW'
                    ? `/show/${item.mediaId}`
                    : `/game/${item.mediaId}`;

              return (
                <Link key={item.id} href={linkUrl} className='group relative flex flex-col gap-2'>
                  <div className='relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-transform duration-300 group-hover:-translate-y-2 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/20'>
                    {(isOwner || isCollaborator) && (
                      <RemoveItemButton
                        collectionId={collection.id}
                        mediaType={item.mediaType}
                        mediaId={item.mediaId}
                      />
                    )}

                    <ToggleWatchedButton
                      collectionId={collection.id}
                      itemId={item.id}
                      initialWatched={item.watched}
                      canToggle={isOwner || isCollaborator}
                    />
                    {item.mediaImage ? (
                      <Image
                        src={item.mediaImage}
                        alt={item.mediaTitle}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center border border-border bg-card text-muted-foreground'>
                        No Image
                      </div>
                    )}
                    <div className='absolute left-2 top-2 rounded bg-black/60 px-2 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md'>
                      {item.mediaType}
                    </div>
                  </div>
                  <h3 className='line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary'>
                    {item.mediaTitle}
                  </h3>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PageAnimationWrapper>
  );
}
