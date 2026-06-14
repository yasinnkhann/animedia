import { igdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';
import { RESULTS_PER_PAGE } from '@/utils/constants';

export default async function PopularGames(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = Math.max(1, parseInt(pageStr, 10) || 1);

  const popularGames = await igdbClient.getPopularGames(RESULTS_PER_PAGE, page);

  return (
    <BrowseClient
      mediaData={popularGames}
      currPage={page}
      title='Popular Games'
      basePath='/games/popular'
    />
  );
}
