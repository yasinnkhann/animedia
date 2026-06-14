import { Metadata } from 'next';
import { CommonMethods } from '@/utils/CommonMethods';
import { tmdbClient } from '@/lib/api';
import ShowDetailsClient from './ShowDetailsClient';

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
  const images = showDetails?.poster_path
    ? [CommonMethods.getTheMovieDbImage(showDetails.poster_path) as string]
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

export default async function ShowDetails({ params }: { params: Promise<{ 'id-name': string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams?.['id-name']?.split('-')[0] ?? '';

  if (!id) return null;

  const [showDetails, showsCastCrew, recShows] = await Promise.all([
    tmdbClient.getShowDetails(id),
    tmdbClient.getShowCredits(id),
    tmdbClient.getRecommendedShows(id),
  ]);

  // Transform tmdbClient responses to match what Apollo would have returned so the client component works seamlessly
  const showDetailsData = { showDetails };
  const showsCastCrewData = { showsCastCrew };
  const recShowsData = { recommendedShows: recShows };

  return (
    <ShowDetailsClient
      showDetailsData={showDetailsData}
      showsCastCrewData={showsCastCrewData}
      recShowsData={recShowsData}
    />
  );
}
