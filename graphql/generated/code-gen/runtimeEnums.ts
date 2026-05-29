// Runtime enum objects (const objects that can be used as both type and value)

export const MovieGenreTypes = {
  Action: 'Action',
  Adventure: 'Adventure',
  Animation: 'Animation',
  Comedy: 'Comedy',
  Crime: 'Crime',
  Documentary: 'Documentary',
  Drama: 'Drama',
  Family: 'Family',
  Fantasy: 'Fantasy',
  History: 'History',
  Horror: 'Horror',
  Music: 'Music',
  Mystery: 'Mystery',
  Romance: 'Romance',
  Science_Fiction: 'Science_Fiction',
  TV_Movie: 'TV_Movie',
  Thriller: 'Thriller',
  War: 'War',
  Western: 'Western',
} as const;

export type MovieGenreTypes = typeof MovieGenreTypes[keyof typeof MovieGenreTypes];

export const ShowGenreTypes = {
  ActionAmpersandAdventure: 'Action_AMPERSAND_Adventure',
  Animation: 'Animation',
  Comedy: 'Comedy',
  Crime: 'Crime',
  Documentary: 'Documentary',
  Drama: 'Drama',
  Family: 'Family',
  Kids: 'Kids',
  Mystery: 'Mystery',
  News: 'News',
  Reality: 'Reality',
  SciDASHFiAmpersandFantasy: 'SciDASHFi_AMPERSAND_Fantasy',
  Soap: 'Soap',
  Talk: 'Talk',
  WarAmpersandPolitics: 'War_AMPERSAND_Politics',
  Western: 'Western',
} as const;

export type ShowGenreTypes = typeof ShowGenreTypes[keyof typeof ShowGenreTypes];

export const TimeWindowTypes = {
  Day: 'day',
  Week: 'week',
} as const;

export type TimeWindowTypes = typeof TimeWindowTypes[keyof typeof TimeWindowTypes];

export const WatchStatusTypes = {
  Completed: 'COMPLETED',
  Dropped: 'DROPPED',
  NotWatching: 'NOT_WATCHING',
  OnHold: 'ON_HOLD',
  PlanToWatch: 'PLAN_TO_WATCH',
  Watching: 'WATCHING',
} as const;

export type WatchStatusTypes = typeof WatchStatusTypes[keyof typeof WatchStatusTypes];

// ---------------------------------------------------------------------------
// Derived type aliases for types no longer directly exported from graphql.ts
// ---------------------------------------------------------------------------

import type {
  UsersMovieQuery,
  UsersShowQuery,
  UsersGameQuery,
  PopularMoviesQuery,
  PopularShowsQuery,
  SearchedGamesQuery,
  SearchedPeopleQuery,
  MovieDetailsQuery,
  ShowDetailsQuery,
  MoviesCastCrewQuery,
  ShowsCastCrewQuery,
  PopularMoviesByGenreQuery,
  TopRatedMoviesByGenreQuery,
  PopularShowsByGenreQuery,
  TopRatedShowsByGenreQuery,
  PopularGamesByGenreQuery,
  TopRatedGamesByGenreQuery,
} from './graphql';

/** The shape of a user's tracked movie entry */
export type UserMovie = NonNullable<UsersMovieQuery['usersMovie']>;

/** The shape of a user's tracked show entry */
export type UserShow = NonNullable<UsersShowQuery['usersShow']>;

/** The shape of a user's tracked game entry */
export type UserGame = NonNullable<UsersGameQuery['usersGame']>;

/** A single movie result from list queries */
export type MovieResult = PopularMoviesQuery['popularMovies']['results'][number];

/** A single show result from list queries */
export type ShowResult = PopularShowsQuery['popularShows']['results'][number];

/** A single person result from search queries */
export type PersonResult = SearchedPeopleQuery['searchedPeople']['results'][number];

/** A single game result from search queries */
export type GameResult = SearchedGamesQuery['searchedGames']['results'][number];

/** Movies list response (has total_results, results, page, etc.) */
export type MoviesRes = PopularMoviesQuery['popularMovies'];

/** Shows list response */
export type ShowsRes = PopularShowsQuery['popularShows'];

/** People list response */
export type PeopleRes = SearchedPeopleQuery['searchedPeople'];

/** Games list response */
export type GamesRes = NonNullable<PopularGamesByGenreQuery['popularGamesByGenre']>;

/** Full show details response */
export type ShowDetailsRes = ShowDetailsQuery['showDetails'];

/** Genre object from movie details (id + name) */
export type MovieDetailsGenre = MovieDetailsQuery['movieDetails']['genres'][number];

/** Genre object from show details (id + name) */
export type ShowDetailsGenre = ShowDetailsQuery['showDetails']['genres'][number];

/** Nullable wrapper — mirrors the old Maybe<T> utility */
export type Maybe<T> = T | null;

/** Exact constraint helper (for use in TypedDocumentNode variable types) */
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

/** InputMaybe helper */
export type InputMaybe<T> = T | null | undefined;

/** TMoviesGenreData */
export type TMoviesGenreData =
  | PopularMoviesByGenreQuery['popularMoviesByGenre']
  | TopRatedMoviesByGenreQuery['topRatedMoviesByGenre'];

/** TShowsGenreData */
export type TShowsGenreData =
  | PopularShowsByGenreQuery['popularShowsByGenre']
  | TopRatedShowsByGenreQuery['topRatedShowsByGenre'];

/** TGamesGenreData */
export type TGamesGenreData =
  | NonNullable<PopularGamesByGenreQuery['popularGamesByGenre']>
  | NonNullable<TopRatedGamesByGenreQuery['topRatedGamesByGenre']>;
