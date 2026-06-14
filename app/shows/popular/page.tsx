import { tmdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';

export default async function PopularShows(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = Math.max(1, parseInt(pageStr, 10) || 1);

  const popularShows = await tmdbClient.getPopularShows(page);

  return (
    <BrowseClient
      mediaData={popularShows}
      currPage={page}
      title='Popular Shows'
      basePath='/shows/popular'
    />
  );
}
