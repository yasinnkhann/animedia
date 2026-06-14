import { igdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';
import { RESULTS_PER_PAGE } from '@/utils/constants';

export default async function PopularGames() {
  const initialData = await igdbClient.getPopularGames(RESULTS_PER_PAGE, 1);

  async function fetchNextPage(page: number) {
    'use server';
    return await igdbClient.getPopularGames(RESULTS_PER_PAGE, page);
  }

  return (
    <BrowseClient
      initialData={initialData}
      fetchNextPageAction={fetchNextPage}
      title='Popular Games'
      queryKey={['games', 'popular']}
    />
  );
}
