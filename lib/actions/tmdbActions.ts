'use server';

import { tmdbClient } from '../api';

export async function getEpisodeDetailsAction(
  showId: string,
  seasonNum: number,
  episodeNum: number
) {
  try {
    const res = await tmdbClient.getEpisodeDetails(showId, seasonNum, episodeNum);
    return res;
  } catch (error) {
    console.error('Error fetching episode details:', error);
    return null;
  }
}

export async function getSeasonDetailsAction(showId: string, seasonNum: number) {
  try {
    const res = await tmdbClient.getSeasonDetails(showId, seasonNum);
    console.log(
      `[getSeasonDetailsAction] showId=${showId}, seasonNum=${seasonNum}, res.id=${res?.id}, episodes=${res?.episodes?.length}`
    );
    return res;
  } catch (error) {
    console.error('Error fetching season details:', error);
    return null;
  }
}

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

export async function getRecommendedMoviesAction(movieId: string) {
  try {
    return await tmdbClient.getRecommendedMovies(movieId);
  } catch (error) {
    console.error('Error fetching recommended movies:', error);
    return null;
  }
}
