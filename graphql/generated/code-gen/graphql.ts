/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type AccountVerifiedRes = {
  __typename?: 'AccountVerifiedRes';
  emailVerified?: Maybe<Scalars['DateTime']>;
  error?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

export type EpisodeDetailsRes = {
  __typename?: 'EpisodeDetailsRes';
  air_date?: Maybe<Scalars['String']>;
  crew?: Maybe<Array<Maybe<ShowsCrewModel>>>;
  episode_number?: Maybe<Scalars['Int']>;
  guest_stars?: Maybe<Array<Maybe<ShowsCastModel>>>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  overview?: Maybe<Scalars['String']>;
  production_code?: Maybe<Scalars['String']>;
  runtime?: Maybe<Scalars['Int']>;
  season_number?: Maybe<Scalars['Int']>;
  still_path?: Maybe<Scalars['String']>;
  vote_average?: Maybe<Scalars['Float']>;
  vote_count?: Maybe<Scalars['Int']>;
};

export type KnownForResult = {
  __typename?: 'KnownForResult';
  adult?: Maybe<Scalars['Boolean']>;
  backdrop_path?: Maybe<Scalars['String']>;
  genre_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  id?: Maybe<Scalars['Int']>;
  media_type?: Maybe<Scalars['String']>;
  original_language?: Maybe<Scalars['String']>;
  original_title?: Maybe<Scalars['String']>;
  overview?: Maybe<Scalars['String']>;
  poster_path?: Maybe<Scalars['String']>;
  release_date?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  video?: Maybe<Scalars['Boolean']>;
  vote_average?: Maybe<Scalars['Float']>;
  vote_count?: Maybe<Scalars['Int']>;
};

export type MovieDetailsGenre = {
  __typename?: 'MovieDetailsGenre';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type MovieDetailsProdCompany = {
  __typename?: 'MovieDetailsProdCompany';
  id: Scalars['Int'];
  logo_path?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  origin_country: Scalars['String'];
};

export type MovieDetailsProdCountry = {
  __typename?: 'MovieDetailsProdCountry';
  iso_3166_1: Scalars['String'];
  name: Scalars['String'];
};

export type MovieDetailsRes = {
  __typename?: 'MovieDetailsRes';
  adult: Scalars['Boolean'];
  backdrop_path?: Maybe<Scalars['String']>;
  genres: Array<MovieDetailsGenre>;
  homepage: Scalars['String'];
  id: Scalars['Int'];
  imdb_id?: Maybe<Scalars['String']>;
  original_language: Scalars['String'];
  original_title: Scalars['String'];
  overview: Scalars['String'];
  popularity: Scalars['Float'];
  poster_path?: Maybe<Scalars['String']>;
  production_companies: Array<Maybe<MovieDetailsProdCompany>>;
  production_countries: Array<Maybe<MovieDetailsProdCountry>>;
  release_date?: Maybe<Scalars['String']>;
  revenue?: Maybe<Scalars['BigInt']>;
  runtime?: Maybe<Scalars['Int']>;
  spoken_languages: Array<Maybe<MovieDetailsSpokenLang>>;
  status: Scalars['String'];
  tagline: Scalars['String'];
  title: Scalars['String'];
  video?: Maybe<Scalars['Boolean']>;
  vote_average: Scalars['Float'];
  vote_count: Scalars['Int'];
};

export type MovieDetailsSpokenLang = {
  __typename?: 'MovieDetailsSpokenLang';
  english_name: Scalars['String'];
  iso_639_1: Scalars['String'];
  name: Scalars['String'];
};

export enum MovieGenreTypes {
  Action = 'Action',
  Adventure = 'Adventure',
  Animation = 'Animation',
  Comedy = 'Comedy',
  Crime = 'Crime',
  Documentary = 'Documentary',
  Drama = 'Drama',
  Family = 'Family',
  Fantasy = 'Fantasy',
  History = 'History',
  Horror = 'Horror',
  Music = 'Music',
  Mystery = 'Mystery',
  Romance = 'Romance',
  ScienceFiction = 'Science_Fiction',
  TvMovie = 'TV_Movie',
  Thriller = 'Thriller',
  War = 'War',
  Western = 'Western'
}

export type MovieResult = {
  __typename?: 'MovieResult';
  adult: Scalars['Boolean'];
  backdrop_path?: Maybe<Scalars['String']>;
  genre_ids: Array<Maybe<Scalars['Int']>>;
  id: Scalars['Int'];
  original_language: Scalars['String'];
  original_title: Scalars['String'];
  overview: Scalars['String'];
  popularity: Scalars['Float'];
  poster_path?: Maybe<Scalars['String']>;
  release_date?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  video: Scalars['Boolean'];
  vote_average: Scalars['Float'];
  vote_count: Scalars['Int'];
};

export type MovieReviewAuthorDetails = {
  __typename?: 'MovieReviewAuthorDetails';
  avatar_path?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  rating?: Maybe<Scalars['Float']>;
  username: Scalars['String'];
};

export type MovieReviewsRes = {
  __typename?: 'MovieReviewsRes';
  id: Scalars['Int'];
  page: Scalars['Int'];
  results: Array<Maybe<MovieReviewsResult>>;
  total_pages: Scalars['Int'];
  total_results: Scalars['Int'];
};

export type MovieReviewsResult = {
  __typename?: 'MovieReviewsResult';
  author: Scalars['String'];
  author_details: MovieReviewAuthorDetails;
  content: Scalars['String'];
  created_at: Scalars['String'];
  id: Scalars['String'];
  updated_at: Scalars['String'];
  url: Scalars['String'];
};

export type MoviesCastCrewRes = {
  __typename?: 'MoviesCastCrewRes';
  cast?: Maybe<Array<Maybe<MoviesCastModel>>>;
  crew?: Maybe<Array<Maybe<MoviesCrewModel>>>;
  id?: Maybe<Scalars['Int']>;
};

export type MoviesCastModel = {
  __typename?: 'MoviesCastModel';
  adult?: Maybe<Scalars['Boolean']>;
  cast_id?: Maybe<Scalars['Int']>;
  character?: Maybe<Scalars['String']>;
  credit_id?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  known_for_department?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['Int']>;
  original_name?: Maybe<Scalars['String']>;
  popularity?: Maybe<Scalars['Float']>;
  profile_path?: Maybe<Scalars['String']>;
};

export type MoviesCrewModel = {
  __typename?: 'MoviesCrewModel';
  adult?: Maybe<Scalars['Boolean']>;
  credit_id?: Maybe<Scalars['String']>;
  department?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  job?: Maybe<Scalars['String']>;
  known_for_department?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  original_name?: Maybe<Scalars['String']>;
  popularity?: Maybe<Scalars['Float']>;
  profile_path?: Maybe<Scalars['String']>;
};

export type MoviesInTheatresRes = {
  __typename?: 'MoviesInTheatresRes';
  dates: TheatreDates;
  page: Scalars['String'];
  results: Array<Maybe<MovieResult>>;
  total_pages: Scalars['Int'];
  total_results: Scalars['Int'];
};

export type MoviesRes = {
  __typename?: 'MoviesRes';
  page: Scalars['Int'];
  results: Array<MovieResult>;
  total_pages: Scalars['Int'];
  total_results: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMovie?: Maybe<UserMovie>;
  addShow?: Maybe<UserShow>;
  deleteEmailVerificationToken?: Maybe<RedisRes>;
  deleteMovie?: Maybe<UserMovie>;
  deleteShow?: Maybe<UserShow>;
  registerUser?: Maybe<RegisteredUserRes>;
  sendVerificationEmail?: Maybe<NodeRes>;
  updateMovie?: Maybe<UserMovie>;
  updateShow?: Maybe<UserShow>;
  verifyUserEmail?: Maybe<Scalars['Int']>;
  writeEmailVerificationToken?: Maybe<RedisRes>;
  writeRetryEmailVerificationLimit?: Maybe<RedisRes>;
};


export type MutationAddMovieArgs = {
  movieId: Scalars['ID'];
  movieName: Scalars['String'];
  watchStatus: WatchStatusTypes;
};


export type MutationAddShowArgs = {
  currentEpisode?: InputMaybe<Scalars['Int']>;
  showId: Scalars['ID'];
  showName: Scalars['String'];
  watchStatus: WatchStatusTypes;
};


export type MutationDeleteEmailVerificationTokenArgs = {
  token: Scalars['String'];
};


export type MutationDeleteMovieArgs = {
  movieId: Scalars['ID'];
};


export type MutationDeleteShowArgs = {
  showId: Scalars['ID'];
};


export type MutationRegisterUserArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSendVerificationEmailArgs = {
  html: Scalars['String'];
  recipientEmail: Scalars['String'];
  subject: Scalars['String'];
  text: Scalars['String'];
};


export type MutationUpdateMovieArgs = {
  movieId: Scalars['ID'];
  movieRating?: InputMaybe<Scalars['Int']>;
  watchStatus: WatchStatusTypes;
};


export type MutationUpdateShowArgs = {
  currentEpisode?: InputMaybe<Scalars['Int']>;
  showId: Scalars['ID'];
  showRating?: InputMaybe<Scalars['Int']>;
  watchStatus: WatchStatusTypes;
};


export type MutationVerifyUserEmailArgs = {
  userId: Scalars['ID'];
};


export type MutationWriteEmailVerificationTokenArgs = {
  email: Scalars['String'];
};


export type MutationWriteRetryEmailVerificationLimitArgs = {
  email: Scalars['String'];
};

export type NodeRes = {
  __typename?: 'NodeRes';
  error?: Maybe<Scalars['String']>;
  ok?: Maybe<Scalars['Boolean']>;
  statusCode?: Maybe<Scalars['Int']>;
  successMsg?: Maybe<Scalars['String']>;
};

export type PeopleRes = {
  __typename?: 'PeopleRes';
  page: Scalars['Int'];
  results: Array<PersonResult>;
  total_pages: Scalars['Int'];
  total_results: Scalars['Int'];
};

export type PersonDetailsRes = {
  __typename?: 'PersonDetailsRes';
  adult?: Maybe<Scalars['Boolean']>;
  also_known_as?: Maybe<Array<Maybe<Scalars['String']>>>;
  biography?: Maybe<Scalars['String']>;
  birthday?: Maybe<Scalars['String']>;
  deathday?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['Int']>;
  homepage?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  imdb_id?: Maybe<Scalars['String']>;
  known_for_department?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  place_of_birth?: Maybe<Scalars['String']>;
  popularity?: Maybe<Scalars['Float']>;
  profile_path?: Maybe<Scalars['String']>;
};

export type PersonResult = {
  __typename?: 'PersonResult';
  adult: Scalars['Boolean'];
  gender: Scalars['Int'];
  id: Scalars['Int'];
  known_for: Array<KnownForResult>;
  known_for_department?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  popularity: Scalars['Float'];
  profile_path?: Maybe<Scalars['String']>;
};

export type PersonsKnownForMovieCast = {
  __typename?: 'PersonsKnownForMovieCast';
  adult: Scalars['Boolean'];
  backdrop_path?: Maybe<Scalars['String']>;
  character?: Maybe<Scalars['String']>;
  credit_id?: Maybe<Scalars['ID']>;
  genre_ids: Array<Maybe<Scalars['Int']>>;
  id: Scalars['Int'];
  order?: Maybe<Scalars['Int']>;
  original_language: Scalars['String'];
  original_title: Scalars['String'];
  overview: Scalars['String'];
  popularity: Scalars['Float'];
  poster_path?: Maybe<Scalars['String']>;
  release_date?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  video: Scalars['Boolean'];
  vote_average: Scalars['Float'];
  vote_count: Scalars['Int'];
};

export type PersonsKnownForMovieCrew = {
  __typename?: 'PersonsKnownForMovieCrew';
  adult: Scalars['Boolean'];
  backdrop_path?: Maybe<Scalars['String']>;
  credit_id?: Maybe<Scalars['ID']>;
  department?: Maybe<Scalars['String']>;
  genre_ids: Array<Maybe<Scalars['Int']>>;
  id: Scalars['Int'];
  job?: Maybe<Scalars['String']>;
  original_language: Scalars['String'];
  original_title: Scalars['String'];
  overview: Scalars['String'];
  popularity: Scalars['Float'];
  poster_path?: Maybe<Scalars['String']>;
  release_date?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  video: Scalars['Boolean'];
  vote_average: Scalars['Float'];
  vote_count: Scalars['Int'];
};

export type PersonsKnownForMovieRes = {
  __typename?: 'PersonsKnownForMovieRes';
  cast: Array<Maybe<PersonsKnownForMovieCast>>;
  crew: Array<Maybe<PersonsKnownForMovieCrew>>;
  id?: Maybe<Scalars['Int']>;
};

export type PersonsKnownForShowCast = {
  __typename?: 'PersonsKnownForShowCast';
  adult: Scalars['Boolean'];
  backdrop_path?: Maybe<Scalars['String']>;
  character?: Maybe<Scalars['String']>;
  credit_id?: Maybe<Scalars['ID']>;
  episode_count?: Maybe<Scalars['Int']>;
  first_air_date?: Maybe<Scalars['String']>;
  genre_ids: Array<Maybe<Scalars['Int']>>;
  id: Scalars['Int'];
  name: Scalars['String'];
  origin_country: Array<Maybe<Scalars['String']>>;
  original_language: Scalars['String'];
  original_name: Scalars['String'];
  overview: Scalars['String'];
  popularity: Scalars['Float'];
  poster_path?: Maybe<Scalars['String']>;
  vote_average: Scalars['Float'];
  vote_count: Scalars['Int'];
};

export type PersonsKnownForShowCrew = {
  __typename?: 'PersonsKnownForShowCrew';
  adult: Scalars['Boolean'];
  backdrop_path?: Maybe<Scalars['String']>;
  credit_id?: Maybe<Scalars['ID']>;
  department?: Maybe<Scalars['String']>;
  episode_count?: Maybe<Scalars['Int']>;
  first_air_date?: Maybe<Scalars['String']>;
  genre_ids: Array<Maybe<Scalars['Int']>>;
  id: Scalars['Int'];
  job?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  origin_country: Array<Maybe<Scalars['String']>>;
  original_language: Scalars['String'];
  original_name: Scalars['String'];
  overview: Scalars['String'];
  popularity: Scalars['Float'];
  poster_path?: Maybe<Scalars['String']>;
  vote_average: Scalars['Float'];
  vote_count: Scalars['Int'];
};

export type PersonsKnownForShowRes = {
  __typename?: 'PersonsKnownForShowRes';
  cast: Array<Maybe<PersonsKnownForShowCast>>;
  crew: Array<Maybe<PersonsKnownForShowCrew>>;
  id?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  accountVerified?: Maybe<AccountVerifiedRes>;
  checkEmailVerificationToken?: Maybe<RedisRes>;
  checkRetryEmailVerificationLimit?: Maybe<RedisRes>;
  emailFromRedisToken?: Maybe<Scalars['String']>;
  episodeDetails?: Maybe<EpisodeDetailsRes>;
  movieDetails: MovieDetailsRes;
  movieReviews: MovieReviewsRes;
  moviesCastCrew?: Maybe<MoviesCastCrewRes>;
  moviesInTheatres: MoviesInTheatresRes;
  personDetails: PersonDetailsRes;
  personsKnownForMovieRes: PersonsKnownForMovieRes;
  personsKnownForShowRes: PersonsKnownForShowRes;
  popularAnimeMovies: MoviesRes;
  popularAnimeShows: ShowsRes;
  popularMovies: MoviesRes;
  popularMoviesByGenre: MoviesRes;
  popularPeople: PeopleRes;
  popularShows: ShowsRes;
  popularShowsByGenre: ShowsRes;
  recommendedMovies: MoviesRes;
  recommendedShows: ShowsRes;
  searchedMovies: MoviesRes;
  searchedPeople: PeopleRes;
  searchedShows: ShowsRes;
  showDetails: ShowDetailsRes;
  showReviews: ShowReviewRes;
  showsCastCrew?: Maybe<ShowsCastCrewRes>;
  topRatedMovies: MoviesRes;
  topRatedMoviesByGenre: MoviesRes;
  topRatedShows: ShowsRes;
  topRatedShowsByGenre: ShowsRes;
  trendingMovies: MoviesRes;
  trendingShows: ShowsRes;
  user?: Maybe<UserRes>;
  usersMovie?: Maybe<UserMovie>;
  usersMovies?: Maybe<Array<Maybe<UserMovie>>>;
  usersShow?: Maybe<UserShow>;
  usersShows?: Maybe<Array<Maybe<UserShow>>>;
};


export type QueryAccountVerifiedArgs = {
  email: Scalars['String'];
};


export type QueryCheckEmailVerificationTokenArgs = {
  token: Scalars['String'];
};


export type QueryCheckRetryEmailVerificationLimitArgs = {
  email: Scalars['String'];
};


export type QueryEmailFromRedisTokenArgs = {
  token: Scalars['String'];
};


export type QueryEpisodeDetailsArgs = {
  episodeNum: Scalars['Int'];
  seasonNum: Scalars['Int'];
  showId: Scalars['Int'];
};


export type QueryMovieDetailsArgs = {
  movieDetailsId: Scalars['Int'];
};


export type QueryMovieReviewsArgs = {
  id: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryMoviesCastCrewArgs = {
  movieId: Scalars['Int'];
};


export type QueryMoviesInTheatresArgs = {
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryPersonDetailsArgs = {
  personDetailsId: Scalars['Int'];
};


export type QueryPersonsKnownForMovieResArgs = {
  personsKnownForMovieResId: Scalars['Int'];
};


export type QueryPersonsKnownForShowResArgs = {
  personsKnownForShowResId: Scalars['Int'];
};


export type QueryPopularAnimeMoviesArgs = {
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryPopularAnimeShowsArgs = {
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryPopularMoviesArgs = {
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryPopularMoviesByGenreArgs = {
  genre: MovieGenreTypes;
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryPopularPeopleArgs = {
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryPopularShowsArgs = {
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryPopularShowsByGenreArgs = {
  genre: ShowGenreTypes;
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryRecommendedMoviesArgs = {
  page?: InputMaybe<Scalars['Int']>;
  recommendedMoviesId: Scalars['Int'];
};


export type QueryRecommendedShowsArgs = {
  page?: InputMaybe<Scalars['Int']>;
  recommendedShowsId: Scalars['Int'];
};


export type QuerySearchedMoviesArgs = {
  page?: InputMaybe<Scalars['Int']>;
  q: Scalars['String'];
};


export type QuerySearchedPeopleArgs = {
  page?: InputMaybe<Scalars['Int']>;
  q: Scalars['String'];
};


export type QuerySearchedShowsArgs = {
  page?: InputMaybe<Scalars['Int']>;
  q: Scalars['String'];
};


export type QueryShowDetailsArgs = {
  showDetailsId: Scalars['Int'];
};


export type QueryShowReviewsArgs = {
  id: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryShowsCastCrewArgs = {
  showId: Scalars['Int'];
};


export type QueryTopRatedMoviesArgs = {
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryTopRatedMoviesByGenreArgs = {
  genre: MovieGenreTypes;
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryTopRatedShowsArgs = {
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryTopRatedShowsByGenreArgs = {
  genre: ShowGenreTypes;
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryTrendingMoviesArgs = {
  page?: InputMaybe<Scalars['Int']>;
  timeWindow: TimeWindowTypes;
};


export type QueryTrendingShowsArgs = {
  page?: InputMaybe<Scalars['Int']>;
  timeWindow: TimeWindowTypes;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersMovieArgs = {
  movieId: Scalars['String'];
};


export type QueryUsersShowArgs = {
  showId: Scalars['String'];
};

export type RedisRes = {
  __typename?: 'RedisRes';
  error?: Maybe<Scalars['String']>;
  successMsg?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type RegisteredUserRes = {
  __typename?: 'RegisteredUserRes';
  createdUser?: Maybe<UserRes>;
  error?: Maybe<Scalars['String']>;
  ok?: Maybe<Scalars['Boolean']>;
  statusCode?: Maybe<Scalars['Int']>;
};

export type ShowDetailsCountry = {
  __typename?: 'ShowDetailsCountry';
  iso_3166_1: Scalars['String'];
  name: Scalars['String'];
};

export type ShowDetailsCreatedBy = {
  __typename?: 'ShowDetailsCreatedBy';
  credit_id?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  profile_path?: Maybe<Scalars['String']>;
};

export type ShowDetailsGenre = {
  __typename?: 'ShowDetailsGenre';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type ShowDetailsLastEpToAir = {
  __typename?: 'ShowDetailsLastEpToAir';
  air_date?: Maybe<Scalars['String']>;
  episode_number: Scalars['Int'];
  id: Scalars['Int'];
  name: Scalars['String'];
  overview: Scalars['String'];
  production_code: Scalars['String'];
  runtime?: Maybe<Scalars['Int']>;
  season_number: Scalars['Int'];
  show_id: Scalars['Int'];
  still_path?: Maybe<Scalars['String']>;
  vote_average: Scalars['Float'];
  vote_count: Scalars['Int'];
};

export type ShowDetailsNetwork = {
  __typename?: 'ShowDetailsNetwork';
  id: Scalars['Int'];
  logo_path?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  origin_country: Scalars['String'];
};

export type ShowDetailsNextEpToAir = {
  __typename?: 'ShowDetailsNextEpToAir';
  air_date?: Maybe<Scalars['String']>;
  episode_number: Scalars['Int'];
  id: Scalars['Int'];
  name: Scalars['String'];
  overview: Scalars['String'];
  production_code: Scalars['String'];
  runtime?: Maybe<Scalars['Int']>;
  season_number: Scalars['Int'];
  show_id: Scalars['Int'];
  still_path?: Maybe<Scalars['String']>;
  vote_average: Scalars['Float'];
  vote_count: Scalars['Int'];
};

export type ShowDetailsProdCompany = {
  __typename?: 'ShowDetailsProdCompany';
  id: Scalars['Int'];
  logo_path?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  origin_country: Scalars['String'];
};

export type ShowDetailsRes = {
  __typename?: 'ShowDetailsRes';
  adult: Scalars['Boolean'];
  backdrop_path?: Maybe<Scalars['String']>;
  created_by: Array<Maybe<ShowDetailsCreatedBy>>;
  episode_run_time: Array<Maybe<Scalars['Int']>>;
  first_air_date?: Maybe<Scalars['String']>;
  genres: Array<ShowDetailsGenre>;
  homepage: Scalars['String'];
  id: Scalars['Int'];
  in_production: Scalars['Boolean'];
  languages: Array<Maybe<Scalars['String']>>;
  last_air_date?: Maybe<Scalars['String']>;
  last_episode_to_air?: Maybe<ShowDetailsLastEpToAir>;
  name: Scalars['String'];
  networks: Array<ShowDetailsNetwork>;
  next_episode_to_air?: Maybe<ShowDetailsNextEpToAir>;
  number_of_episodes: Scalars['Int'];
  number_of_seasons: Scalars['Int'];
  origin_country: Array<Maybe<Scalars['String']>>;
  original_language: Scalars['String'];
  original_name: Scalars['String'];
  overview: Scalars['String'];
  popularity: Scalars['Float'];
  poster_path?: Maybe<Scalars['String']>;
  production_companies: Array<Maybe<ShowDetailsProdCompany>>;
  production_countries: Array<Maybe<ShowDetailsCountry>>;
  seasons: Array<Maybe<ShowDetailsSeason>>;
  spoken_languages: Array<Maybe<ShowDetailsSpokenLang>>;
  status: Scalars['String'];
  tagline: Scalars['String'];
  type: Scalars['String'];
  vote_average: Scalars['Float'];
  vote_count: Scalars['Int'];
};

export type ShowDetailsSeason = {
  __typename?: 'ShowDetailsSeason';
  air_date?: Maybe<Scalars['String']>;
  episode_count: Scalars['Int'];
  id: Scalars['Int'];
  name: Scalars['String'];
  overview: Scalars['String'];
  poster_path?: Maybe<Scalars['String']>;
  season_number: Scalars['Int'];
};

export type ShowDetailsSpokenLang = {
  __typename?: 'ShowDetailsSpokenLang';
  english_name: Scalars['String'];
  iso_639_1: Scalars['String'];
  name: Scalars['String'];
};

export enum ShowGenreTypes {
  ActionAmpersandAdventure = 'Action_AMPERSAND_Adventure',
  Animation = 'Animation',
  Comedy = 'Comedy',
  Crime = 'Crime',
  Documentary = 'Documentary',
  Drama = 'Drama',
  Family = 'Family',
  Kids = 'Kids',
  Mystery = 'Mystery',
  News = 'News',
  Reality = 'Reality',
  SciDashFiAmpersandFantasy = 'SciDASHFi_AMPERSAND_Fantasy',
  Soap = 'Soap',
  Talk = 'Talk',
  WarAmpersandPolitics = 'War_AMPERSAND_Politics',
  Western = 'Western'
}

export type ShowResult = {
  __typename?: 'ShowResult';
  backdrop_path?: Maybe<Scalars['String']>;
  first_air_date?: Maybe<Scalars['String']>;
  genre_ids: Array<Maybe<Scalars['Int']>>;
  id: Scalars['Int'];
  name: Scalars['String'];
  origin_country: Array<Maybe<Scalars['String']>>;
  original_language: Scalars['String'];
  original_name: Scalars['String'];
  overview: Scalars['String'];
  popularity: Scalars['Float'];
  poster_path?: Maybe<Scalars['String']>;
  vote_average: Scalars['Float'];
  vote_count: Scalars['Int'];
};

export type ShowReviewAuthorDetails = {
  __typename?: 'ShowReviewAuthorDetails';
  avatar_path?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  rating?: Maybe<Scalars['Float']>;
  username: Scalars['String'];
};

export type ShowReviewRes = {
  __typename?: 'ShowReviewRes';
  id: Scalars['Int'];
  page: Scalars['Int'];
  results: Array<Maybe<ShowReviewResult>>;
  total_pages: Scalars['Int'];
  total_results: Scalars['Int'];
};

export type ShowReviewResult = {
  __typename?: 'ShowReviewResult';
  author: Scalars['String'];
  author_details: ShowReviewAuthorDetails;
  content: Scalars['String'];
  created_at: Scalars['String'];
  id: Scalars['String'];
  updated_at: Scalars['String'];
  url: Scalars['String'];
};

export type ShowsCastCrewRes = {
  __typename?: 'ShowsCastCrewRes';
  cast?: Maybe<Array<Maybe<ShowsCastModel>>>;
  crew?: Maybe<Array<Maybe<ShowsCrewModel>>>;
  id?: Maybe<Scalars['Int']>;
};

export type ShowsCastModel = {
  __typename?: 'ShowsCastModel';
  adult?: Maybe<Scalars['Boolean']>;
  character?: Maybe<Scalars['String']>;
  credit_id?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  known_for_department?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['Int']>;
  original_name?: Maybe<Scalars['String']>;
  popularity?: Maybe<Scalars['Float']>;
  profile_path?: Maybe<Scalars['String']>;
};

export type ShowsCrewModel = {
  __typename?: 'ShowsCrewModel';
  adult?: Maybe<Scalars['Boolean']>;
  credit_id?: Maybe<Scalars['String']>;
  department?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  job?: Maybe<Scalars['String']>;
  known_for_department?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  original_name?: Maybe<Scalars['String']>;
  popularity?: Maybe<Scalars['Float']>;
  profile_path?: Maybe<Scalars['String']>;
};

export type ShowsRes = {
  __typename?: 'ShowsRes';
  page: Scalars['Int'];
  results: Array<ShowResult>;
  total_pages: Scalars['Int'];
  total_results: Scalars['Int'];
};

export type TheatreDates = {
  __typename?: 'TheatreDates';
  maximum: Scalars['String'];
  minimum: Scalars['String'];
};

export enum TimeWindowTypes {
  Day = 'day',
  Week = 'week'
}

export type UserMovie = {
  __typename?: 'UserMovie';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  rating?: Maybe<Scalars['Int']>;
  status?: Maybe<WatchStatusTypes>;
};

export type UserRes = {
  __typename?: 'UserRes';
  created_at?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  emailVerified?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  image?: Maybe<Scalars['String']>;
  movies?: Maybe<Array<Maybe<UserMovie>>>;
  name?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  shows?: Maybe<Array<Maybe<UserShow>>>;
};

export type UserShow = {
  __typename?: 'UserShow';
  current_episode?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  rating?: Maybe<Scalars['Int']>;
  status?: Maybe<WatchStatusTypes>;
};

export enum WatchStatusTypes {
  Completed = 'COMPLETED',
  Dropped = 'DROPPED',
  NotWatching = 'NOT_WATCHING',
  OnHold = 'ON_HOLD',
  PlanToWatch = 'PLAN_TO_WATCH',
  Watching = 'WATCHING'
}

export type AddedMovieMutationVariables = Exact<{
  movieId: Scalars['ID'];
  movieName: Scalars['String'];
  watchStatus: WatchStatusTypes;
}>;


export type AddedMovieMutation = { __typename?: 'Mutation', addMovie?: { __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null };

export type UpdatedMovieMutationVariables = Exact<{
  movieId: Scalars['ID'];
  watchStatus: WatchStatusTypes;
  movieRating?: InputMaybe<Scalars['Int']>;
}>;


export type UpdatedMovieMutation = { __typename?: 'Mutation', updateMovie?: { __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null };

export type DeletedMovieMutationVariables = Exact<{
  movieId: Scalars['ID'];
}>;


export type DeletedMovieMutation = { __typename?: 'Mutation', deleteMovie?: { __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null };

export type AddedShowMutationVariables = Exact<{
  showId: Scalars['ID'];
  showName: Scalars['String'];
  watchStatus: WatchStatusTypes;
  currentEpisode?: InputMaybe<Scalars['Int']>;
}>;


export type AddedShowMutation = { __typename?: 'Mutation', addShow?: { __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null };

export type UpdatedShowMutationVariables = Exact<{
  showId: Scalars['ID'];
  watchStatus: WatchStatusTypes;
  showRating?: InputMaybe<Scalars['Int']>;
  currentEpisode?: InputMaybe<Scalars['Int']>;
}>;


export type UpdatedShowMutation = { __typename?: 'Mutation', updateShow?: { __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null };

export type DeletedShowMutationVariables = Exact<{
  showId: Scalars['ID'];
}>;


export type DeletedShowMutation = { __typename?: 'Mutation', deleteShow?: { __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null };

export type WriteEmailVerificationTokenMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type WriteEmailVerificationTokenMutation = { __typename?: 'Mutation', writeEmailVerificationToken?: { __typename?: 'RedisRes', error?: string | null, successMsg?: string | null, token?: string | null, userId?: string | null } | null };

export type DeleteEmailVerificationTokenMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type DeleteEmailVerificationTokenMutation = { __typename?: 'Mutation', deleteEmailVerificationToken?: { __typename?: 'RedisRes', error?: string | null, successMsg?: string | null, token?: string | null, userId?: string | null } | null };

export type VerifyUserEmailMutationVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type VerifyUserEmailMutation = { __typename?: 'Mutation', verifyUserEmail?: number | null };

export type MutationMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type MutationMutation = { __typename?: 'Mutation', writeRetryEmailVerificationLimit?: { __typename?: 'RedisRes', error?: string | null, successMsg?: string | null, token?: string | null, userId?: string | null } | null };

export type SendVerificationEmailMutationVariables = Exact<{
  recipientEmail: Scalars['String'];
  subject: Scalars['String'];
  text: Scalars['String'];
  html: Scalars['String'];
}>;


export type SendVerificationEmailMutation = { __typename?: 'Mutation', sendVerificationEmail?: { __typename?: 'NodeRes', error?: string | null, successMsg?: string | null, ok?: boolean | null, statusCode?: number | null } | null };

export type RegisterUserMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser?: { __typename?: 'RegisteredUserRes', error?: string | null, ok?: boolean | null, statusCode?: number | null, createdUser?: { __typename?: 'UserRes', id?: string | null, name?: string | null, email?: string | null, password?: string | null, image?: string | null, created_at?: any | null, emailVerified?: any | null, movies?: Array<{ __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null> | null, shows?: Array<{ __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null> | null } | null } | null };

export type PopularMoviesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
}>;


export type PopularMoviesQuery = { __typename?: 'Query', popularMovies: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids: Array<number | null>, id: number, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, title: string, video: boolean, vote_average: number, vote_count: number }> } };

export type SearchedMoviesQueryVariables = Exact<{
  q: Scalars['String'];
  page?: InputMaybe<Scalars['Int']>;
}>;


export type SearchedMoviesQuery = { __typename?: 'Query', searchedMovies: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids: Array<number | null>, id: number, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, title: string, video: boolean, vote_average: number, vote_count: number }> } };

export type GetMovieDetailsQueryVariables = Exact<{
  movieDetailsId: Scalars['Int'];
}>;


export type GetMovieDetailsQuery = { __typename?: 'Query', movieDetails: { __typename?: 'MovieDetailsRes', adult: boolean, backdrop_path?: string | null, homepage: string, id: number, imdb_id?: string | null, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, revenue?: any | null, runtime?: number | null, status: string, tagline: string, title: string, video?: boolean | null, vote_average: number, vote_count: number, genres: Array<{ __typename?: 'MovieDetailsGenre', id: number, name: string }>, production_companies: Array<{ __typename?: 'MovieDetailsProdCompany', id: number, logo_path?: string | null, name: string, origin_country: string } | null>, production_countries: Array<{ __typename?: 'MovieDetailsProdCountry', iso_3166_1: string, name: string } | null>, spoken_languages: Array<{ __typename?: 'MovieDetailsSpokenLang', english_name: string, iso_639_1: string, name: string } | null> } };

export type PopularAnimeMoviesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
}>;


export type PopularAnimeMoviesQuery = { __typename?: 'Query', popularAnimeMovies: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids: Array<number | null>, id: number, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, title: string, video: boolean, vote_average: number, vote_count: number }> } };

export type TrendingMoviesQueryVariables = Exact<{
  timeWindow: TimeWindowTypes;
  page?: InputMaybe<Scalars['Int']>;
}>;


export type TrendingMoviesQuery = { __typename?: 'Query', trendingMovies: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids: Array<number | null>, id: number, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, title: string, video: boolean, vote_average: number, vote_count: number }> } };

export type TopRatedMoviesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
}>;


export type TopRatedMoviesQuery = { __typename?: 'Query', topRatedMovies: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids: Array<number | null>, id: number, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, title: string, video: boolean, vote_average: number, vote_count: number }> } };

export type RecommendedMoviesQueryVariables = Exact<{
  recommendedMoviesId: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
}>;


export type RecommendedMoviesQuery = { __typename?: 'Query', recommendedMovies: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids: Array<number | null>, id: number, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, title: string, video: boolean, vote_average: number, vote_count: number }> } };

export type MovieReviewsQueryVariables = Exact<{
  movieReviewsId: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
}>;


export type MovieReviewsQuery = { __typename?: 'Query', movieReviews: { __typename?: 'MovieReviewsRes', id: number, page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieReviewsResult', author: string, content: string, created_at: string, id: string, updated_at: string, url: string, author_details: { __typename?: 'MovieReviewAuthorDetails', name: string, username: string, avatar_path?: string | null, rating?: number | null } } | null> } };

export type MoviesInTheatresQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
}>;


export type MoviesInTheatresQuery = { __typename?: 'Query', moviesInTheatres: { __typename?: 'MoviesInTheatresRes', page: string, total_pages: number, total_results: number, dates: { __typename?: 'TheatreDates', maximum: string, minimum: string }, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids: Array<number | null>, id: number, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, title: string, video: boolean, vote_average: number, vote_count: number } | null> } };

export type PopularMoviesByGenreQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  genre: MovieGenreTypes;
}>;


export type PopularMoviesByGenreQuery = { __typename?: 'Query', popularMoviesByGenre: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids: Array<number | null>, id: number, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, title: string, video: boolean, vote_average: number, vote_count: number }> } };

export type TopRatedMoviesByGenreQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  genre: MovieGenreTypes;
}>;


export type TopRatedMoviesByGenreQuery = { __typename?: 'Query', topRatedMoviesByGenre: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids: Array<number | null>, id: number, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, title: string, video: boolean, vote_average: number, vote_count: number }> } };

export type PopularShowsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
}>;


export type PopularShowsQuery = { __typename?: 'Query', popularShows: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids: Array<number | null>, id: number, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity: number, poster_path?: string | null, vote_average: number, vote_count: number }> } };

export type SearchedShowsQueryVariables = Exact<{
  q: Scalars['String'];
  page?: InputMaybe<Scalars['Int']>;
}>;


export type SearchedShowsQuery = { __typename?: 'Query', searchedShows: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids: Array<number | null>, id: number, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity: number, poster_path?: string | null, vote_average: number, vote_count: number }> } };

export type GetShowDetailsQueryVariables = Exact<{
  showDetailsId: Scalars['Int'];
}>;


export type GetShowDetailsQuery = { __typename?: 'Query', showDetails: { __typename?: 'ShowDetailsRes', adult: boolean, backdrop_path?: string | null, episode_run_time: Array<number | null>, first_air_date?: string | null, homepage: string, id: number, in_production: boolean, languages: Array<string | null>, last_air_date?: string | null, name: string, number_of_episodes: number, number_of_seasons: number, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity: number, poster_path?: string | null, status: string, tagline: string, type: string, vote_average: number, vote_count: number, created_by: Array<{ __typename?: 'ShowDetailsCreatedBy', id?: number | null, credit_id?: string | null, name?: string | null, gender?: number | null, profile_path?: string | null } | null>, genres: Array<{ __typename?: 'ShowDetailsGenre', id: number, name: string }>, last_episode_to_air?: { __typename?: 'ShowDetailsLastEpToAir', air_date?: string | null, episode_number: number, id: number, name: string, overview: string, production_code: string, runtime?: number | null, season_number: number, show_id: number, still_path?: string | null, vote_average: number, vote_count: number } | null, networks: Array<{ __typename?: 'ShowDetailsNetwork', id: number, name: string, logo_path?: string | null, origin_country: string }>, production_companies: Array<{ __typename?: 'ShowDetailsProdCompany', id: number, logo_path?: string | null, name: string, origin_country: string } | null>, production_countries: Array<{ __typename?: 'ShowDetailsCountry', iso_3166_1: string, name: string } | null>, seasons: Array<{ __typename?: 'ShowDetailsSeason', air_date?: string | null, episode_count: number, id: number, name: string, overview: string, poster_path?: string | null, season_number: number } | null>, spoken_languages: Array<{ __typename?: 'ShowDetailsSpokenLang', english_name: string, iso_639_1: string, name: string } | null>, next_episode_to_air?: { __typename?: 'ShowDetailsNextEpToAir', air_date?: string | null, episode_number: number, id: number, name: string, overview: string, production_code: string, runtime?: number | null, season_number: number, show_id: number, still_path?: string | null, vote_average: number, vote_count: number } | null } };

export type PopularAnimeShowsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
}>;


export type PopularAnimeShowsQuery = { __typename?: 'Query', popularAnimeShows: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids: Array<number | null>, id: number, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity: number, poster_path?: string | null, vote_average: number, vote_count: number }> } };

export type TrendingShowsQueryVariables = Exact<{
  timeWindow: TimeWindowTypes;
  page?: InputMaybe<Scalars['Int']>;
}>;


export type TrendingShowsQuery = { __typename?: 'Query', trendingShows: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids: Array<number | null>, id: number, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity: number, poster_path?: string | null, vote_average: number, vote_count: number }> } };

export type TopRatedShowsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
}>;


export type TopRatedShowsQuery = { __typename?: 'Query', topRatedShows: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids: Array<number | null>, id: number, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity: number, poster_path?: string | null, vote_average: number, vote_count: number }> } };

export type RecommendedShowsQueryVariables = Exact<{
  recommendedShowsId: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
}>;


export type RecommendedShowsQuery = { __typename?: 'Query', recommendedShows: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids: Array<number | null>, id: number, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity: number, poster_path?: string | null, vote_average: number, vote_count: number }> } };

export type ShowReviewsQueryVariables = Exact<{
  showReviewsId: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
}>;


export type ShowReviewsQuery = { __typename?: 'Query', showReviews: { __typename?: 'ShowReviewRes', id: number, page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowReviewResult', author: string, content: string, created_at: string, id: string, updated_at: string, url: string, author_details: { __typename?: 'ShowReviewAuthorDetails', name: string, username: string, avatar_path?: string | null, rating?: number | null } } | null> } };

export type PopularShowsByGenreQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  genre: ShowGenreTypes;
}>;


export type PopularShowsByGenreQuery = { __typename?: 'Query', popularShowsByGenre: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids: Array<number | null>, id: number, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity: number, poster_path?: string | null, vote_average: number, vote_count: number }> } };

export type TopRatedShowsByGenreQueryVariables = Exact<{
  genre: ShowGenreTypes;
  page?: InputMaybe<Scalars['Int']>;
}>;


export type TopRatedShowsByGenreQuery = { __typename?: 'Query', topRatedShowsByGenre: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids: Array<number | null>, id: number, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity: number, poster_path?: string | null, vote_average: number, vote_count: number }> } };

export type PopularPeopleQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
}>;


export type PopularPeopleQuery = { __typename?: 'Query', popularPeople: { __typename?: 'PeopleRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'PersonResult', adult: boolean, gender: number, id: number, known_for_department?: string | null, name: string, popularity: number, profile_path?: string | null, known_for: Array<{ __typename?: 'KnownForResult', adult?: boolean | null, backdrop_path?: string | null, genre_ids?: Array<number | null> | null, id?: number | null, media_type?: string | null, original_language?: string | null, original_title?: string | null, overview?: string | null, poster_path?: string | null, release_date?: string | null, title?: string | null, video?: boolean | null, vote_average?: number | null, vote_count?: number | null }> }> } };

export type PersonDetailsQueryVariables = Exact<{
  personDetailsId: Scalars['Int'];
}>;


export type PersonDetailsQuery = { __typename?: 'Query', personDetails: { __typename?: 'PersonDetailsRes', adult?: boolean | null, also_known_as?: Array<string | null> | null, biography?: string | null, birthday?: string | null, deathday?: string | null, gender?: number | null, homepage?: string | null, id: number, imdb_id?: string | null, known_for_department?: string | null, name?: string | null, place_of_birth?: string | null, popularity?: number | null, profile_path?: string | null } };

export type SearchedPeopleQueryVariables = Exact<{
  q: Scalars['String'];
  page?: InputMaybe<Scalars['Int']>;
}>;


export type SearchedPeopleQuery = { __typename?: 'Query', searchedPeople: { __typename?: 'PeopleRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'PersonResult', adult: boolean, gender: number, id: number, known_for_department?: string | null, name: string, popularity: number, profile_path?: string | null, known_for: Array<{ __typename?: 'KnownForResult', adult?: boolean | null, backdrop_path?: string | null, genre_ids?: Array<number | null> | null, id?: number | null, media_type?: string | null, original_language?: string | null, original_title?: string | null, overview?: string | null, poster_path?: string | null, release_date?: string | null, title?: string | null, video?: boolean | null, vote_average?: number | null, vote_count?: number | null }> }> } };

export type UserQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'UserRes', id?: string | null, name?: string | null, email?: string | null, image?: string | null, movies?: Array<{ __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null> | null, shows?: Array<{ __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null> | null } | null };

export type UsersMovieQueryVariables = Exact<{
  movieId: Scalars['String'];
}>;


export type UsersMovieQuery = { __typename?: 'Query', usersMovie?: { __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null };

export type UsersMoviesQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersMoviesQuery = { __typename?: 'Query', usersMovies?: Array<{ __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null> | null };

export type UsersShowQueryVariables = Exact<{
  showId: Scalars['String'];
}>;


export type UsersShowQuery = { __typename?: 'Query', usersShow?: { __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null };

export type UsersShowsQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersShowsQuery = { __typename?: 'Query', usersShows?: Array<{ __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null> | null };

export type PersonsKnownForMovieResQueryVariables = Exact<{
  personsKnownForMovieResId: Scalars['Int'];
}>;


export type PersonsKnownForMovieResQuery = { __typename?: 'Query', personsKnownForMovieRes: { __typename?: 'PersonsKnownForMovieRes', id?: number | null, cast: Array<{ __typename?: 'PersonsKnownForMovieCast', adult: boolean, backdrop_path?: string | null, genre_ids: Array<number | null>, id: number, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, title: string, video: boolean, vote_average: number, vote_count: number, character?: string | null, credit_id?: string | null, order?: number | null } | null>, crew: Array<{ __typename?: 'PersonsKnownForMovieCrew', adult: boolean, backdrop_path?: string | null, genre_ids: Array<number | null>, id: number, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, title: string, video: boolean, vote_average: number, vote_count: number, credit_id?: string | null, department?: string | null, job?: string | null } | null> } };

export type PersonsKnownForShowResQueryVariables = Exact<{
  personsKnownForShowResId: Scalars['Int'];
}>;


export type PersonsKnownForShowResQuery = { __typename?: 'Query', personsKnownForShowRes: { __typename?: 'PersonsKnownForShowRes', id?: number | null, cast: Array<{ __typename?: 'PersonsKnownForShowCast', adult: boolean, backdrop_path?: string | null, genre_ids: Array<number | null>, id: number, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity: number, poster_path?: string | null, first_air_date?: string | null, name: string, vote_average: number, vote_count: number, character?: string | null, credit_id?: string | null, episode_count?: number | null } | null>, crew: Array<{ __typename?: 'PersonsKnownForShowCrew', adult: boolean, backdrop_path?: string | null, genre_ids: Array<number | null>, id: number, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity: number, poster_path?: string | null, first_air_date?: string | null, name: string, vote_average: number, vote_count: number, credit_id?: string | null, department?: string | null, episode_count?: number | null, job?: string | null } | null> } };

export type ShowsCastCrewQueryVariables = Exact<{
  showId: Scalars['Int'];
}>;


export type ShowsCastCrewQuery = { __typename?: 'Query', showsCastCrew?: { __typename?: 'ShowsCastCrewRes', id?: number | null, cast?: Array<{ __typename?: 'ShowsCastModel', adult?: boolean | null, gender?: number | null, id?: number | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, character?: string | null, credit_id?: string | null, order?: number | null } | null> | null, crew?: Array<{ __typename?: 'ShowsCrewModel', adult?: boolean | null, gender?: number | null, id?: number | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, credit_id?: string | null, department?: string | null, job?: string | null } | null> | null } | null };

export type MoviesCastCrewQueryVariables = Exact<{
  movieId: Scalars['Int'];
}>;


export type MoviesCastCrewQuery = { __typename?: 'Query', moviesCastCrew?: { __typename?: 'MoviesCastCrewRes', id?: number | null, cast?: Array<{ __typename?: 'MoviesCastModel', adult?: boolean | null, gender?: number | null, id?: number | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, cast_id?: number | null, character?: string | null, credit_id?: string | null, order?: number | null } | null> | null, crew?: Array<{ __typename?: 'MoviesCrewModel', adult?: boolean | null, gender?: number | null, id?: number | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, credit_id?: string | null, department?: string | null, job?: string | null } | null> | null } | null };

export type EpisodeDetailsQueryVariables = Exact<{
  showId: Scalars['Int'];
  seasonNum: Scalars['Int'];
  episodeNum: Scalars['Int'];
}>;


export type EpisodeDetailsQuery = { __typename?: 'Query', episodeDetails?: { __typename?: 'EpisodeDetailsRes', air_date?: string | null, episode_number?: number | null, name?: string | null, overview?: string | null, id?: number | null, production_code?: string | null, runtime?: number | null, season_number?: number | null, still_path?: string | null, vote_average?: number | null, vote_count?: number | null, crew?: Array<{ __typename?: 'ShowsCrewModel', adult?: boolean | null, gender?: number | null, id?: number | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, credit_id?: string | null, department?: string | null, job?: string | null } | null> | null, guest_stars?: Array<{ __typename?: 'ShowsCastModel', adult?: boolean | null, gender?: number | null, id?: number | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, character?: string | null, credit_id?: string | null, order?: number | null } | null> | null } | null };

export type CheckEmailVerificationTokenQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type CheckEmailVerificationTokenQuery = { __typename?: 'Query', checkEmailVerificationToken?: { __typename?: 'RedisRes', error?: string | null, successMsg?: string | null, token?: string | null, userId?: string | null } | null };

export type AccountVerifiedQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type AccountVerifiedQuery = { __typename?: 'Query', accountVerified?: { __typename?: 'AccountVerifiedRes', error?: string | null, id?: string | null, emailVerified?: any | null } | null };

export type EmailFromRedisTokenQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type EmailFromRedisTokenQuery = { __typename?: 'Query', emailFromRedisToken?: string | null };

export type CheckRetryEmailVerificationLimitQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type CheckRetryEmailVerificationLimitQuery = { __typename?: 'Query', checkRetryEmailVerificationLimit?: { __typename?: 'RedisRes', error?: string | null, successMsg?: string | null, token?: string | null, userId?: string | null } | null };


export const AddedMovieDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddedMovie"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WatchStatusTypes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"movieId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}}},{"kind":"Argument","name":{"kind":"Name","value":"movieName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieName"}}},{"kind":"Argument","name":{"kind":"Name","value":"watchStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<AddedMovieMutation, AddedMovieMutationVariables>;
export const UpdatedMovieDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatedMovie"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WatchStatusTypes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieRating"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"movieId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}}},{"kind":"Argument","name":{"kind":"Name","value":"watchStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"movieRating"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieRating"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<UpdatedMovieMutation, UpdatedMovieMutationVariables>;
export const DeletedMovieDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletedMovie"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"movieId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<DeletedMovieMutation, DeletedMovieMutationVariables>;
export const AddedShowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddedShow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WatchStatusTypes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentEpisode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addShow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showId"}}},{"kind":"Argument","name":{"kind":"Name","value":"showName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showName"}}},{"kind":"Argument","name":{"kind":"Name","value":"watchStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"currentEpisode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentEpisode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}}]} as unknown as DocumentNode<AddedShowMutation, AddedShowMutationVariables>;
export const UpdatedShowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatedShow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WatchStatusTypes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showRating"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentEpisode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateShow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showId"}}},{"kind":"Argument","name":{"kind":"Name","value":"watchStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"showRating"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showRating"}}},{"kind":"Argument","name":{"kind":"Name","value":"currentEpisode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentEpisode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}}]} as unknown as DocumentNode<UpdatedShowMutation, UpdatedShowMutationVariables>;
export const DeletedShowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletedShow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteShow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}}]} as unknown as DocumentNode<DeletedShowMutation, DeletedShowMutationVariables>;
export const WriteEmailVerificationTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"WriteEmailVerificationToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"writeEmailVerificationToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<WriteEmailVerificationTokenMutation, WriteEmailVerificationTokenMutationVariables>;
export const DeleteEmailVerificationTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEmailVerificationToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEmailVerificationToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<DeleteEmailVerificationTokenMutation, DeleteEmailVerificationTokenMutationVariables>;
export const VerifyUserEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyUserEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyUserEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}]}}]} as unknown as DocumentNode<VerifyUserEmailMutation, VerifyUserEmailMutationVariables>;
export const MutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Mutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"writeRetryEmailVerificationLimit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<MutationMutation, MutationMutationVariables>;
export const SendVerificationEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendVerificationEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recipientEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subject"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"html"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendVerificationEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipientEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recipientEmail"}}},{"kind":"Argument","name":{"kind":"Name","value":"subject"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subject"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"html"},"value":{"kind":"Variable","name":{"kind":"Name","value":"html"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}}]}}]}}]} as unknown as DocumentNode<SendVerificationEmailMutation, SendVerificationEmailMutationVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"createdUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"movies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}}]}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const PopularMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularMovies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<PopularMoviesQuery, PopularMoviesQueryVariables>;
export const SearchedMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchedMovies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"q"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchedMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"q"},"value":{"kind":"Variable","name":{"kind":"Name","value":"q"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<SearchedMoviesQuery, SearchedMoviesQueryVariables>;
export const GetMovieDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMovieDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieDetailsId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"movieDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"movieDetailsId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieDetailsId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imdb_id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"production_companies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logo_path"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"production_countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iso_3166_1"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}},{"kind":"Field","name":{"kind":"Name","value":"runtime"}},{"kind":"Field","name":{"kind":"Name","value":"spoken_languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"english_name"}},{"kind":"Field","name":{"kind":"Name","value":"iso_639_1"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tagline"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]} as unknown as DocumentNode<GetMovieDetailsQuery, GetMovieDetailsQueryVariables>;
export const PopularAnimeMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularAnimeMovies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularAnimeMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<PopularAnimeMoviesQuery, PopularAnimeMoviesQueryVariables>;
export const TrendingMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrendingMovies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeWindow"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TimeWindowTypes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trendingMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"timeWindow"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeWindow"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<TrendingMoviesQuery, TrendingMoviesQueryVariables>;
export const TopRatedMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TopRatedMovies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topRatedMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<TopRatedMoviesQuery, TopRatedMoviesQueryVariables>;
export const RecommendedMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecommendedMovies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recommendedMoviesId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recommendedMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recommendedMoviesId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recommendedMoviesId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<RecommendedMoviesQuery, RecommendedMoviesQueryVariables>;
export const MovieReviewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MovieReviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieReviewsId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"movieReviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieReviewsId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"author_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_path"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<MovieReviewsQuery, MovieReviewsQueryVariables>;
export const MoviesInTheatresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MoviesInTheatres"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moviesInTheatres"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maximum"}},{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<MoviesInTheatresQuery, MoviesInTheatresQueryVariables>;
export const PopularMoviesByGenreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularMoviesByGenre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"genre"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MovieGenreTypes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularMoviesByGenre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"genre"},"value":{"kind":"Variable","name":{"kind":"Name","value":"genre"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<PopularMoviesByGenreQuery, PopularMoviesByGenreQueryVariables>;
export const TopRatedMoviesByGenreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TopRatedMoviesByGenre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"genre"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MovieGenreTypes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topRatedMoviesByGenre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"genre"},"value":{"kind":"Variable","name":{"kind":"Name","value":"genre"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<TopRatedMoviesByGenreQuery, TopRatedMoviesByGenreQueryVariables>;
export const PopularShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularShows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularShows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<PopularShowsQuery, PopularShowsQueryVariables>;
export const SearchedShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchedShows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"q"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchedShows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"q"},"value":{"kind":"Variable","name":{"kind":"Name","value":"q"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<SearchedShowsQuery, SearchedShowsQueryVariables>;
export const GetShowDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getShowDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showDetailsId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showDetailsId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showDetailsId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"created_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"episode_run_time"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"in_production"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"last_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"last_episode_to_air"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"air_date"}},{"kind":"Field","name":{"kind":"Name","value":"episode_number"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"production_code"}},{"kind":"Field","name":{"kind":"Name","value":"runtime"}},{"kind":"Field","name":{"kind":"Name","value":"season_number"}},{"kind":"Field","name":{"kind":"Name","value":"show_id"}},{"kind":"Field","name":{"kind":"Name","value":"still_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"networks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo_path"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"number_of_episodes"}},{"kind":"Field","name":{"kind":"Name","value":"number_of_seasons"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"production_companies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logo_path"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"production_countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iso_3166_1"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seasons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"air_date"}},{"kind":"Field","name":{"kind":"Name","value":"episode_count"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"season_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spoken_languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"english_name"}},{"kind":"Field","name":{"kind":"Name","value":"iso_639_1"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tagline"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}},{"kind":"Field","name":{"kind":"Name","value":"next_episode_to_air"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"air_date"}},{"kind":"Field","name":{"kind":"Name","value":"episode_number"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"production_code"}},{"kind":"Field","name":{"kind":"Name","value":"runtime"}},{"kind":"Field","name":{"kind":"Name","value":"season_number"}},{"kind":"Field","name":{"kind":"Name","value":"show_id"}},{"kind":"Field","name":{"kind":"Name","value":"still_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<GetShowDetailsQuery, GetShowDetailsQueryVariables>;
export const PopularAnimeShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularAnimeShows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularAnimeShows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<PopularAnimeShowsQuery, PopularAnimeShowsQueryVariables>;
export const TrendingShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrendingShows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeWindow"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TimeWindowTypes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trendingShows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"timeWindow"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeWindow"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<TrendingShowsQuery, TrendingShowsQueryVariables>;
export const TopRatedShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TopRatedShows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topRatedShows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<TopRatedShowsQuery, TopRatedShowsQueryVariables>;
export const RecommendedShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecommendedShows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recommendedShowsId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recommendedShows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recommendedShowsId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recommendedShowsId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<RecommendedShowsQuery, RecommendedShowsQueryVariables>;
export const ShowReviewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ShowReviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showReviewsId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showReviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showReviewsId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"author_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_path"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<ShowReviewsQuery, ShowReviewsQueryVariables>;
export const PopularShowsByGenreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularShowsByGenre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"genre"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShowGenreTypes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularShowsByGenre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"genre"},"value":{"kind":"Variable","name":{"kind":"Name","value":"genre"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<PopularShowsByGenreQuery, PopularShowsByGenreQueryVariables>;
export const TopRatedShowsByGenreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TopRatedShowsByGenre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"genre"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShowGenreTypes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topRatedShowsByGenre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"genre"},"value":{"kind":"Variable","name":{"kind":"Name","value":"genre"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<TopRatedShowsByGenreQuery, TopRatedShowsByGenreQueryVariables>;
export const PopularPeopleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularPeople"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularPeople"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"media_type"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}}]}}]}}]}}]} as unknown as DocumentNode<PopularPeopleQuery, PopularPeopleQueryVariables>;
export const PersonDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PersonDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"personDetailsId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"personDetailsId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"personDetailsId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"also_known_as"}},{"kind":"Field","name":{"kind":"Name","value":"biography"}},{"kind":"Field","name":{"kind":"Name","value":"birthday"}},{"kind":"Field","name":{"kind":"Name","value":"deathday"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imdb_id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"place_of_birth"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}}]}}]}}]} as unknown as DocumentNode<PersonDetailsQuery, PersonDetailsQueryVariables>;
export const SearchedPeopleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchedPeople"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"q"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchedPeople"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"q"},"value":{"kind":"Variable","name":{"kind":"Name","value":"q"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"media_type"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}}]}}]}}]}}]} as unknown as DocumentNode<SearchedPeopleQuery, SearchedPeopleQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"movies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const UsersMovieDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersMovie"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usersMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"movieId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<UsersMovieQuery, UsersMovieQueryVariables>;
export const UsersMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersMovies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usersMovies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<UsersMoviesQuery, UsersMoviesQueryVariables>;
export const UsersShowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersShow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usersShow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}}]} as unknown as DocumentNode<UsersShowQuery, UsersShowQueryVariables>;
export const UsersShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersShows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usersShows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}}]} as unknown as DocumentNode<UsersShowsQuery, UsersShowsQueryVariables>;
export const PersonsKnownForMovieResDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PersonsKnownForMovieRes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"personsKnownForMovieResId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personsKnownForMovieRes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"personsKnownForMovieResId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"personsKnownForMovieResId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cast"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"crew"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"job"}}]}}]}}]}}]} as unknown as DocumentNode<PersonsKnownForMovieResQuery, PersonsKnownForMovieResQueryVariables>;
export const PersonsKnownForShowResDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PersonsKnownForShowRes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"personsKnownForShowResId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personsKnownForShowRes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"personsKnownForShowResId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"personsKnownForShowResId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cast"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"episode_count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"crew"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"episode_count"}},{"kind":"Field","name":{"kind":"Name","value":"job"}}]}}]}}]}}]} as unknown as DocumentNode<PersonsKnownForShowResQuery, PersonsKnownForShowResQueryVariables>;
export const ShowsCastCrewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ShowsCastCrew"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showsCastCrew"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cast"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"crew"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"job"}}]}}]}}]}}]} as unknown as DocumentNode<ShowsCastCrewQuery, ShowsCastCrewQueryVariables>;
export const MoviesCastCrewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MoviesCastCrew"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moviesCastCrew"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"movieId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cast"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}},{"kind":"Field","name":{"kind":"Name","value":"cast_id"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"crew"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"job"}}]}}]}}]}}]} as unknown as DocumentNode<MoviesCastCrewQuery, MoviesCastCrewQueryVariables>;
export const EpisodeDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EpisodeDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"seasonNum"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"episodeNum"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"episodeDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showId"}}},{"kind":"Argument","name":{"kind":"Name","value":"seasonNum"},"value":{"kind":"Variable","name":{"kind":"Name","value":"seasonNum"}}},{"kind":"Argument","name":{"kind":"Name","value":"episodeNum"},"value":{"kind":"Variable","name":{"kind":"Name","value":"episodeNum"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"air_date"}},{"kind":"Field","name":{"kind":"Name","value":"crew"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"job"}}]}},{"kind":"Field","name":{"kind":"Name","value":"episode_number"}},{"kind":"Field","name":{"kind":"Name","value":"guest_stars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"production_code"}},{"kind":"Field","name":{"kind":"Name","value":"runtime"}},{"kind":"Field","name":{"kind":"Name","value":"season_number"}},{"kind":"Field","name":{"kind":"Name","value":"still_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]} as unknown as DocumentNode<EpisodeDetailsQuery, EpisodeDetailsQueryVariables>;
export const CheckEmailVerificationTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckEmailVerificationToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkEmailVerificationToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<CheckEmailVerificationTokenQuery, CheckEmailVerificationTokenQueryVariables>;
export const AccountVerifiedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountVerified"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountVerified"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}}]}}]}}]} as unknown as DocumentNode<AccountVerifiedQuery, AccountVerifiedQueryVariables>;
export const EmailFromRedisTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EmailFromRedisToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailFromRedisToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<EmailFromRedisTokenQuery, EmailFromRedisTokenQueryVariables>;
export const CheckRetryEmailVerificationLimitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckRetryEmailVerificationLimit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkRetryEmailVerificationLimit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<CheckRetryEmailVerificationLimitQuery, CheckRetryEmailVerificationLimitQueryVariables>;