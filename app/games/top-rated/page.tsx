import { igdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';
import { RESULTS_PER_PAGE } from '@/utils/constants';

export default async function TopRatedGames() {
  const initialData = await igdbClient.getTopRatedGames(RESULTS_PER_PAGE, 1);

  async function fetchNextPage(page: number) {
    'use server';
    return await igdbClient.getTopRatedGames(RESULTS_PER_PAGE, page);
  }

  return (
    <BrowseClient
      initialData={initialData}
      fetchNextPageAction={fetchNextPage}
      title='Top Rated Games'
      queryKey={['games', 'top-rated']}
    />
  );
}
