import { HTTPClient, FetchOptions } from './client';
import { ValidationError } from './errors';
import logger from '../logger';
import { z } from 'zod';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.THE_MOVIE_DB_API_KEY;

/**
 * Validation schemas for common TMDB responses
 */
const TMDBPaginatedResponseSchema = z.object({
  page: z.number().optional(),
  total_pages: z.number().optional(),
  total_results: z.number().optional(),
  results: z.array(z.any()),
});

const TMDBDetailsResponseSchema = z.object({
  id: z.number().optional(),
});

/**
 * TMDB-specific HTTP client with response validation
 */
export class TMDBClient extends HTTPClient {
  constructor() {
    super({
      baseURL: TMDB_BASE_URL,
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Fetch from TMDB API with automatic API key injection and validation
   */
  async fetchTMDB<T = any>(
    endpoint: string,
    params: Record<string, any> = {},
    options: FetchOptions = {}
  ): Promise<T> {
    try {
      if (!TMDB_API_KEY) {
        throw new ValidationError('THE_MOVIE_DB_API_KEY environment variable is not set');
      }

      // Build query string
      const queryParams = new URLSearchParams({
        api_key: TMDB_API_KEY,
        ...params,
      });

      const url = `${endpoint}?${queryParams.toString()}`;

      logger.debug(`TMDB API call: ${endpoint}`, { params });

      const data = await this.get<T>(url, options);

      return data;
    } catch (error) {
      logger.error('TMDB API error', {
        endpoint,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Fetch paginated TMDB results
   */
  async fetchPaginated<T extends Record<string, any> = any>(
    endpoint: string,
    params: Record<string, any> = {},
    options: FetchOptions = {}
  ): Promise<T> {
    const data = await this.fetchTMDB<T>(endpoint, params, options);

    // Validate paginated response structure
    try {
      TMDBPaginatedResponseSchema.parse(data);
    } catch (error) {
      throw new ValidationError('Invalid TMDB paginated response structure', {
        endpoint,
        error: error instanceof Error ? error.message : String(error),
        receivedData: data,
      });
    }

    return data;
  }

  /**
   * Fetch TMDB details (single item)
   */
  async fetchDetails<T extends Record<string, any> = any>(
    endpoint: string,
    params: Record<string, any> = {},
    options: FetchOptions = {}
  ): Promise<T> {
    const data = await this.fetchTMDB<T>(endpoint, params, options);

    // Validate details response structure
    try {
      TMDBDetailsResponseSchema.parse(data);
    } catch (error) {
      throw new ValidationError('Invalid TMDB details response structure', {
        endpoint,
        error: error instanceof Error ? error.message : String(error),
        receivedData: data,
      });
    }

    return data;
  }

  /**
   * Popular movies
   */
  async getPopularMovies(page?: number, language: string = 'en-US') {
    return this.fetchPaginated('/movie/popular', {
      page: page ?? 1,
      language,
    });
  }

  /**
   * Popular shows
   */
  async getPopularShows(page?: number, language: string = 'en-US') {
    return this.fetchPaginated('/tv/popular', {
      page: page ?? 1,
      language,
    });
  }

  /**
   * Search movies
   */
  async searchMovies(query: string, page?: number, language: string = 'en-US') {
    return this.fetchPaginated('/search/movie', {
      query,
      page: page ?? 1,
      language,
    });
  }

  /**
   * Movies in theatres
   */
  async getMoviesInTheatres(page?: number, language: string = 'en-US') {
    return this.fetchPaginated('/movie/now_playing', {
      page: page ?? 1,
      language,
    });
  }

  /**
   * Search shows
   */
  async searchShows(query: string, page?: number, language: string = 'en-US') {
    return this.fetchPaginated('/search/tv', {
      query,
      page: page ?? 1,
      language,
    });
  }

  /**
   * Movie details
   */
  async getMovieDetails(movieId: string | number, language: string = 'en-US') {
    return this.fetchDetails(`/movie/${movieId}`, {
      language,
    });
  }

  /**
   * Show details
   */
  async getShowDetails(showId: string | number, language: string = 'en-US') {
    return this.fetchDetails(`/tv/${showId}`, {
      language,
    });
  }

  /**
   * Person details
   */
  async getPersonDetails(personId: string | number, language: string = 'en-US') {
    return this.fetchDetails(`/person/${personId}`, {
      language,
    });
  }

  /**
   * Popular people
   */
  async getPopularPeople(page?: number, language: string = 'en-US') {
    return this.fetchPaginated('/person/popular', {
      page: page ?? 1,
      language,
    });
  }

  /**
   * Search people
   */
  async searchPeople(query: string, page?: number, language: string = 'en-US') {
    return this.fetchPaginated('/search/person', {
      query,
      page: page ?? 1,
      language,
    });
  }

  /**
   * Person's known for movies
   */
  async getPersonMovieCredits(personId: string | number, language: string = 'en-US') {
    return this.fetchTMDB(`/person/${personId}/movie_credits`, {
      language,
    });
  }

  /**
   * Person's known for shows
   */
  async getPersonShowCredits(personId: string | number, language: string = 'en-US') {
    return this.fetchTMDB(`/person/${personId}/tv_credits`, {
      language,
    });
  }

  /**
   * Movie credits/cast
   */
  async getMovieCredits(movieId: string | number, language: string = 'en-US') {
    return this.fetchTMDB(`/movie/${movieId}/credits`, {
      language,
    });
  }

  /**
   * Show credits/cast
   */
  async getShowCredits(showId: string | number, language: string = 'en-US') {
    return this.fetchTMDB(`/tv/${showId}/credits`, {
      language,
    });
  }

  /**
   * Episode details
   */
  async getEpisodeDetails(
    showId: string | number,
    seasonNum: number,
    episodeNum: number,
    language: string = 'en-US'
  ) {
    return this.fetchDetails(`/tv/${showId}/season/${seasonNum}/episode/${episodeNum}`, {
      language,
    });
  }

  /**
   * Season details
   */
  async getSeasonDetails(showId: string | number, seasonNum: number, language: string = 'en-US') {
    return this.fetchDetails(`/tv/${showId}/season/${seasonNum}`, {
      language,
    });
  }

  /**
   * Top rated movies
   */
  async getTopRatedMovies(page?: number, language: string = 'en-US') {
    return this.fetchPaginated('/movie/top_rated', {
      page: page ?? 1,
      language,
    });
  }

  /**
   * Top rated shows
   */
  async getTopRatedShows(page?: number, language: string = 'en-US') {
    return this.fetchPaginated('/tv/top_rated', {
      page: page ?? 1,
      language,
    });
  }

  /**
   * Recommended movies
   */
  async getRecommendedMovies(movieId: string | number, page?: number) {
    return this.fetchPaginated(`/movie/${movieId}/recommendations`, {
      page: page ?? 1,
    });
  }

  /**
   * Recommended shows
   */
  async getRecommendedShows(showId: string | number, page?: number) {
    return this.fetchPaginated(`/tv/${showId}/recommendations`, {
      page: page ?? 1,
    });
  }

  /**
   * Genre list for movies
   */
  async getMovieGenres(language: string = 'en-US') {
    return this.fetchTMDB('/genre/movie/list', {
      language,
    });
  }

  /**
   * Genre list for shows
   */
  async getShowGenres(language: string = 'en-US') {
    return this.fetchTMDB('/genre/tv/list', {
      language,
    });
  }

  /**
   * Search keyword
   */
  async searchKeyword(query: string) {
    return this.fetchPaginated('/search/keyword', {
      query,
    });
  }

  /**
   * Discover movies by keyword
   */
  async discoverMoviesByKeyword(keywordId: number, page?: number, language: string = 'en-US') {
    return this.fetchPaginated('/discover/movie', {
      with_keywords: keywordId,
      sort_by: 'popularity.desc',
      page: page ?? 1,
      language,
    });
  }

  async discoverMoviesByGenre(
    genreId: number,
    sortBy: string,
    page?: number,
    language: string = 'en-US'
  ) {
    return this.fetchPaginated('/discover/movie', {
      with_genres: genreId,
      sort_by: sortBy,
      page,
      language,
    });
  }

  /**
   * Discover shows by keyword
   */
  async discoverShowsByKeyword(keywordId: number, page?: number, language: string = 'en-US') {
    return this.fetchPaginated('/discover/tv', {
      with_keywords: keywordId,
      sort_by: 'popularity.desc',
      page: page ?? 1,
      language,
    });
  }

  async discoverShowsByGenre(
    genreId: number,
    sortBy: string,
    page?: number,
    language: string = 'en-US'
  ) {
    return this.fetchPaginated('/discover/tv', {
      with_genres: genreId,
      sort_by: sortBy,
      page,
      language,
    });
  }

  /**
   * Trending (all, movies, shows, people)
   */
  async getTrending(
    mediaType: 'all' | 'movie' | 'tv' | 'person',
    timeWindow: 'day' | 'week',
    page?: number
  ) {
    return this.fetchPaginated(`/trending/${mediaType}/${timeWindow}`, {
      page: page ?? 1,
    });
  }
}

/**
 * Default TMDB client instance
 */
export const tmdbClient = new TMDBClient();
