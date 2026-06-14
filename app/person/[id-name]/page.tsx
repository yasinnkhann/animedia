import { tmdbClient } from '@/lib/api';
import PersonDetailsClient from './PersonDetailsClient';

export default async function PersonDetails({
  params,
}: {
  params: Promise<{ 'id-name': string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams?.['id-name']?.split('-')[0] ?? '';

  if (!id) return null;

  const [personDetails, knownForMovies, knownForShows] = await Promise.all([
    tmdbClient.getPersonDetails(id),
    tmdbClient.getPersonMovieCredits(id),
    tmdbClient.getPersonShowCredits(id),
  ]);

  return (
    <PersonDetailsClient
      personDetailsData={{ personDetails }}
      knownForMoviesData={{ personsKnownForMovie: knownForMovies }}
      knownForShowsData={{ personsKnownForShow: knownForShows }}
    />
  );
}
