'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IoMdClose } from 'react-icons/io';
import { BiCollection, BiPlus } from 'react-icons/bi';

interface Collection {
  id: string;
  name: string;
  items: { mediaId: string }[];
}

interface Props {
  mediaType: 'MOVIE' | 'SHOW' | 'GAME';
  mediaId: string;
  mediaTitle: string;
  mediaImage: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddToCollectionModal({
  mediaType,
  mediaId,
  mediaTitle,
  mediaImage,
  isOpen,
  onClose,
}: Props) {
  const { status } = useSession();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch('/api/collections');
        if (res.ok) {
          const data = await res.json();
          setCollections(data.collections);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && status === 'authenticated') {
      fetchCollections();
    }
  }, [isOpen, status]);

  const handleToggleItem = async (collection: Collection) => {
    const isAdded = collection.items.some(i => i.mediaId === mediaId);

    // Optimistic update
    setCollections(prev =>
      prev.map(c => {
        if (c.id === collection.id) {
          return {
            ...c,
            items: isAdded ? c.items.filter(i => i.mediaId !== mediaId) : [...c.items, { mediaId }],
          };
        }
        return c;
      })
    );

    try {
      if (isAdded) {
        await fetch(
          `/api/collections/${collection.id}/items?mediaType=${mediaType}&mediaId=${mediaId}`,
          {
            method: 'DELETE',
          }
        );
      } else {
        await fetch(`/api/collections/${collection.id}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mediaType, mediaId, mediaTitle, mediaImage }),
        });
      }
    } catch (err) {
      console.error(err);
      // Fallback optimistic revert is intentionally removed here to avoid complex state recovery without fetchCollections ref
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCollectionName }),
      });
      if (res.ok) {
        const data = await res.json();
        const newCollection = { ...data.collection, items: [] };
        setCollections([newCollection, ...collections]);
        setNewCollectionName('');
        // Automatically add the item to the new collection
        handleToggleItem(newCollection);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
      <div className='relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl'>
        {/* Header */}
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='flex items-center gap-2 text-xl font-bold text-foreground'>
            <BiCollection className='text-primary' /> Add to Collection
          </h2>
          <button
            onClick={onClose}
            className='rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Create New Form */}
        <form onSubmit={handleCreateCollection} className='mb-6 flex gap-2'>
          <input
            type='text'
            placeholder='New collection name...'
            value={newCollectionName}
            onChange={e => setNewCollectionName(e.target.value)}
            className='flex-1 rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none'
          />
          <button
            type='submit'
            disabled={!newCollectionName.trim() || isCreating}
            className='text-primary-foreground flex items-center gap-1 rounded-lg bg-primary px-4 py-2 font-medium transition-colors hover:bg-primary/90 disabled:opacity-50'
          >
            <BiPlus size={20} /> Create
          </button>
        </form>

        {/* Collection List */}
        <div className='custom-scrollbar max-h-64 space-y-2 overflow-y-auto pr-2'>
          {isLoading ? (
            <div className='flex justify-center py-8'>
              <div className='h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent' />
            </div>
          ) : collections.length === 0 ? (
            <div className='py-8 text-center text-muted-foreground'>
              You don&apos;t have any collections yet.
            </div>
          ) : (
            collections.map(collection => {
              const isAdded = collection.items.some(i => i.mediaId === mediaId);
              return (
                <button
                  key={collection.id}
                  onClick={() => handleToggleItem(collection)}
                  className='group flex w-full items-center justify-between rounded-xl border border-border p-3 text-left transition-colors hover:border-primary/50 hover:bg-muted'
                >
                  <span className='font-medium text-foreground transition-colors'>
                    {collection.name}
                  </span>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                      isAdded
                        ? 'text-primary-foreground border-primary bg-primary'
                        : 'border-muted-foreground bg-transparent'
                    }`}
                  >
                    {isAdded && (
                      <svg
                        className='text-primary-foreground h-3 w-3'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={3}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
