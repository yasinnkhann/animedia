import { tmdbClient } from '@/lib/api';
import PeopleBrowseClient from '@/components/PeopleBrowseClient';

export default async function PopularPeople() {
  const initialData = await tmdbClient.getPopularPeople(1);

  async function fetchNextPage(page: number) {
    'use server';
    return await tmdbClient.getPopularPeople(page);
  }

  return (
    <PeopleBrowseClient
      initialData={initialData}
      fetchNextPageAction={fetchNextPage}
      title='Popular People'
      queryKey={['people', 'popular']}
    />
  );
}
