'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BiCollection, BiTrash, BiLockAlt, BiGlobe, BiLinkExternal, BiGroup } from 'react-icons/bi';
import Image from 'next/image';

export default function CollectionsClient({
  initialCollections,
  currentUserId,
}: {
  initialCollections: any[];
  currentUserId: string;
}) {
  const [collections, setCollections] = useState(initialCollections);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCollections(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/collection/${id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  if (collections.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center rounded-3xl border border-border bg-card/50 py-24 text-center'>
        <BiCollection size={64} className='mb-4 text-muted-foreground opacity-50' />
        <h3 className='text-xl font-bold'>No Collections Yet</h3>
        <p className='mt-2 text-muted-foreground'>
          You haven&apos;t created any collections. Go to any movie, show, or game and click
          &quot;Add to Collection&quot; to get started!
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {collections.map(collection => (
        <div
          key={collection.id}
          className='group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl'
        >
          {/* Images Grid */}
          <Link
            href={`/collection/${collection.id}`}
            className='relative block h-48 w-full bg-slate-800/50'
          >
            {collection.items.length > 0 ? (
              <div className='grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5'>
                {Array.from({ length: 4 }).map((_, i) => {
                  const item = collection.items[i];
                  return (
                    <div key={i} className='relative h-full w-full bg-slate-900'>
                      {item?.mediaImage ? (
                        <Image
                          src={item.mediaImage}
                          alt={item.mediaTitle}
                          fill
                          className='object-cover opacity-80 transition-opacity group-hover:opacity-100'
                        />
                      ) : (
                        <div className='flex h-full w-full items-center justify-center'>
                          <BiCollection size={24} className='text-slate-700' />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className='flex h-full w-full items-center justify-center'>
                <BiCollection size={48} className='text-slate-700' />
              </div>
            )}
            <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
            <div className='absolute bottom-3 left-4 right-4 flex items-center justify-between'>
              <span className='rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md'>
                {collection._count.items} Items
              </span>
              {collection.isPublic ? (
                <span
                  className='flex items-center gap-1 rounded-full bg-blue-500/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md'
                  title='Public'
                >
                  <BiGlobe /> Public
                </span>
              ) : (
                <span
                  className='flex items-center gap-1 rounded-full bg-slate-600/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md'
                  title='Private'
                >
                  <BiLockAlt /> Private
                </span>
              )}
            </div>
          </Link>

          {/* Details */}
          <div className='flex flex-1 flex-col p-5'>
            <div className='flex items-start justify-between gap-4'>
              <Link
                href={`/collection/${collection.id}`}
                className='transition-colors hover:text-primary'
              >
                <div className='flex items-center gap-2'>
                  <h3 className='line-clamp-1 text-xl font-bold'>{collection.name}</h3>
                  {collection.userId !== currentUserId && (
                    <span className='rounded bg-blue-500/20 px-1.5 py-0.5 text-xs font-semibold text-blue-500'>
                      Shared
                    </span>
                  )}
                  {collection.userId === currentUserId && collection.collaborators?.length > 0 && (
                    <BiGroup size={20} className='text-primary' title='Collaborative Collection' />
                  )}
                </div>
              </Link>
              <div className='flex gap-2'>
                {collection.isPublic && (
                  <button
                    onClick={() => handleCopyLink(collection.id)}
                    className='text-slate-400 transition-colors hover:text-blue-500'
                    title='Copy Link'
                  >
                    <BiLinkExternal size={20} />
                  </button>
                )}
                {collection.userId === currentUserId && (
                  <button
                    onClick={() => handleDelete(collection.id)}
                    disabled={isDeleting === collection.id}
                    className='text-slate-400 transition-colors hover:text-red-500 disabled:opacity-50'
                    title='Delete Collection'
                  >
                    <BiTrash size={20} />
                  </button>
                )}
              </div>
            </div>
            {collection.description && (
              <p className='mt-2 line-clamp-2 text-sm text-muted-foreground'>
                {collection.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
