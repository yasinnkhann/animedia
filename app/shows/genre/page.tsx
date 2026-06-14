import { tmdbClient } from '@/lib/api';
import GenreBrowseClient from '@/components/GenreBrowseClient';
import { CommonMethods } from '@/utils/CommonMethods';
import { SORT_BY_OPTIONS, SHOW_GENRE_TYPE_OPTIONS } from '@/models/dropDownOptions';

export default async function GenreShows(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = Math.max(1, parseInt(pageStr, 10) || 1);

  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'Popular';
  const genre = typeof searchParams.genre === 'string' ? searchParams.genre : 'Action_&_Adventure';

  const genreIdStr = await CommonMethods.getGenreID(genre as any, 'tv');
  const genreId = parseInt(genreIdStr, 10);

  const apiSortBy = sortBy === 'Popular' ? 'popularity.desc' : 'vote_average.desc';

  const genreShows = await tmdbClient.discoverShowsByGenre(genreId, apiSortBy, page);

  return (
    <GenreBrowseClient
      mediaData={genreShows}
      currPage={page}
      sortBy={sortBy}
      genre={genre}
      basePath='/shows/genre'
      sortByOptions={SORT_BY_OPTIONS}
      genreOptions={SHOW_GENRE_TYPE_OPTIONS}
    />
  );
}
