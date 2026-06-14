import { tmdbClient } from '@/lib/api';
import ShowDetailsClient from './ShowDetailsClient';

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
