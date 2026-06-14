import { tmdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';

export default async function PopularAnimeMovies() {
  const keywordSearchResults = await tmdbClient.searchKeyword('anime');
  const keywordId = keywordSearchResults.results?.[0]?.id;

  const initialData = keywordId
    ? await tmdbClient.discoverMoviesByKeyword(keywordId, 1)
    : { results: [], total_results: 0 };

  async function fetchNextPage(page: number) {
    'use server';
    return keywordId
      ? await tmdbClient.discoverMoviesByKeyword(keywordId, page)
      : { results: [], total_results: 0 };
  }

  return (
    <BrowseClient
      initialData={initialData}
      fetchNextPageAction={fetchNextPage}
      title='Popular Anime Movies'
      queryKey={['movies', 'popular-anime']}
    />
  );
}
