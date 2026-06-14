import { tmdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';

export default async function PopularMovies() {
  const initialData = await tmdbClient.getPopularMovies(1);

  async function fetchNextPage(page: number) {
    'use server';
    return await tmdbClient.getPopularMovies(page);
  }

  return (
    <BrowseClient
      initialData={initialData}
      fetchNextPageAction={fetchNextPage}
      title='Popular Movies'
      queryKey={['movies', 'popular']}
    />
  );
}
