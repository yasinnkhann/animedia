import { tmdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';

export default async function TopRatedShows(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = Math.max(1, parseInt(pageStr, 10) || 1);

  const topRatedShows = await tmdbClient.getTopRatedShows(page);

  return (
    <BrowseClient
      mediaData={topRatedShows}
      currPage={page}
      title='Top Rated Shows'
      basePath='/shows/top-rated'
    />
  );
}
