import { tmdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';

export default async function TopRatedShows() {
  const initialData = await tmdbClient.getTopRatedShows(1);

  async function fetchNextPage(page: number) {
    'use server';
    return await tmdbClient.getTopRatedShows(page);
  }

  return (
    <BrowseClient
      initialData={initialData}
      fetchNextPageAction={fetchNextPage}
      title='Top Rated Shows'
      queryKey={['shows', 'top-rated']}
    />
  );
}
