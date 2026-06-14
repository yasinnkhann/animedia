import { tmdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';

export default async function TopRatedMovies() {
  const initialData = await tmdbClient.getTopRatedMovies(1);

  async function fetchNextPage(page: number) {
    'use server';
    return await tmdbClient.getTopRatedMovies(page);
  }

  return (
    <BrowseClient
      initialData={initialData}
      fetchNextPageAction={fetchNextPage}
      title='Top Rated Movies'
      queryKey={['movies', 'top-rated']}
    />
  );
}
