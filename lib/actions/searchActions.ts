'use server';

import { tmdbClient, igdbClient } from '../api';

export async function globalSearchAction(query: string) {
  try {
    if (!query) {
      return { movies: [], shows: [], games: [], people: [] };
    }

    const [moviesRes, showsRes, gamesRes, peopleRes] = await Promise.all([
      tmdbClient.searchMovies(query, 1),
      tmdbClient.searchShows(query, 1),
      igdbClient.searchGames(query, 5, 1),
      tmdbClient.searchPeople(query, 1),
    ]);

    return {
      movies: moviesRes?.results || [],
      shows: showsRes?.results || [],
      games: gamesRes?.results || [],
      people: peopleRes?.results || [],
    };
  } catch (error) {
    console.error('Error during global search:', error);
    return { movies: [], shows: [], games: [], people: [] };
  }
}
