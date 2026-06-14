import { tmdbClient, igdbClient } from '@/lib/api';
import { RESULTS_PER_PAGE } from '@/utils/constants';
import SearchClient from './SearchClient';

export default async function Search(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = Math.max(1, parseInt(pageStr, 10) || 1);

  if (!q) {
    return (
      <SearchClient
        searchedMoviesData={{ searchedMovies: { results: [], total_results: 0 } }}
        searchedShowsData={{ searchedShows: { results: [], total_results: 0 } }}
        searchedPeopleData={{ searchedPeople: { results: [], total_results: 0 } }}
        searchedGamesData={{ searchedGames: { results: [], total_results: 0 } }}
      />
    );
  }

  const [searchedMovies, searchedShows, searchedPeople, searchedGames] = await Promise.all([
    tmdbClient.searchMovies(q, page),
    tmdbClient.searchShows(q, page),
    tmdbClient.searchPeople(q, page),
    igdbClient.searchGames(q, RESULTS_PER_PAGE, page),
  ]);

  return (
    <SearchClient
      searchedMoviesData={{ searchedMovies }}
      searchedShowsData={{ searchedShows }}
      searchedPeopleData={{ searchedPeople }}
      searchedGamesData={{ searchedGames }}
    />
  );
}
