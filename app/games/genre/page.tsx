import { igdbClient } from '@/lib/api';
import GenreBrowseClient from '@/components/GenreBrowseClient';
import { SORT_BY_OPTIONS } from '@/models/dropDownOptions';
import { RESULTS_PER_PAGE } from '@/utils/constants';

export default async function GenreGames(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = Math.max(1, parseInt(pageStr, 10) || 1);

  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'Popular';

  // Fetch game genres
  const gameGenresData = await igdbClient.getGameGenres();
  const gameGenres = gameGenresData ?? [];
  const genreOptions = gameGenres.map((g: any) => ({ value: g.id.toString(), text: g.name }));

  const genreStr =
    typeof searchParams.genre === 'string' ? searchParams.genre : (genreOptions[0]?.value ?? '0');
  const genreId = parseInt(genreStr, 10) || 0;

  // Resolve actual genre name to pass to client
  const resolvedGenreName = gameGenres.find((g: any) => g.id === genreId)?.name ?? 'Genre';

  const apiSortBy = sortBy === 'Popular' ? 'rating_count' : 'rating';

  const genreGames = await igdbClient.getGamesByGenre(genreId, apiSortBy, RESULTS_PER_PAGE, page);

  return (
    <GenreBrowseClient
      mediaData={genreGames}
      currPage={page}
      sortBy={sortBy}
      genre={genreStr}
      basePath='/games/genre'
      sortByOptions={SORT_BY_OPTIONS}
      genreOptions={genreOptions}
    />
  );
}
