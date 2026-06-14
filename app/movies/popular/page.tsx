import { tmdbClient } from '@/lib/api';
import BrowseClient from '@/components/BrowseClient';

export default async function PopularMovies(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = Math.max(1, parseInt(pageStr, 10) || 1);

  const popularMovies = await tmdbClient.getPopularMovies(page);

  return (
    <BrowseClient
      mediaData={popularMovies}
      currPage={page}
      title='Popular Movies'
      basePath='/movies/popular'
    />
  );
}
