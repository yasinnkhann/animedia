import unidecode from 'unidecode';
import _ from 'lodash';
import imageNotFound from '../assets/image-not-found.jpeg';
import { TContent } from '@ts/types';
import {
  CLIENT_BASE_URL,
  THE_MOVIE_DB_BASE_IMG_URL,
  THE_MOVIE_DB_BASE_API_URL,
} from '../utils/constants';
import type {
  MovieDetailsQuery,
  MovieGenreTypes,
  ShowDetailsQuery,
  ShowGenreTypes,
  UsersGamesQuery,
  UsersMoviesQuery,
  UsersShowsQuery,
  WatchStatusTypes,
} from '@/graphql/generated/code-gen/graphql';
import toast, { ToastPosition } from 'react-hot-toast';

type MovieDetailsGenre = MovieDetailsQuery['movieDetails']['genres'][number];
type ShowDetailsGenre = ShowDetailsQuery['showDetails']['genres'][number];
type UserMovie = NonNullable<NonNullable<UsersMoviesQuery['usersMovies']>[number]>;
type UserShow = NonNullable<NonNullable<UsersShowsQuery['usersShows']>[number]>;
type UserGame = NonNullable<NonNullable<UsersGamesQuery['usersGames']>[number]>;

export class CommonMethods {
  public static formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) {
      return undefined;
    }
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return undefined;
    }

    // Formats like: "Nov 12, 2024"
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  public static getDetailsPageRoute = (mediaType: TContent, id: string, title: string) => {
    const cleanTitle = unidecode(title)
      .toLowerCase()
      .replace(/[^\w\s'_]+/g, '-')
      .replace(/\s+/g, '-')
      .replace(/_+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/'/g, '');
    return `${CLIENT_BASE_URL}/${mediaType}/${id}-${cleanTitle}`;
  };

  public static getGenreID = async (
    genreName: `${MovieGenreTypes}` | `${ShowGenreTypes}`,
    mediaType: 'movie' | 'tv'
  ): Promise<string> => {
    type TGenreObj = MovieDetailsGenre | ShowDetailsGenre;

    const parsedGenreName = genreName
      .replace(/_/gi, ' ')
      .replace(/AMPERSAND/gi, '&')
      .replace(/DASH/gi, '-');

    try {
      const res = await fetch(
        `${THE_MOVIE_DB_BASE_API_URL}/genre/${mediaType}/list?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US`
      );
      const { genres }: { genres: TGenreObj[] } = await res.json();

      const genreObj = genres.find(genreObj => genreObj.name === parsedGenreName);

      if (!genreObj?.id) {
        throw new Error('No Genre ID Found.');
      }
      return genreObj.id;
    } catch (err) {
      throw err;
    }
  };

  public static getTheMovieDbImage = (imagePath: string | null | undefined) => {
    if (imagePath) {
      return THE_MOVIE_DB_BASE_IMG_URL + imagePath;
    }
    return imageNotFound;
  };

  public static getIgdbImage = (imagePath: string | null | undefined) => {
    if (!imagePath) {
      return imageNotFound;
    }
    return imagePath;
  };

  public static getKeywordId = async (q: string) => {
    type TKeywordObj = MovieDetailsGenre | ShowDetailsGenre;
    q = q.split(' ').join('+');

    try {
      const res = await fetch(
        `${THE_MOVIE_DB_BASE_API_URL}/search/keyword?api_key=${process.env.THE_MOVIE_DB_API_KEY}&query=${q}`
      );
      const { results }: { results: TKeywordObj[] } = await res.json();
      if (_.isEmpty(results)) {
        throw new Error('No Keyword Results Found.');
      }
      return results[0].id;
    } catch (err) {
      throw err;
    }
  };

  public static getTrendingMedia = async (
    mediaType: 'all' | 'movie' | 'tv' | 'person',
    timeWindow: 'day' | 'week',
    pageNum: number | null
  ) => {
    try {
      const res = await fetch(
        `${THE_MOVIE_DB_BASE_API_URL}/trending/${mediaType}/${timeWindow}?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=${pageNum}`
      );
      const data = await res.json();

      return data;
    } catch (err) {
      throw err;
    }
  };

  public static getUserStatusFromMedia = (
    userMatchedMedias: (UserShow | UserMovie | UserGame)[],
    item: {
      id: string;
      [key: string]: any;
    }
  ) => {
    const dataFound = userMatchedMedias.find(
      (data: UserShow | UserMovie | UserGame) => data.id === item.id
    );

    if (dataFound) {
      if ('status' in dataFound) {
        switch (dataFound.status) {
          case 'WATCHING':
            return 'W';
          case 'COMPLETED':
            return 'C';
          case 'PLAN_TO_WATCH':
            return 'PW';
          case 'ON_HOLD':
            return 'OH';
          default:
            return 'D';
        }
      }

      if ('wishlist' in dataFound) {
        return 'WL';
      }
    }

    return undefined;
  };

  public static isValidEmail = (email = '') => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    return emailRegex.test(email);
  };

  public static renderTableStatus = (status: WatchStatusTypes) => {
    switch (status) {
      case 'WATCHING':
        return 'Watching';
      case 'COMPLETED':
        return 'Completed';
      case 'PLAN_TO_WATCH':
        return 'Plan to Watch';
      case 'ON_HOLD':
        return 'On Hold';
      default:
        return 'Dropped';
    }
  };

  public static statusParams: Set<string> = new Set([
    'watching',
    'completed',
    'on-hold',
    'dropped',
    'plan-to-watch',
  ]);

  public static unParseSpecialChars = (str: string) => {
    return str.replace(/DASH/gi, '-').replace(/_ampersand_/gi, ' & ');
  };

  public static getWatchStatusBackgroundColor = (
    status: ReturnType<typeof CommonMethods.getUserStatusFromMedia>
  ) => {
    switch (status) {
      case 'W':
        return 'bg-green-500';
      case 'C':
        return 'bg-yellow-500';
      case 'PW':
        return 'bg-blue-500';
      case 'OH':
        return 'bg-orange-500';
      case 'D':
        return 'bg-red-500';
      case 'WL':
        return 'bg-purple-500';
      default:
        return '';
    }
  };

  public static toTitleCase = (str: string) => {
    str = str.replace(/_/g, ' ');

    const words = str.split(' ');

    const titleCaseWords = words.map(
      word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    return titleCaseWords.join(' ');
  };

  public static notifyError = (error: string, position: ToastPosition, duration: number) => {
    toast.error(error, {
      position,
      duration,
    });
  };

  /**
   * Safely extracts the first property from a GraphQL response object,
   * ignoring the __typename property added by Apollo Client.
   */
  public static extractGraphQLData = <T extends Record<string, any>>(data: T) => {
    const key = Object.keys(data).find(k => k !== '__typename');
    return key ? data[key] : undefined;
  };
}
