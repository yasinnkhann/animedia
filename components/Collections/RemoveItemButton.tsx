'use client';

import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useRouter } from 'next/navigation';

interface Props {
  collectionId: string;
  mediaType: string;
  mediaId: string;
}

export default function RemoveItemButton({ collectionId, mediaType, mediaId }: Props) {
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRemoving) return;

    setIsRemoving(true);
    try {
      const res = await fetch(
        `/api/collections/${collectionId}/items?mediaType=${mediaType}&mediaId=${mediaId}`,
        {
          method: 'DELETE',
        }
      );
      if (res.ok) {
        router.refresh();
      } else {
        console.error('Failed to remove item');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isRemoving}
      className={`absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1.5 text-white opacity-0 shadow-sm backdrop-blur-md transition-all group-hover:opacity-100 hover:scale-110 hover:bg-red-500/80 ${isRemoving ? 'cursor-not-allowed opacity-50' : ''}`}
      title='Remove from collection'
    >
      {isRemoving ? (
        <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
      ) : (
        <IoMdClose size={16} />
      )}
    </button>
  );
}
