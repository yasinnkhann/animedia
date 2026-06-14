import { tmdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';

export default async function PopularShows() {
  const initialData = await tmdbClient.getPopularShows(1);

  async function fetchNextPage(page: number) {
    'use server';
    return await tmdbClient.getPopularShows(page);
  }

  return (
    <BrowseClient
      initialData={initialData}
      fetchNextPageAction={fetchNextPage}
      title='Popular Shows'
      queryKey={['shows', 'popular']}
    />
  );
}
