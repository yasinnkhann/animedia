import { getCollectionDetailsAction } from '@/lib/actions/tmdbActions';
import { prisma } from '@/lib/prisma';
import TimelineScrollerClient from '@/components/HorizontalScroller/Timeline/TimelineScrollerClient';

interface FranchiseTrackerProps {
  collectionId: number;
  currentMovieId: number;
}

export default async function FranchiseTracker({
  collectionId,
  currentMovieId,
}: FranchiseTrackerProps) {
  // 1. Fetch collection details from TMDB
  const collection = await getCollectionDetailsAction(collectionId.toString());

  if (!collection || !collection.parts || collection.parts.length === 0) {
    return null;
  }

  // Sort movies chronologically
  const sortedParts = [...collection.parts].sort((a, b) => {
    if (!a.release_date) return 1;
    if (!b.release_date) return -1;
    return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
  });

  return (
    <section className='mb-4'>
      <div className='mb-4 ml-8 mr-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <h3 className='font-bold'>{collection.name}</h3>
      </div>

      {/* Horizontal Scrollable Timeline */}
      <div className='relative'>
        <TimelineScrollerClient
          parts={sortedParts}
          currentMovieId={currentMovieId}
          mediaType='movie'
        />
      </div>
    </section>
  );
}
