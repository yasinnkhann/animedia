import { igdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';
import { RESULTS_PER_PAGE } from '@/utils/constants';

export default async function TopRatedGames(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = Math.max(1, parseInt(pageStr, 10) || 1);

  const topRatedGames = await igdbClient.getTopRatedGames(RESULTS_PER_PAGE, page);

  return (
    <BrowseClient
      mediaData={topRatedGames}
      currPage={page}
      title='Top Rated Games'
      basePath='/games/top-rated'
    />
  );
}
