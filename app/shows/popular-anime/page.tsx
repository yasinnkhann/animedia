import { tmdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';

export default async function PopularAnimeShows(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = Math.max(1, parseInt(pageStr, 10) || 1);

  const keywordSearchResults = await tmdbClient.searchKeyword('anime');
  const keywordId = keywordSearchResults.results?.[0]?.id;

  const popularAnimeShows = keywordId
    ? await tmdbClient.discoverShowsByKeyword(keywordId, page)
    : { results: [], total_results: 0 };

  return (
    <BrowseClient
      mediaData={popularAnimeShows}
      currPage={page}
      title='Popular Anime Shows'
      basePath='/shows/popular-anime'
    />
  );
}
