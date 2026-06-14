import { Metadata } from 'next';
import { CommonMethods } from '@/utils/CommonMethods';
import { tmdbClient } from '@/lib/api';
import PersonDetailsClient from './PersonDetailsClient';
import { Suspense } from 'react';
import HorizontalScrollerSkeleton from '@/components/Skeletons/HorizontalScrollerSkeleton';
import PersonCreditsServer from '@/components/person/PersonCreditsServer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ 'id-name': string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.['id-name']?.split('-')[0] ?? '';

  if (!id) {
    return {
      title: 'Person Not Found | AniMedia',
    };
  }

  const personDetails = await tmdbClient.getPersonDetails(id);
  const title = personDetails?.name ? `${personDetails.name} | AniMedia` : 'Person | AniMedia';

  // Truncate biography if it's too long
  let description = 'View person details on AniMedia.';
  if (personDetails?.biography) {
    description =
      personDetails.biography.length > 200
        ? personDetails.biography.substring(0, 197) + '...'
        : personDetails.biography;
  }

  const images = personDetails?.profile_path
    ? [CommonMethods.getTheMovieDbImage(personDetails.profile_path) as string]
    : [];

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

export default async function PersonDetails({
  params,
}: {
  params: Promise<{ 'id-name': string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams?.['id-name']?.split('-')[0] ?? '';

  if (!id) return null;

  const personDetails = await tmdbClient.getPersonDetails(id);

  const personDetailsData = { personDetails };

  return (
    <PersonDetailsClient
      personDetailsData={personDetailsData}
      creditsNode={
        <Suspense key='credits' fallback={<HorizontalScrollerSkeleton />}>
          <PersonCreditsServer personId={id} />
        </Suspense>
      }
    />
  );
}
