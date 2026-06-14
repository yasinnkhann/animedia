import { tmdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';

export default async function TopRatedMovies(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = Math.max(1, parseInt(pageStr, 10) || 1);

  const topRatedMovies = await tmdbClient.getTopRatedMovies(page);

  return (
    <BrowseClient
      mediaData={topRatedMovies}
      currPage={page}
      title='Top Rated Movies'
      basePath='/movies/top-rated'
    />
  );
}
