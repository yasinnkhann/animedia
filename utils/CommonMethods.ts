import unidecode from 'unidecode';
import _ from 'lodash';
import imageNotFound from '../assets/image-not-found.jpeg';
import { TContent, EnrichedMedia } from '@ts/types';
import {
  CLIENT_BASE_URL,
  THE_MOVIE_DB_BASE_IMG_URL,
  THE_MOVIE_DB_BASE_API_URL,
} from '../utils/constants';
type MovieGenreTypes = string;
type ShowGenreTypes = string;
type WatchStatusTypes = string;

import toast, { ToastPosition } from 'react-hot-toast';

type MovieDetailsGenre = { id: string; name: string };
type ShowDetailsGenre = { id: string; name: string };
import type { Movie, Show, Game, WatchStatus } from '@prisma/client';

export class CommonMethods {
  public static formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) {
      return undefined;
    }
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return undefined;
    }

    // Formats like: "Nov 12, 2024" (locked to UTC to prevent SSR hydration mismatch on YYYY-MM-DD strings)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  };

  public static getDetailsPageRoute = (mediaType: TContent, id: string | number, title: string) => {
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
    const cleanPath = imagePath.trim();
    if (cleanPath.startsWith('//')) {
      return `https:${cleanPath}`;
    }
    return cleanPath;
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
    userMatchedMedias: (Show | Movie | Game | EnrichedMedia)[],
    item: {
      id: string | number;
      mediaType?: string;
      [key: string]: any;
    }
  ) => {
    const dataFound = userMatchedMedias.find((data: any) => {
      if (String(data.id) !== String(item.id)) return false;

      let dataType = 'unknown';
      if ('mediaType' in data && data.mediaType) {
        dataType = data.mediaType.toLowerCase();
      } else if ('current_episode' in data) {
        dataType = 'show';
      } else if (
        'status' in data &&
        (data.status === 'PLAYING' ||
          data.status === 'PLAYED' ||
          data.status === 'PLAN_TO_PLAY' ||
          data.status === 'NOT_PLAYING')
      ) {
        dataType = 'game';
      } else if ('status' in data) {
        dataType = 'movie';
      }

      const itemType = (item.mediaType || item.type)?.toLowerCase();
      if (itemType) {
        return dataType === itemType || dataType === 'unknown';
      }

      return true;
    });

    if (dataFound) {
      const mediaData = dataFound as any;
      if (mediaData.status) {
        switch (mediaData.status) {
          case 'WATCHING':
          case 'PLAYING':
            return 'W';
          case 'COMPLETED':
          case 'PLAYED':
            return 'C';
          case 'PLAN_TO_WATCH':
          case 'PLAN_TO_PLAY':
            return 'PW';
          case 'ON_HOLD':
            return 'OH';
          default:
            return 'D';
        }
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
    'playing',
    'completed',
    'played',
    'on-hold',
    'dropped',
    'plan-to-watch',
    'plan-to-play',
    'wishlist',
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

  public static watchStatusFromParam = (statusParam: string): WatchStatus | undefined => {
    switch (statusParam) {
      case 'watching':
      case 'playing':
        return 'WATCHING';
      case 'completed':
        return 'COMPLETED';
      case 'on-hold':
        return 'ON_HOLD';
      case 'dropped':
        return 'DROPPED';
      case 'plan-to-watch':
      case 'plan-to-play':
      case 'wishlist':
        return 'PLAN_TO_WATCH';
      default:
        return undefined;
    }
  };

  public static getAiredEpisodeCount = (showDetails: any): number | null => {
    if (!showDetails?.number_of_episodes) {
      return null;
    }

    let totalEpCount: number = showDetails.number_of_episodes;

    if (Array.isArray(showDetails.seasons)) {
      const currDate = new Date();
      for (let i = showDetails.seasons.length - 1; i > -1; i--) {
        const season = showDetails.seasons[i];
        if (
          season?.name?.startsWith('Season') &&
          season.season_number !== 0 &&
          (!season.air_date || currDate.getTime() < new Date(season.air_date).getTime())
        ) {
          totalEpCount -= season.episode_count;
        }
      }
    }

    return totalEpCount;
  };
}
