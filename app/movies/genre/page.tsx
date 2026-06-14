import { tmdbClient } from '@/lib/api';
import GenreBrowseClient from '@/components/GenreBrowseClient';
import { CommonMethods } from '@/utils/CommonMethods';
import { SORT_BY_OPTIONS, MOVIE_GENRE_TYPE_OPTIONS } from '@/models/dropDownOptions';

export default async function GenreMovies(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'Popular';
  const genre = typeof searchParams.genre === 'string' ? searchParams.genre : 'Action';

  const genreIdStr = await CommonMethods.getGenreID(genre as any, 'movie');
  const genreId = parseInt(genreIdStr, 10);

  const apiSortBy = sortBy === 'Popular' ? 'popularity.desc' : 'vote_average.desc';

  const initialData = await tmdbClient.discoverMoviesByGenre(genreId, apiSortBy, 1);

  async function fetchNextPage(page: number) {
    'use server';
    return await tmdbClient.discoverMoviesByGenre(genreId, apiSortBy, page);
  }

  return (
    <GenreBrowseClient
      initialData={initialData}
      fetchNextPageAction={fetchNextPage}
      sortBy={sortBy}
      genre={genre}
      basePath='/movies/genre'
      sortByOptions={SORT_BY_OPTIONS}
      genreOptions={MOVIE_GENRE_TYPE_OPTIONS}
    />
  );
}
