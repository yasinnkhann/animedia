import { Metadata } from 'next';
import { CommonMethods } from '@/utils/CommonMethods';
import { tmdbClient } from '@/lib/api';
import ShowDetailsClient from './ShowDetailsClient';
import { Suspense } from 'react';
import HorizontalScrollerSkeleton from '@/components/Skeletons/HorizontalScrollerSkeleton';
import ShowCastServer from '@/components/show/ShowCastServer';
import ShowRelatedServer from '@/components/show/ShowRelatedServer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ 'id-name': string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.['id-name']?.split('-')[0] ?? '';

  if (!id) {
    return {
      title: 'Show Not Found | AniMedia',
    };
  }

  const showDetails = await tmdbClient.getShowDetails(id);
  const title = showDetails?.name ? `${showDetails.name} | AniMedia` : 'Show | AniMedia';
  const description = showDetails?.overview || 'View show details on AniMedia.';
  const posterUrl = showDetails?.poster_path
    ? (CommonMethods.getTheMovieDbImage(showDetails.poster_path) as string)
    : '';

  const ogUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/og`);
  ogUrl.searchParams.set('title', showDetails?.name || 'Show');
  if (posterUrl) ogUrl.searchParams.set('poster', posterUrl);
  if (showDetails?.vote_average) {
    ogUrl.searchParams.set('rating', String(+(showDetails.vote_average ?? 0).toFixed(1) * 10));
  }
  ogUrl.searchParams.set('type', 'SHOW');

  const images = [ogUrl.toString()];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    },
  };
}

export default async function ShowDetails({ params }: { params: Promise<{ 'id-name': string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams?.['id-name']?.split('-')[0] ?? '';

  if (!id) return null;

  const showDetails = await tmdbClient.getShowDetails(id);

  // Transform tmdbClient responses to match what Apollo would have returned so the client component works seamlessly
  const showDetailsData = { showDetails };

  return (
    <ShowDetailsClient
      showDetailsData={showDetailsData}
      castNode={
        <Suspense key='cast' fallback={<HorizontalScrollerSkeleton />}>
          <ShowCastServer showId={id} />
        </Suspense>
      }
      relatedNode={
        <Suspense key='related' fallback={<HorizontalScrollerSkeleton />}>
          <ShowRelatedServer showId={id} />
        </Suspense>
      }
    />
  );
}
