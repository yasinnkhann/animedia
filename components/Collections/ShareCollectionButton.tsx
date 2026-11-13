'use client';

import { useState } from 'react';
import { BiShareAlt } from 'react-icons/bi';
import ShareModal from '@/components/Media/ShareModal';

interface Props {
  collectionId: string;
  collectionName: string;
  curatorName?: string;
  itemCount: number;
  posterUrl?: string | null;
}

export default function ShareCollectionButton({
  collectionName,
  curatorName,
  itemCount,
  posterUrl,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const ogParams = new URLSearchParams({
    type: 'COLLECTION',
    title: collectionName,
    itemCount: String(itemCount),
  });
  if (curatorName) ogParams.set('curator', curatorName);
  if (posterUrl) ogParams.set('poster', posterUrl);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:scale-95'
        title='Share Collection'
      >
        <BiShareAlt size={18} />
        <span>Share</span>
      </button>

      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={collectionName}
        type='COLLECTION'
        ogImageUrl={`/api/og?${ogParams.toString()}`}
      />
    </>
  );
}
