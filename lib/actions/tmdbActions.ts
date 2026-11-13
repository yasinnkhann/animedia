'use server';

import { tmdbClient } from '../api';

export async function getMovieDetailsAction(movieId: string) {
  try {
    return await tmdbClient.getMovieDetails(movieId);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export async function getShowDetailsAction(showId: string) {
  try {
    return await tmdbClient.getShowDetails(showId);
  } catch (error) {
    console.error('Error fetching show details:', error);
    return null;
  }
}

export async function getCollectionDetailsAction(collectionId: string | number) {
  try {
    return await tmdbClient.getCollectionDetails(collectionId);
  } catch (error) {
    console.error('Error fetching collection details:', error);
    return null;
  }
}

export async function getWatchProvidersAction(type: 'MOVIE' | 'SHOW', id: string) {
  try {
    return type === 'MOVIE'
      ? await tmdbClient.getMovieWatchProviders(id)
      : await tmdbClient.getShowWatchProviders(id);
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return null;
  }
}
