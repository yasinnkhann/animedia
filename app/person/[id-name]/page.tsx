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

  let personDetails;
  try {
    personDetails = await tmdbClient.getPersonDetails(id);
  } catch (e) {
    return {
      title: 'Person Not Found | AniMedia',
    };
  }

  const title = personDetails?.name ? `${personDetails.name} | AniMedia` : 'Person | AniMedia';

  // Truncate biography if it's too long
  let description = 'View person details on AniMedia.';
  if (personDetails?.biography) {
    description =
      personDetails.biography.length > 200
        ? personDetails.biography.substring(0, 197) + '...'
        : personDetails.biography;
  }

  const posterUrl = personDetails?.profile_path
    ? (CommonMethods.getTheMovieDbImage(personDetails.profile_path) as string)
    : '';

  const ogUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/og`);
  ogUrl.searchParams.set('title', personDetails?.name || 'Person');
  if (posterUrl) ogUrl.searchParams.set('poster', posterUrl);
  ogUrl.searchParams.set('type', 'PERSON');

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

export default async function PersonDetails({
  params,
}: {
  params: Promise<{ 'id-name': string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams?.['id-name']?.split('-')[0] ?? '';

  if (!id) return null;

  let personDetails;
  try {
    personDetails = await tmdbClient.getPersonDetails(id);
  } catch (e) {
    const { notFound } = await import('next/navigation');
    notFound();
  }

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
