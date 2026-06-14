import { tmdbClient, igdbClient } from '@/lib/api';
import { RESULTS_PER_PAGE } from '@/utils/constants';
import SearchClient from './SearchClient';

export default async function Search(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';

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
    tmdbClient.searchMovies(q, 1),
    tmdbClient.searchShows(q, 1),
    tmdbClient.searchPeople(q, 1),
    igdbClient.searchGames(q, RESULTS_PER_PAGE, 1),
  ]);

  async function fetchNextPageMovies(page: number) {
    'use server';
    return await tmdbClient.searchMovies(q, page);
  }

  async function fetchNextPageShows(page: number) {
    'use server';
    return await tmdbClient.searchShows(q, page);
  }

  async function fetchNextPagePeople(page: number) {
    'use server';
    return await tmdbClient.searchPeople(q, page);
  }

  async function fetchNextPageGames(page: number) {
    'use server';
    return await igdbClient.searchGames(q, RESULTS_PER_PAGE, page);
  }

  return (
    <SearchClient
      searchedMoviesData={{ searchedMovies }}
      searchedShowsData={{ searchedShows }}
      searchedPeopleData={{ searchedPeople }}
      searchedGamesData={{ searchedGames }}
      fetchNextPageMovies={fetchNextPageMovies}
      fetchNextPageShows={fetchNextPageShows}
      fetchNextPagePeople={fetchNextPagePeople}
      fetchNextPageGames={fetchNextPageGames}
    />
  );
}
