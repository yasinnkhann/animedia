/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
};

export type AccountVerifiedRes = {
  __typename?: 'AccountVerifiedRes';
  emailVerified?: Maybe<Scalars['DateTime']['output']>;
  errors: Array<ErrorRes>;
  id?: Maybe<Scalars['String']['output']>;
};

export type Character = {
  __typename?: 'Character';
  checksum?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  games?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type EpisodeDetailsRes = {
  __typename?: 'EpisodeDetailsRes';
  air_date?: Maybe<Scalars['String']['output']>;
  crew?: Maybe<Array<Maybe<ShowsCrewModel>>>;
  episode_number?: Maybe<Scalars['Int']['output']>;
  guest_stars?: Maybe<Array<Maybe<ShowsCastModel>>>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  overview?: Maybe<Scalars['String']['output']>;
  production_code?: Maybe<Scalars['String']['output']>;
  runtime?: Maybe<Scalars['Int']['output']>;
  season_number?: Maybe<Scalars['Int']['output']>;
  still_path?: Maybe<Scalars['String']['output']>;
  vote_average?: Maybe<Scalars['Float']['output']>;
  vote_count?: Maybe<Scalars['Int']['output']>;
};

export type ErrorRes = {
  __typename?: 'ErrorRes';
  message: Scalars['String']['output'];
};

export type GameResult = {
  __typename?: 'GameResult';
  age_ratings?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  alternative_names?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  artworks?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  bundles?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  category?: Maybe<Scalars['ID']['output']>;
  checksum?: Maybe<Scalars['ID']['output']>;
  collection?: Maybe<Scalars['ID']['output']>;
  collections?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  cover?: Maybe<Scalars['ID']['output']>;
  coverUrl?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  dlcs?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  expanded_games?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  expansions?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  external_games?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  first_release_date?: Maybe<Scalars['BigInt']['output']>;
  forks?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  franchise?: Maybe<Scalars['ID']['output']>;
  franchises?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  game_engines?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  game_localizations?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  game_modes?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  genres?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  hypes?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  involved_companies?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  keywords?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  language_supports?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  multiplayer_modes?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  name: Scalars['String']['output'];
  parent_game?: Maybe<Scalars['ID']['output']>;
  platforms?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  player_perspectives?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  ports?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  rating?: Maybe<Scalars['Float']['output']>;
  rating_count?: Maybe<Scalars['Int']['output']>;
  release_dates?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  remakes?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  remasters?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  screenshots?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  similar_games?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  slug?: Maybe<Scalars['String']['output']>;
  standalone_expansions?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  status?: Maybe<Scalars['ID']['output']>;
  storyline?: Maybe<Scalars['String']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  themes?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  total_rating?: Maybe<Scalars['Float']['output']>;
  total_rating_count?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  version_parent?: Maybe<Scalars['ID']['output']>;
  version_title?: Maybe<Scalars['String']['output']>;
  videos?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  websites?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
};

export type GamesRes = {
  __typename?: 'GamesRes';
  results: Array<GameResult>;
  total_results: Scalars['Int']['output'];
};

export type KnownForResult = {
  __typename?: 'KnownForResult';
  adult?: Maybe<Scalars['Boolean']['output']>;
  backdrop_path?: Maybe<Scalars['String']['output']>;
  genre_ids?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  id?: Maybe<Scalars['ID']['output']>;
  media_type?: Maybe<Scalars['String']['output']>;
  original_language?: Maybe<Scalars['String']['output']>;
  original_title?: Maybe<Scalars['String']['output']>;
  overview?: Maybe<Scalars['String']['output']>;
  poster_path?: Maybe<Scalars['String']['output']>;
  release_date?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  video?: Maybe<Scalars['Boolean']['output']>;
  vote_average?: Maybe<Scalars['Float']['output']>;
  vote_count?: Maybe<Scalars['Int']['output']>;
};

export type MovieDetailsGenre = {
  __typename?: 'MovieDetailsGenre';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type MovieDetailsProdCompany = {
  __typename?: 'MovieDetailsProdCompany';
  id: Scalars['ID']['output'];
  logo_path?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  origin_country: Scalars['String']['output'];
};

export type MovieDetailsProdCountry = {
  __typename?: 'MovieDetailsProdCountry';
  iso_3166_1: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type MovieDetailsRes = {
  __typename?: 'MovieDetailsRes';
  adult: Scalars['Boolean']['output'];
  backdrop_path?: Maybe<Scalars['String']['output']>;
  genres: Array<MovieDetailsGenre>;
  homepage: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imdb_id?: Maybe<Scalars['ID']['output']>;
  original_language: Scalars['String']['output'];
  original_title: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  popularity?: Maybe<Scalars['Float']['output']>;
  poster_path?: Maybe<Scalars['String']['output']>;
  production_companies: Array<Maybe<MovieDetailsProdCompany>>;
  production_countries: Array<Maybe<MovieDetailsProdCountry>>;
  release_date?: Maybe<Scalars['String']['output']>;
  revenue?: Maybe<Scalars['BigInt']['output']>;
  runtime?: Maybe<Scalars['Int']['output']>;
  spoken_languages: Array<Maybe<MovieDetailsSpokenLang>>;
  status: Scalars['String']['output'];
  tagline: Scalars['String']['output'];
  title: Scalars['String']['output'];
  video?: Maybe<Scalars['Boolean']['output']>;
  vote_average?: Maybe<Scalars['Float']['output']>;
  vote_count: Scalars['Int']['output'];
};

export type MovieDetailsSpokenLang = {
  __typename?: 'MovieDetailsSpokenLang';
  english_name: Scalars['String']['output'];
  iso_639_1: Scalars['String']['output'];
  name: Scalars['String']['output'];
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
  adult: Scalars['Boolean']['output'];
  backdrop_path?: Maybe<Scalars['String']['output']>;
  genre_ids?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  id: Scalars['ID']['output'];
  original_language: Scalars['String']['output'];
  original_title: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  popularity?: Maybe<Scalars['Float']['output']>;
  poster_path?: Maybe<Scalars['String']['output']>;
  release_date?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  video?: Maybe<Scalars['Boolean']['output']>;
  vote_average?: Maybe<Scalars['Float']['output']>;
  vote_count?: Maybe<Scalars['Int']['output']>;
};

export type MovieReviewAuthorDetails = {
  __typename?: 'MovieReviewAuthorDetails';
  avatar_path?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  rating?: Maybe<Scalars['Float']['output']>;
  username: Scalars['String']['output'];
};

export type MovieReviewsRes = {
  __typename?: 'MovieReviewsRes';
  id: Scalars['ID']['output'];
  page: Scalars['Int']['output'];
  results: Array<Maybe<MovieReviewsResult>>;
  total_pages: Scalars['Int']['output'];
  total_results: Scalars['Int']['output'];
};

export type MovieReviewsResult = {
  __typename?: 'MovieReviewsResult';
  author: Scalars['String']['output'];
  author_details: MovieReviewAuthorDetails;
  content: Scalars['String']['output'];
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updated_at: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type MoviesCastCrewRes = {
  __typename?: 'MoviesCastCrewRes';
  cast?: Maybe<Array<Maybe<MoviesCastModel>>>;
  crew?: Maybe<Array<Maybe<MoviesCrewModel>>>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type MoviesCastModel = {
  __typename?: 'MoviesCastModel';
  adult?: Maybe<Scalars['Boolean']['output']>;
  cast_id?: Maybe<Scalars['ID']['output']>;
  character?: Maybe<Scalars['String']['output']>;
  credit_id?: Maybe<Scalars['ID']['output']>;
  gender?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  known_for_department?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  original_name?: Maybe<Scalars['String']['output']>;
  popularity?: Maybe<Scalars['Float']['output']>;
  profile_path?: Maybe<Scalars['String']['output']>;
};

export type MoviesCrewModel = {
  __typename?: 'MoviesCrewModel';
  adult?: Maybe<Scalars['Boolean']['output']>;
  credit_id?: Maybe<Scalars['ID']['output']>;
  department?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  job?: Maybe<Scalars['String']['output']>;
  known_for_department?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  original_name?: Maybe<Scalars['String']['output']>;
  popularity?: Maybe<Scalars['Float']['output']>;
  profile_path?: Maybe<Scalars['String']['output']>;
};

export type MoviesInTheatresRes = {
  __typename?: 'MoviesInTheatresRes';
  dates: TheatreDates;
  page: Scalars['String']['output'];
  results: Array<Maybe<MovieResult>>;
  total_pages: Scalars['Int']['output'];
  total_results: Scalars['Int']['output'];
};

export type MoviesRes = {
  __typename?: 'MoviesRes';
  page: Scalars['Int']['output'];
  results: Array<MovieResult>;
  total_pages: Scalars['Int']['output'];
  total_results: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMovie?: Maybe<UserMovie>;
  addShow?: Maybe<UserShow>;
  changePassword?: Maybe<RedisRes>;
  deleteMovie?: Maybe<UserMovie>;
  deleteShow?: Maybe<UserShow>;
  registerUser?: Maybe<RegisteredUserRes>;
  sendForgotPasswordEmail?: Maybe<RedisRes>;
  sendVerificationEmail?: Maybe<RedisRes>;
  updateMovie?: Maybe<UserMovie>;
  updateShow?: Maybe<UserShow>;
  verifyUserEmail?: Maybe<RedisRes>;
};


export type MutationAddMovieArgs = {
  movieId: Scalars['ID']['input'];
  movieName: Scalars['String']['input'];
  watchStatus: WatchStatusTypes;
};


export type MutationAddShowArgs = {
  currentEpisode?: InputMaybe<Scalars['Int']['input']>;
  showId: Scalars['ID']['input'];
  showName: Scalars['String']['input'];
  watchStatus: WatchStatusTypes;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationDeleteMovieArgs = {
  movieId: Scalars['ID']['input'];
};


export type MutationDeleteShowArgs = {
  showId: Scalars['ID']['input'];
};


export type MutationRegisterUserArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSendForgotPasswordEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationSendVerificationEmailArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationUpdateMovieArgs = {
  movieId: Scalars['ID']['input'];
  movieRating?: InputMaybe<Scalars['Int']['input']>;
  watchStatus: WatchStatusTypes;
};


export type MutationUpdateShowArgs = {
  currentEpisode?: InputMaybe<Scalars['Int']['input']>;
  showId: Scalars['ID']['input'];
  showRating?: InputMaybe<Scalars['Int']['input']>;
  watchStatus: WatchStatusTypes;
};


export type MutationVerifyUserEmailArgs = {
  userId: Scalars['ID']['input'];
};

export type PeopleRes = {
  __typename?: 'PeopleRes';
  page: Scalars['Int']['output'];
  results: Array<PersonResult>;
  total_pages: Scalars['Int']['output'];
  total_results: Scalars['Int']['output'];
};

export type PersonDetailsRes = {
  __typename?: 'PersonDetailsRes';
  adult?: Maybe<Scalars['Boolean']['output']>;
  also_known_as?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  biography?: Maybe<Scalars['String']['output']>;
  birthday?: Maybe<Scalars['String']['output']>;
  deathday?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['Int']['output']>;
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imdb_id?: Maybe<Scalars['ID']['output']>;
  known_for_department?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  place_of_birth?: Maybe<Scalars['String']['output']>;
  popularity?: Maybe<Scalars['Float']['output']>;
  profile_path?: Maybe<Scalars['String']['output']>;
};

export type PersonResult = {
  __typename?: 'PersonResult';
  adult: Scalars['Boolean']['output'];
  gender: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  known_for: Array<KnownForResult>;
  known_for_department?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  popularity: Scalars['Float']['output'];
  profile_path?: Maybe<Scalars['String']['output']>;
};

export type PersonsKnownForMovieCast = {
  __typename?: 'PersonsKnownForMovieCast';
  adult: Scalars['Boolean']['output'];
  backdrop_path?: Maybe<Scalars['String']['output']>;
  character?: Maybe<Scalars['String']['output']>;
  credit_id?: Maybe<Scalars['ID']['output']>;
  genre_ids: Array<Maybe<Scalars['ID']['output']>>;
  id: Scalars['ID']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  original_language: Scalars['String']['output'];
  original_title: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  popularity: Scalars['Float']['output'];
  poster_path?: Maybe<Scalars['String']['output']>;
  release_date?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  video: Scalars['Boolean']['output'];
  vote_average: Scalars['Float']['output'];
  vote_count: Scalars['Int']['output'];
};

export type PersonsKnownForMovieCrew = {
  __typename?: 'PersonsKnownForMovieCrew';
  adult: Scalars['Boolean']['output'];
  backdrop_path?: Maybe<Scalars['String']['output']>;
  credit_id?: Maybe<Scalars['ID']['output']>;
  department?: Maybe<Scalars['String']['output']>;
  genre_ids: Array<Maybe<Scalars['ID']['output']>>;
  id: Scalars['ID']['output'];
  job?: Maybe<Scalars['String']['output']>;
  original_language: Scalars['String']['output'];
  original_title: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  popularity: Scalars['Float']['output'];
  poster_path?: Maybe<Scalars['String']['output']>;
  release_date?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  video: Scalars['Boolean']['output'];
  vote_average: Scalars['Float']['output'];
  vote_count: Scalars['Int']['output'];
};

export type PersonsKnownForMovieRes = {
  __typename?: 'PersonsKnownForMovieRes';
  cast: Array<Maybe<PersonsKnownForMovieCast>>;
  crew: Array<Maybe<PersonsKnownForMovieCrew>>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type PersonsKnownForShowCast = {
  __typename?: 'PersonsKnownForShowCast';
  adult: Scalars['Boolean']['output'];
  backdrop_path?: Maybe<Scalars['String']['output']>;
  character?: Maybe<Scalars['String']['output']>;
  credit_id?: Maybe<Scalars['ID']['output']>;
  episode_count?: Maybe<Scalars['Int']['output']>;
  first_air_date?: Maybe<Scalars['String']['output']>;
  genre_ids: Array<Maybe<Scalars['ID']['output']>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  origin_country: Array<Maybe<Scalars['String']['output']>>;
  original_language: Scalars['String']['output'];
  original_name: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  popularity: Scalars['Float']['output'];
  poster_path?: Maybe<Scalars['String']['output']>;
  vote_average: Scalars['Float']['output'];
  vote_count: Scalars['Int']['output'];
};

export type PersonsKnownForShowCrew = {
  __typename?: 'PersonsKnownForShowCrew';
  adult: Scalars['Boolean']['output'];
  backdrop_path?: Maybe<Scalars['String']['output']>;
  credit_id?: Maybe<Scalars['ID']['output']>;
  department?: Maybe<Scalars['String']['output']>;
  episode_count?: Maybe<Scalars['Int']['output']>;
  first_air_date?: Maybe<Scalars['String']['output']>;
  genre_ids: Array<Maybe<Scalars['ID']['output']>>;
  id: Scalars['ID']['output'];
  job?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  origin_country: Array<Maybe<Scalars['String']['output']>>;
  original_language: Scalars['String']['output'];
  original_name: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  popularity: Scalars['Float']['output'];
  poster_path?: Maybe<Scalars['String']['output']>;
  vote_average: Scalars['Float']['output'];
  vote_count: Scalars['Int']['output'];
};

export type PersonsKnownForShowRes = {
  __typename?: 'PersonsKnownForShowRes';
  cast: Array<Maybe<PersonsKnownForShowCast>>;
  crew: Array<Maybe<PersonsKnownForShowCrew>>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type Query = {
  __typename?: 'Query';
  accountVerified?: Maybe<AccountVerifiedRes>;
  checkEmailVerificationToken?: Maybe<RedisRes>;
  checkForgotPasswordToken?: Maybe<RedisRes>;
  emailFromRedisToken?: Maybe<Scalars['String']['output']>;
  episodeDetails?: Maybe<EpisodeDetailsRes>;
  gameDetails: GamesRes;
  gamesFromGenres: GamesRes;
  movieDetails: MovieDetailsRes;
  movieReviews: MovieReviewsRes;
  moviesCastCrew?: Maybe<MoviesCastCrewRes>;
  moviesInTheatres: MoviesInTheatresRes;
  personDetails: PersonDetailsRes;
  personsKnownForMovie: PersonsKnownForMovieRes;
  personsKnownForShow: PersonsKnownForShowRes;
  popularAnimeMovies: MoviesRes;
  popularAnimeShows: ShowsRes;
  popularMovies: MoviesRes;
  popularMoviesByGenre: MoviesRes;
  popularPeople: PeopleRes;
  popularShows: ShowsRes;
  popularShowsByGenre: ShowsRes;
  recommendedMovies: MoviesRes;
  recommendedShows: ShowsRes;
  searchGames: GamesRes;
  searchedMovies: MoviesRes;
  searchedPeople: PeopleRes;
  searchedShows: ShowsRes;
  showDetails: ShowDetailsRes;
  showReviews: ShowReviewRes;
  showsCastCrew?: Maybe<ShowsCastCrewRes>;
  topRatedGames: GamesRes;
  topRatedMovies: MoviesRes;
  topRatedMoviesByGenre: MoviesRes;
  topRatedShows: ShowsRes;
  topRatedShowsByGenre: ShowsRes;
  trendingMovies: MoviesRes;
  trendingShows: ShowsRes;
  user?: Maybe<User>;
  usersGame?: Maybe<UserGame>;
  usersGames?: Maybe<Array<Maybe<UserGame>>>;
  usersMovie?: Maybe<UserMovie>;
  usersMovies?: Maybe<Array<Maybe<UserMovie>>>;
  usersShow?: Maybe<UserShow>;
  usersShows?: Maybe<Array<Maybe<UserShow>>>;
};


export type QueryAccountVerifiedArgs = {
  email: Scalars['String']['input'];
};


export type QueryCheckEmailVerificationTokenArgs = {
  token: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type QueryCheckForgotPasswordTokenArgs = {
  token: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type QueryEmailFromRedisTokenArgs = {
  token: Scalars['String']['input'];
};


export type QueryEpisodeDetailsArgs = {
  episodeNum: Scalars['Int']['input'];
  seasonNum: Scalars['Int']['input'];
  showId: Scalars['ID']['input'];
};


export type QueryGameDetailsArgs = {
  gameDetailsId: Scalars['ID']['input'];
};


export type QueryGamesFromGenresArgs = {
  genreIds: Array<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMovieDetailsArgs = {
  movieDetailsId: Scalars['ID']['input'];
};


export type QueryMovieReviewsArgs = {
  id: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMoviesCastCrewArgs = {
  movieId: Scalars['ID']['input'];
};


export type QueryMoviesInTheatresArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPersonDetailsArgs = {
  personDetailsId: Scalars['ID']['input'];
};


export type QueryPersonsKnownForMovieArgs = {
  personsKnownForMovieResId: Scalars['ID']['input'];
};


export type QueryPersonsKnownForShowArgs = {
  personsKnownForShowResId: Scalars['ID']['input'];
};


export type QueryPopularAnimeMoviesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPopularAnimeShowsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPopularMoviesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPopularMoviesByGenreArgs = {
  genre: MovieGenreTypes;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPopularPeopleArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPopularShowsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPopularShowsByGenreArgs = {
  genre: ShowGenreTypes;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRecommendedMoviesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  recommendedMoviesId: Scalars['ID']['input'];
};


export type QueryRecommendedShowsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  recommendedShowsId: Scalars['ID']['input'];
};


export type QuerySearchGamesArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  q: Scalars['String']['input'];
};


export type QuerySearchedMoviesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  q: Scalars['String']['input'];
};


export type QuerySearchedPeopleArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  q: Scalars['String']['input'];
};


export type QuerySearchedShowsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  q: Scalars['String']['input'];
};


export type QueryShowDetailsArgs = {
  showDetailsId: Scalars['ID']['input'];
};


export type QueryShowReviewsArgs = {
  id: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryShowsCastCrewArgs = {
  showId: Scalars['ID']['input'];
};


export type QueryTopRatedGamesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTopRatedMoviesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTopRatedMoviesByGenreArgs = {
  genre: MovieGenreTypes;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTopRatedShowsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTopRatedShowsByGenreArgs = {
  genre: ShowGenreTypes;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTrendingMoviesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  timeWindow: TimeWindowTypes;
};


export type QueryTrendingShowsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  timeWindow: TimeWindowTypes;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersGameArgs = {
  gameId: Scalars['String']['input'];
};


export type QueryUsersMovieArgs = {
  movieId: Scalars['String']['input'];
};


export type QueryUsersShowArgs = {
  showId: Scalars['String']['input'];
};

export type RedisRes = {
  __typename?: 'RedisRes';
  errors: Array<ErrorRes>;
  token?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type RegisteredUserRes = {
  __typename?: 'RegisteredUserRes';
  createdUser?: Maybe<User>;
  errors: Array<ErrorRes>;
};

export type ShowDetailsCountry = {
  __typename?: 'ShowDetailsCountry';
  iso_3166_1: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ShowDetailsCreatedBy = {
  __typename?: 'ShowDetailsCreatedBy';
  credit_id?: Maybe<Scalars['ID']['output']>;
  gender?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  profile_path?: Maybe<Scalars['String']['output']>;
};

export type ShowDetailsGenre = {
  __typename?: 'ShowDetailsGenre';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ShowDetailsLastEpToAir = {
  __typename?: 'ShowDetailsLastEpToAir';
  air_date?: Maybe<Scalars['String']['output']>;
  episode_number: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  production_code: Scalars['String']['output'];
  runtime?: Maybe<Scalars['Int']['output']>;
  season_number: Scalars['Int']['output'];
  show_id: Scalars['ID']['output'];
  still_path?: Maybe<Scalars['String']['output']>;
  vote_average?: Maybe<Scalars['Float']['output']>;
  vote_count: Scalars['Int']['output'];
};

export type ShowDetailsNetwork = {
  __typename?: 'ShowDetailsNetwork';
  id: Scalars['ID']['output'];
  logo_path?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  origin_country: Scalars['String']['output'];
};

export type ShowDetailsNextEpToAir = {
  __typename?: 'ShowDetailsNextEpToAir';
  air_date?: Maybe<Scalars['String']['output']>;
  episode_number: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  production_code: Scalars['String']['output'];
  runtime?: Maybe<Scalars['Int']['output']>;
  season_number: Scalars['Int']['output'];
  show_id: Scalars['ID']['output'];
  still_path?: Maybe<Scalars['String']['output']>;
  vote_average?: Maybe<Scalars['Float']['output']>;
  vote_count: Scalars['Int']['output'];
};

export type ShowDetailsProdCompany = {
  __typename?: 'ShowDetailsProdCompany';
  id: Scalars['ID']['output'];
  logo_path?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  origin_country: Scalars['String']['output'];
};

export type ShowDetailsRes = {
  __typename?: 'ShowDetailsRes';
  adult: Scalars['Boolean']['output'];
  backdrop_path?: Maybe<Scalars['String']['output']>;
  created_by: Array<Maybe<ShowDetailsCreatedBy>>;
  episode_run_time: Array<Maybe<Scalars['Int']['output']>>;
  first_air_date?: Maybe<Scalars['String']['output']>;
  genres: Array<ShowDetailsGenre>;
  homepage: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  in_production: Scalars['Boolean']['output'];
  languages: Array<Maybe<Scalars['String']['output']>>;
  last_air_date?: Maybe<Scalars['String']['output']>;
  last_episode_to_air?: Maybe<ShowDetailsLastEpToAir>;
  name: Scalars['String']['output'];
  networks: Array<ShowDetailsNetwork>;
  next_episode_to_air?: Maybe<ShowDetailsNextEpToAir>;
  number_of_episodes: Scalars['Int']['output'];
  number_of_seasons: Scalars['Int']['output'];
  origin_country: Array<Maybe<Scalars['String']['output']>>;
  original_language: Scalars['String']['output'];
  original_name: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  popularity?: Maybe<Scalars['Float']['output']>;
  poster_path?: Maybe<Scalars['String']['output']>;
  production_companies: Array<Maybe<ShowDetailsProdCompany>>;
  production_countries: Array<Maybe<ShowDetailsCountry>>;
  seasons: Array<Maybe<ShowDetailsSeason>>;
  spoken_languages: Array<Maybe<ShowDetailsSpokenLang>>;
  status: Scalars['String']['output'];
  tagline: Scalars['String']['output'];
  type: Scalars['String']['output'];
  vote_average?: Maybe<Scalars['Float']['output']>;
  vote_count?: Maybe<Scalars['Int']['output']>;
};

export type ShowDetailsSeason = {
  __typename?: 'ShowDetailsSeason';
  air_date?: Maybe<Scalars['String']['output']>;
  episode_count: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  poster_path?: Maybe<Scalars['String']['output']>;
  season_number: Scalars['Int']['output'];
};

export type ShowDetailsSpokenLang = {
  __typename?: 'ShowDetailsSpokenLang';
  english_name: Scalars['String']['output'];
  iso_639_1: Scalars['String']['output'];
  name: Scalars['String']['output'];
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
  backdrop_path?: Maybe<Scalars['String']['output']>;
  first_air_date?: Maybe<Scalars['String']['output']>;
  genre_ids?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  origin_country: Array<Maybe<Scalars['String']['output']>>;
  original_language: Scalars['String']['output'];
  original_name: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  popularity?: Maybe<Scalars['Float']['output']>;
  poster_path?: Maybe<Scalars['String']['output']>;
  vote_average?: Maybe<Scalars['Float']['output']>;
  vote_count: Scalars['Int']['output'];
};

export type ShowReviewAuthorDetails = {
  __typename?: 'ShowReviewAuthorDetails';
  avatar_path?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  rating?: Maybe<Scalars['Float']['output']>;
  username: Scalars['String']['output'];
};

export type ShowReviewRes = {
  __typename?: 'ShowReviewRes';
  id: Scalars['ID']['output'];
  page: Scalars['Int']['output'];
  results: Array<Maybe<ShowReviewResult>>;
  total_pages: Scalars['Int']['output'];
  total_results: Scalars['Int']['output'];
};

export type ShowReviewResult = {
  __typename?: 'ShowReviewResult';
  author: Scalars['String']['output'];
  author_details: ShowReviewAuthorDetails;
  content: Scalars['String']['output'];
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updated_at: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ShowsCastCrewRes = {
  __typename?: 'ShowsCastCrewRes';
  cast?: Maybe<Array<Maybe<ShowsCastModel>>>;
  crew?: Maybe<Array<Maybe<ShowsCrewModel>>>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ShowsCastModel = {
  __typename?: 'ShowsCastModel';
  adult?: Maybe<Scalars['Boolean']['output']>;
  character?: Maybe<Scalars['String']['output']>;
  credit_id?: Maybe<Scalars['ID']['output']>;
  gender?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  known_for_department?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  original_name?: Maybe<Scalars['String']['output']>;
  popularity?: Maybe<Scalars['Float']['output']>;
  profile_path?: Maybe<Scalars['String']['output']>;
};

export type ShowsCrewModel = {
  __typename?: 'ShowsCrewModel';
  adult?: Maybe<Scalars['Boolean']['output']>;
  credit_id?: Maybe<Scalars['ID']['output']>;
  department?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  job?: Maybe<Scalars['String']['output']>;
  known_for_department?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  original_name?: Maybe<Scalars['String']['output']>;
  popularity?: Maybe<Scalars['Float']['output']>;
  profile_path?: Maybe<Scalars['String']['output']>;
};

export type ShowsRes = {
  __typename?: 'ShowsRes';
  page: Scalars['Int']['output'];
  results: Array<ShowResult>;
  total_pages: Scalars['Int']['output'];
  total_results: Scalars['Int']['output'];
};

export type TheatreDates = {
  __typename?: 'TheatreDates';
  maximum: Scalars['String']['output'];
  minimum: Scalars['String']['output'];
};

export enum TimeWindowTypes {
  Day = 'day',
  Week = 'week'
}

export type User = {
  __typename?: 'User';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailVerified?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  movies?: Maybe<Array<Maybe<UserMovie>>>;
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  shows?: Maybe<Array<Maybe<UserShow>>>;
};

export type UserGame = {
  __typename?: 'UserGame';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['Int']['output']>;
};

export type UserMovie = {
  __typename?: 'UserMovie';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<WatchStatusTypes>;
};

export type UserShow = {
  __typename?: 'UserShow';
  current_episode?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['Int']['output']>;
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

export type MovieResultFragment = { __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids?: Array<string | null> | null, id: string, original_language: string, original_title: string, overview: string, popularity?: number | null, poster_path?: string | null, release_date?: string | null, title: string, video?: boolean | null, vote_average?: number | null, vote_count?: number | null } & { ' $fragmentName'?: 'MovieResultFragment' };

export type ShowResultFragment = { __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids?: Array<string | null> | null, id: string, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity?: number | null, poster_path?: string | null, vote_average?: number | null, vote_count: number } & { ' $fragmentName'?: 'ShowResultFragment' };

export type AddedMovieMutationVariables = Exact<{
  movieId: Scalars['ID']['input'];
  movieName: Scalars['String']['input'];
  watchStatus: WatchStatusTypes;
}>;


export type AddedMovieMutation = { __typename?: 'Mutation', addMovie?: { __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null };

export type UpdatedMovieMutationVariables = Exact<{
  movieId: Scalars['ID']['input'];
  watchStatus: WatchStatusTypes;
  movieRating?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdatedMovieMutation = { __typename?: 'Mutation', updateMovie?: { __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null };

export type DeletedMovieMutationVariables = Exact<{
  movieId: Scalars['ID']['input'];
}>;


export type DeletedMovieMutation = { __typename?: 'Mutation', deleteMovie?: { __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null };

export type AddedShowMutationVariables = Exact<{
  showId: Scalars['ID']['input'];
  showName: Scalars['String']['input'];
  watchStatus: WatchStatusTypes;
  currentEpisode?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AddedShowMutation = { __typename?: 'Mutation', addShow?: { __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null };

export type UpdatedShowMutationVariables = Exact<{
  showId: Scalars['ID']['input'];
  watchStatus: WatchStatusTypes;
  showRating?: InputMaybe<Scalars['Int']['input']>;
  currentEpisode?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdatedShowMutation = { __typename?: 'Mutation', updateShow?: { __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null };

export type DeletedShowMutationVariables = Exact<{
  showId: Scalars['ID']['input'];
}>;


export type DeletedShowMutation = { __typename?: 'Mutation', deleteShow?: { __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null };

export type VerifyUserEmailMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type VerifyUserEmailMutation = { __typename?: 'Mutation', verifyUserEmail?: { __typename?: 'RedisRes', userId?: string | null, errors: Array<{ __typename?: 'ErrorRes', message: string }> } | null };

export type SendVerificationEmailMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type SendVerificationEmailMutation = { __typename?: 'Mutation', sendVerificationEmail?: { __typename?: 'RedisRes', token?: string | null, userId?: string | null, errors: Array<{ __typename?: 'ErrorRes', message: string }> } | null };

export type RegisterUserMutationVariables = Exact<{
  name: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser?: { __typename?: 'RegisteredUserRes', errors: Array<{ __typename?: 'ErrorRes', message: string }>, createdUser?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, password?: string | null, image?: string | null, created_at?: any | null, emailVerified?: any | null, movies?: Array<{ __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null> | null, shows?: Array<{ __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null> | null } | null } | null };

export type SendForgotPasswordEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type SendForgotPasswordEmailMutation = { __typename?: 'Mutation', sendForgotPasswordEmail?: { __typename?: 'RedisRes', token?: string | null, userId?: string | null, errors: Array<{ __typename?: 'ErrorRes', message: string }> } | null };

export type ChangePasswordMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword?: { __typename?: 'RedisRes', token?: string | null, userId?: string | null, errors: Array<{ __typename?: 'ErrorRes', message: string }> } | null };

export type PopularMoviesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PopularMoviesQuery = { __typename?: 'Query', popularMovies: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids?: Array<string | null> | null, id: string, original_language: string, original_title: string, overview: string, popularity?: number | null, poster_path?: string | null, release_date?: string | null, title: string, video?: boolean | null, vote_average?: number | null, vote_count?: number | null }> } };

export type SearchedMoviesQueryVariables = Exact<{
  q: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchedMoviesQuery = { __typename?: 'Query', searchedMovies: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids?: Array<string | null> | null, id: string, original_language: string, original_title: string, overview: string, popularity?: number | null, poster_path?: string | null, release_date?: string | null, title: string, video?: boolean | null, vote_average?: number | null, vote_count?: number | null }> } };

export type MovieDetailsQueryVariables = Exact<{
  movieDetailsId: Scalars['ID']['input'];
}>;


export type MovieDetailsQuery = { __typename?: 'Query', movieDetails: { __typename?: 'MovieDetailsRes', adult: boolean, backdrop_path?: string | null, homepage: string, id: string, imdb_id?: string | null, original_language: string, original_title: string, overview: string, popularity?: number | null, poster_path?: string | null, release_date?: string | null, revenue?: any | null, runtime?: number | null, status: string, tagline: string, title: string, video?: boolean | null, vote_average?: number | null, vote_count: number, genres: Array<{ __typename?: 'MovieDetailsGenre', id: string, name: string }>, production_companies: Array<{ __typename?: 'MovieDetailsProdCompany', id: string, logo_path?: string | null, name: string, origin_country: string } | null>, production_countries: Array<{ __typename?: 'MovieDetailsProdCountry', iso_3166_1: string, name: string } | null>, spoken_languages: Array<{ __typename?: 'MovieDetailsSpokenLang', english_name: string, iso_639_1: string, name: string } | null> } };

export type PopularAnimeMoviesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PopularAnimeMoviesQuery = { __typename?: 'Query', popularAnimeMovies: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids?: Array<string | null> | null, id: string, original_language: string, original_title: string, overview: string, popularity?: number | null, poster_path?: string | null, release_date?: string | null, title: string, video?: boolean | null, vote_average?: number | null, vote_count?: number | null }> } };

export type TrendingMoviesQueryVariables = Exact<{
  timeWindow: TimeWindowTypes;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TrendingMoviesQuery = { __typename?: 'Query', trendingMovies: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids?: Array<string | null> | null, id: string, original_language: string, original_title: string, overview: string, popularity?: number | null, poster_path?: string | null, release_date?: string | null, title: string, video?: boolean | null, vote_average?: number | null, vote_count?: number | null }> } };

export type TopRatedMoviesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TopRatedMoviesQuery = { __typename?: 'Query', topRatedMovies: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids?: Array<string | null> | null, id: string, original_language: string, original_title: string, overview: string, popularity?: number | null, poster_path?: string | null, release_date?: string | null, title: string, video?: boolean | null, vote_average?: number | null, vote_count?: number | null }> } };

export type RecommendedMoviesQueryVariables = Exact<{
  recommendedMoviesId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecommendedMoviesQuery = { __typename?: 'Query', recommendedMovies: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids?: Array<string | null> | null, id: string, original_language: string, original_title: string, overview: string, popularity?: number | null, poster_path?: string | null, release_date?: string | null, title: string, video?: boolean | null, vote_average?: number | null, vote_count?: number | null }> } };

export type MovieReviewsQueryVariables = Exact<{
  movieReviewsId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MovieReviewsQuery = { __typename?: 'Query', movieReviews: { __typename?: 'MovieReviewsRes', id: string, page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieReviewsResult', author: string, content: string, created_at: string, id: string, updated_at: string, url: string, author_details: { __typename?: 'MovieReviewAuthorDetails', name: string, username: string, avatar_path?: string | null, rating?: number | null } } | null> } };

export type MoviesInTheatresQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MoviesInTheatresQuery = { __typename?: 'Query', moviesInTheatres: { __typename?: 'MoviesInTheatresRes', page: string, total_pages: number, total_results: number, dates: { __typename?: 'TheatreDates', maximum: string, minimum: string }, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids?: Array<string | null> | null, id: string, original_language: string, original_title: string, overview: string, popularity?: number | null, poster_path?: string | null, release_date?: string | null, title: string, video?: boolean | null, vote_average?: number | null, vote_count?: number | null } | null> } };

export type PopularMoviesByGenreQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  genre: MovieGenreTypes;
}>;


export type PopularMoviesByGenreQuery = { __typename?: 'Query', popularMoviesByGenre: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids?: Array<string | null> | null, id: string, original_language: string, original_title: string, overview: string, popularity?: number | null, poster_path?: string | null, release_date?: string | null, title: string, video?: boolean | null, vote_average?: number | null, vote_count?: number | null }> } };

export type TopRatedMoviesByGenreQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  genre: MovieGenreTypes;
}>;


export type TopRatedMoviesByGenreQuery = { __typename?: 'Query', topRatedMoviesByGenre: { __typename?: 'MoviesRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'MovieResult', adult: boolean, backdrop_path?: string | null, genre_ids?: Array<string | null> | null, id: string, original_language: string, original_title: string, overview: string, popularity?: number | null, poster_path?: string | null, release_date?: string | null, title: string, video?: boolean | null, vote_average?: number | null, vote_count?: number | null }> } };

export type PopularShowsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PopularShowsQuery = { __typename?: 'Query', popularShows: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids?: Array<string | null> | null, id: string, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity?: number | null, poster_path?: string | null, vote_average?: number | null, vote_count: number }> } };

export type SearchedShowsQueryVariables = Exact<{
  q: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchedShowsQuery = { __typename?: 'Query', searchedShows: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids?: Array<string | null> | null, id: string, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity?: number | null, poster_path?: string | null, vote_average?: number | null, vote_count: number }> } };

export type ShowDetailsQueryVariables = Exact<{
  showDetailsId: Scalars['ID']['input'];
}>;


export type ShowDetailsQuery = { __typename?: 'Query', showDetails: { __typename?: 'ShowDetailsRes', adult: boolean, backdrop_path?: string | null, episode_run_time: Array<number | null>, first_air_date?: string | null, homepage: string, id: string, in_production: boolean, languages: Array<string | null>, last_air_date?: string | null, name: string, number_of_episodes: number, number_of_seasons: number, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity?: number | null, poster_path?: string | null, status: string, tagline: string, type: string, vote_average?: number | null, vote_count?: number | null, created_by: Array<{ __typename?: 'ShowDetailsCreatedBy', id?: string | null, credit_id?: string | null, name?: string | null, gender?: number | null, profile_path?: string | null } | null>, genres: Array<{ __typename?: 'ShowDetailsGenre', id: string, name: string }>, last_episode_to_air?: { __typename?: 'ShowDetailsLastEpToAir', air_date?: string | null, episode_number: number, id: string, name: string, overview: string, production_code: string, runtime?: number | null, season_number: number, show_id: string, still_path?: string | null, vote_average?: number | null, vote_count: number } | null, networks: Array<{ __typename?: 'ShowDetailsNetwork', id: string, name: string, logo_path?: string | null, origin_country: string }>, production_companies: Array<{ __typename?: 'ShowDetailsProdCompany', id: string, logo_path?: string | null, name: string, origin_country: string } | null>, production_countries: Array<{ __typename?: 'ShowDetailsCountry', iso_3166_1: string, name: string } | null>, seasons: Array<{ __typename?: 'ShowDetailsSeason', air_date?: string | null, episode_count: number, id: string, name: string, overview: string, poster_path?: string | null, season_number: number } | null>, spoken_languages: Array<{ __typename?: 'ShowDetailsSpokenLang', english_name: string, iso_639_1: string, name: string } | null>, next_episode_to_air?: { __typename?: 'ShowDetailsNextEpToAir', air_date?: string | null, episode_number: number, id: string, name: string, overview: string, production_code: string, runtime?: number | null, season_number: number, show_id: string, still_path?: string | null, vote_average?: number | null, vote_count: number } | null } };

export type PopularAnimeShowsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PopularAnimeShowsQuery = { __typename?: 'Query', popularAnimeShows: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids?: Array<string | null> | null, id: string, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity?: number | null, poster_path?: string | null, vote_average?: number | null, vote_count: number }> } };

export type TrendingShowsQueryVariables = Exact<{
  timeWindow: TimeWindowTypes;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TrendingShowsQuery = { __typename?: 'Query', trendingShows: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids?: Array<string | null> | null, id: string, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity?: number | null, poster_path?: string | null, vote_average?: number | null, vote_count: number }> } };

export type TopRatedShowsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TopRatedShowsQuery = { __typename?: 'Query', topRatedShows: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids?: Array<string | null> | null, id: string, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity?: number | null, poster_path?: string | null, vote_average?: number | null, vote_count: number }> } };

export type RecommendedShowsQueryVariables = Exact<{
  recommendedShowsId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecommendedShowsQuery = { __typename?: 'Query', recommendedShows: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids?: Array<string | null> | null, id: string, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity?: number | null, poster_path?: string | null, vote_average?: number | null, vote_count: number }> } };

export type ShowReviewsQueryVariables = Exact<{
  showReviewsId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ShowReviewsQuery = { __typename?: 'Query', showReviews: { __typename?: 'ShowReviewRes', id: string, page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowReviewResult', author: string, content: string, created_at: string, id: string, updated_at: string, url: string, author_details: { __typename?: 'ShowReviewAuthorDetails', name: string, username: string, avatar_path?: string | null, rating?: number | null } } | null> } };

export type PopularShowsByGenreQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  genre: ShowGenreTypes;
}>;


export type PopularShowsByGenreQuery = { __typename?: 'Query', popularShowsByGenre: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids?: Array<string | null> | null, id: string, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity?: number | null, poster_path?: string | null, vote_average?: number | null, vote_count: number }> } };

export type TopRatedShowsByGenreQueryVariables = Exact<{
  genre: ShowGenreTypes;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TopRatedShowsByGenreQuery = { __typename?: 'Query', topRatedShowsByGenre: { __typename?: 'ShowsRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'ShowResult', backdrop_path?: string | null, first_air_date?: string | null, genre_ids?: Array<string | null> | null, id: string, name: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity?: number | null, poster_path?: string | null, vote_average?: number | null, vote_count: number }> } };

export type PopularPeopleQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PopularPeopleQuery = { __typename?: 'Query', popularPeople: { __typename?: 'PeopleRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'PersonResult', adult: boolean, gender: number, id: string, known_for_department?: string | null, name: string, popularity: number, profile_path?: string | null, known_for: Array<{ __typename?: 'KnownForResult', adult?: boolean | null, backdrop_path?: string | null, genre_ids?: Array<string | null> | null, id?: string | null, media_type?: string | null, original_language?: string | null, original_title?: string | null, overview?: string | null, poster_path?: string | null, release_date?: string | null, title?: string | null, video?: boolean | null, vote_average?: number | null, vote_count?: number | null }> }> } };

export type PersonDetailsQueryVariables = Exact<{
  personDetailsId: Scalars['ID']['input'];
}>;


export type PersonDetailsQuery = { __typename?: 'Query', personDetails: { __typename?: 'PersonDetailsRes', adult?: boolean | null, also_known_as?: Array<string | null> | null, biography?: string | null, birthday?: string | null, deathday?: string | null, gender?: number | null, homepage?: string | null, id: string, imdb_id?: string | null, known_for_department?: string | null, name?: string | null, place_of_birth?: string | null, popularity?: number | null, profile_path?: string | null } };

export type SearchedPeopleQueryVariables = Exact<{
  q: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchedPeopleQuery = { __typename?: 'Query', searchedPeople: { __typename?: 'PeopleRes', page: number, total_pages: number, total_results: number, results: Array<{ __typename?: 'PersonResult', adult: boolean, gender: number, id: string, known_for_department?: string | null, name: string, popularity: number, profile_path?: string | null, known_for: Array<{ __typename?: 'KnownForResult', adult?: boolean | null, backdrop_path?: string | null, genre_ids?: Array<string | null> | null, id?: string | null, media_type?: string | null, original_language?: string | null, original_title?: string | null, overview?: string | null, poster_path?: string | null, release_date?: string | null, title?: string | null, video?: boolean | null, vote_average?: number | null, vote_count?: number | null }> }> } };

export type UserQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, image?: string | null, movies?: Array<{ __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null> | null, shows?: Array<{ __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null> | null } | null };

export type UsersMovieQueryVariables = Exact<{
  movieId: Scalars['String']['input'];
}>;


export type UsersMovieQuery = { __typename?: 'Query', usersMovie?: { __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null };

export type UsersMoviesQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersMoviesQuery = { __typename?: 'Query', usersMovies?: Array<{ __typename?: 'UserMovie', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null } | null> | null };

export type UsersShowQueryVariables = Exact<{
  showId: Scalars['String']['input'];
}>;


export type UsersShowQuery = { __typename?: 'Query', usersShow?: { __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null };

export type UsersShowsQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersShowsQuery = { __typename?: 'Query', usersShows?: Array<{ __typename?: 'UserShow', id?: string | null, name?: string | null, status?: WatchStatusTypes | null, rating?: number | null, current_episode?: number | null } | null> | null };

export type PersonsKnownForMovieQueryVariables = Exact<{
  personsKnownForMovieResId: Scalars['ID']['input'];
}>;


export type PersonsKnownForMovieQuery = { __typename?: 'Query', personsKnownForMovie: { __typename?: 'PersonsKnownForMovieRes', id?: string | null, cast: Array<{ __typename?: 'PersonsKnownForMovieCast', adult: boolean, backdrop_path?: string | null, genre_ids: Array<string | null>, id: string, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, title: string, video: boolean, vote_average: number, vote_count: number, character?: string | null, credit_id?: string | null, order?: number | null } | null>, crew: Array<{ __typename?: 'PersonsKnownForMovieCrew', adult: boolean, backdrop_path?: string | null, genre_ids: Array<string | null>, id: string, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, release_date?: string | null, title: string, video: boolean, vote_average: number, vote_count: number, credit_id?: string | null, department?: string | null, job?: string | null } | null> } };

export type PersonsKnownForShowQueryVariables = Exact<{
  personsKnownForShowResId: Scalars['ID']['input'];
}>;


export type PersonsKnownForShowQuery = { __typename?: 'Query', personsKnownForShow: { __typename?: 'PersonsKnownForShowRes', id?: string | null, cast: Array<{ __typename?: 'PersonsKnownForShowCast', adult: boolean, backdrop_path?: string | null, genre_ids: Array<string | null>, id: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity: number, poster_path?: string | null, first_air_date?: string | null, name: string, vote_average: number, vote_count: number, character?: string | null, credit_id?: string | null, episode_count?: number | null } | null>, crew: Array<{ __typename?: 'PersonsKnownForShowCrew', adult: boolean, backdrop_path?: string | null, genre_ids: Array<string | null>, id: string, origin_country: Array<string | null>, original_language: string, original_name: string, overview: string, popularity: number, poster_path?: string | null, first_air_date?: string | null, name: string, vote_average: number, vote_count: number, credit_id?: string | null, department?: string | null, episode_count?: number | null, job?: string | null } | null> } };

export type ShowsCastCrewQueryVariables = Exact<{
  showId: Scalars['ID']['input'];
}>;


export type ShowsCastCrewQuery = { __typename?: 'Query', showsCastCrew?: { __typename?: 'ShowsCastCrewRes', id?: string | null, cast?: Array<{ __typename?: 'ShowsCastModel', adult?: boolean | null, gender?: number | null, id?: string | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, character?: string | null, credit_id?: string | null, order?: number | null } | null> | null, crew?: Array<{ __typename?: 'ShowsCrewModel', adult?: boolean | null, gender?: number | null, id?: string | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, credit_id?: string | null, department?: string | null, job?: string | null } | null> | null } | null };

export type MoviesCastCrewQueryVariables = Exact<{
  movieId: Scalars['ID']['input'];
}>;


export type MoviesCastCrewQuery = { __typename?: 'Query', moviesCastCrew?: { __typename?: 'MoviesCastCrewRes', id?: string | null, cast?: Array<{ __typename?: 'MoviesCastModel', adult?: boolean | null, gender?: number | null, id?: string | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, cast_id?: string | null, character?: string | null, credit_id?: string | null, order?: number | null } | null> | null, crew?: Array<{ __typename?: 'MoviesCrewModel', adult?: boolean | null, gender?: number | null, id?: string | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, credit_id?: string | null, department?: string | null, job?: string | null } | null> | null } | null };

export type EpisodeDetailsQueryVariables = Exact<{
  showId: Scalars['ID']['input'];
  seasonNum: Scalars['Int']['input'];
  episodeNum: Scalars['Int']['input'];
}>;


export type EpisodeDetailsQuery = { __typename?: 'Query', episodeDetails?: { __typename?: 'EpisodeDetailsRes', air_date?: string | null, episode_number?: number | null, name?: string | null, overview?: string | null, id?: string | null, production_code?: string | null, runtime?: number | null, season_number?: number | null, still_path?: string | null, vote_average?: number | null, vote_count?: number | null, crew?: Array<{ __typename?: 'ShowsCrewModel', adult?: boolean | null, gender?: number | null, id?: string | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, credit_id?: string | null, department?: string | null, job?: string | null } | null> | null, guest_stars?: Array<{ __typename?: 'ShowsCastModel', adult?: boolean | null, gender?: number | null, id?: string | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, character?: string | null, credit_id?: string | null, order?: number | null } | null> | null } | null };

export type CheckEmailVerificationTokenQueryVariables = Exact<{
  token: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
}>;


export type CheckEmailVerificationTokenQuery = { __typename?: 'Query', checkEmailVerificationToken?: { __typename?: 'RedisRes', token?: string | null, userId?: string | null, errors: Array<{ __typename?: 'ErrorRes', message: string }> } | null };

export type CheckForgotPasswordTokenQueryVariables = Exact<{
  token: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
}>;


export type CheckForgotPasswordTokenQuery = { __typename?: 'Query', checkForgotPasswordToken?: { __typename?: 'RedisRes', token?: string | null, userId?: string | null, errors: Array<{ __typename?: 'ErrorRes', message: string }> } | null };

export type AccountVerifiedQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type AccountVerifiedQuery = { __typename?: 'Query', accountVerified?: { __typename?: 'AccountVerifiedRes', id?: string | null, emailVerified?: any | null, errors: Array<{ __typename?: 'ErrorRes', message: string }> } | null };

export type EmailFromRedisTokenQueryVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type EmailFromRedisTokenQuery = { __typename?: 'Query', emailFromRedisToken?: string | null };

export type SearchGamesQueryVariables = Exact<{
  q: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
}>;


export type SearchGamesQuery = { __typename?: 'Query', searchGames: { __typename?: 'GamesRes', total_results: number, results: Array<{ __typename?: 'GameResult', id: string, age_ratings?: Array<string | null> | null, alternative_names?: Array<string | null> | null, artworks?: Array<string | null> | null, bundles?: Array<string | null> | null, category?: string | null, checksum?: string | null, collection?: string | null, collections?: Array<string | null> | null, cover?: string | null, coverUrl?: string | null, created_at?: any | null, dlcs?: Array<string | null> | null, expanded_games?: Array<string | null> | null, expansions?: Array<string | null> | null, external_games?: Array<string | null> | null, first_release_date?: any | null, forks?: Array<string | null> | null, franchise?: string | null, franchises?: Array<string | null> | null, game_engines?: Array<string | null> | null, game_localizations?: Array<string | null> | null, game_modes?: Array<string | null> | null, genres?: Array<string | null> | null, hypes?: number | null, involved_companies?: Array<string | null> | null, keywords?: Array<string | null> | null, language_supports?: Array<string | null> | null, multiplayer_modes?: Array<string | null> | null, name: string, parent_game?: string | null, platforms?: Array<string | null> | null, player_perspectives?: Array<string | null> | null, ports?: Array<string | null> | null, rating?: number | null, rating_count?: number | null, release_dates?: Array<string | null> | null, remakes?: Array<string | null> | null, remasters?: Array<string | null> | null, screenshots?: Array<string | null> | null, similar_games?: Array<string | null> | null, slug?: string | null, standalone_expansions?: Array<string | null> | null, status?: string | null, storyline?: string | null, summary?: string | null, tags?: Array<string | null> | null, themes?: Array<string | null> | null, total_rating?: number | null, total_rating_count?: number | null, updated_at?: any | null, url?: string | null, version_parent?: string | null, version_title?: string | null, videos?: Array<string | null> | null, websites?: Array<string | null> | null }> } };

export type UsersGamesQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersGamesQuery = { __typename?: 'Query', usersGames?: Array<{ __typename?: 'UserGame', id?: string | null, name?: string | null, rating?: number | null } | null> | null };

export const MovieResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MovieResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MovieResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]} as unknown as DocumentNode<MovieResultFragment, unknown>;
export const ShowResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShowResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShowResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]} as unknown as DocumentNode<ShowResultFragment, unknown>;
export const AddedMovieDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddedMovie"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WatchStatusTypes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"movieId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}}},{"kind":"Argument","name":{"kind":"Name","value":"movieName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieName"}}},{"kind":"Argument","name":{"kind":"Name","value":"watchStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<AddedMovieMutation, AddedMovieMutationVariables>;
export const UpdatedMovieDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatedMovie"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WatchStatusTypes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieRating"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"movieId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}}},{"kind":"Argument","name":{"kind":"Name","value":"watchStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"movieRating"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieRating"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<UpdatedMovieMutation, UpdatedMovieMutationVariables>;
export const DeletedMovieDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletedMovie"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"movieId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<DeletedMovieMutation, DeletedMovieMutationVariables>;
export const AddedShowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddedShow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WatchStatusTypes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentEpisode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addShow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showId"}}},{"kind":"Argument","name":{"kind":"Name","value":"showName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showName"}}},{"kind":"Argument","name":{"kind":"Name","value":"watchStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"currentEpisode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentEpisode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}}]} as unknown as DocumentNode<AddedShowMutation, AddedShowMutationVariables>;
export const UpdatedShowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatedShow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WatchStatusTypes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showRating"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentEpisode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateShow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showId"}}},{"kind":"Argument","name":{"kind":"Name","value":"watchStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"watchStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"showRating"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showRating"}}},{"kind":"Argument","name":{"kind":"Name","value":"currentEpisode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentEpisode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}}]} as unknown as DocumentNode<UpdatedShowMutation, UpdatedShowMutationVariables>;
export const DeletedShowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletedShow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteShow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}}]} as unknown as DocumentNode<DeletedShowMutation, DeletedShowMutationVariables>;
export const VerifyUserEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyUserEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyUserEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<VerifyUserEmailMutation, VerifyUserEmailMutationVariables>;
export const SendVerificationEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendVerificationEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendVerificationEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<SendVerificationEmailMutation, SendVerificationEmailMutationVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"movies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const SendForgotPasswordEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendForgotPasswordEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendForgotPasswordEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<SendForgotPasswordEmailMutation, SendForgotPasswordEmailMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const PopularMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularMovies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<PopularMoviesQuery, PopularMoviesQueryVariables>;
export const SearchedMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchedMovies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"q"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchedMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"q"},"value":{"kind":"Variable","name":{"kind":"Name","value":"q"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<SearchedMoviesQuery, SearchedMoviesQueryVariables>;
export const MovieDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MovieDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieDetailsId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"movieDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"movieDetailsId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieDetailsId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imdb_id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"production_companies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logo_path"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"production_countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iso_3166_1"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}},{"kind":"Field","name":{"kind":"Name","value":"runtime"}},{"kind":"Field","name":{"kind":"Name","value":"spoken_languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"english_name"}},{"kind":"Field","name":{"kind":"Name","value":"iso_639_1"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tagline"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]} as unknown as DocumentNode<MovieDetailsQuery, MovieDetailsQueryVariables>;
export const PopularAnimeMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularAnimeMovies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularAnimeMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<PopularAnimeMoviesQuery, PopularAnimeMoviesQueryVariables>;
export const TrendingMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrendingMovies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeWindow"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TimeWindowTypes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trendingMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"timeWindow"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeWindow"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<TrendingMoviesQuery, TrendingMoviesQueryVariables>;
export const TopRatedMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TopRatedMovies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topRatedMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<TopRatedMoviesQuery, TopRatedMoviesQueryVariables>;
export const RecommendedMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecommendedMovies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recommendedMoviesId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recommendedMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recommendedMoviesId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recommendedMoviesId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<RecommendedMoviesQuery, RecommendedMoviesQueryVariables>;
export const MovieReviewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MovieReviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieReviewsId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"movieReviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieReviewsId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"author_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_path"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<MovieReviewsQuery, MovieReviewsQueryVariables>;
export const MoviesInTheatresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MoviesInTheatres"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moviesInTheatres"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maximum"}},{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<MoviesInTheatresQuery, MoviesInTheatresQueryVariables>;
export const PopularMoviesByGenreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularMoviesByGenre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"genre"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MovieGenreTypes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularMoviesByGenre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"genre"},"value":{"kind":"Variable","name":{"kind":"Name","value":"genre"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<PopularMoviesByGenreQuery, PopularMoviesByGenreQueryVariables>;
export const TopRatedMoviesByGenreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TopRatedMoviesByGenre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"genre"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MovieGenreTypes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topRatedMoviesByGenre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"genre"},"value":{"kind":"Variable","name":{"kind":"Name","value":"genre"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<TopRatedMoviesByGenreQuery, TopRatedMoviesByGenreQueryVariables>;
export const PopularShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularShows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularShows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<PopularShowsQuery, PopularShowsQueryVariables>;
export const SearchedShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchedShows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"q"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchedShows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"q"},"value":{"kind":"Variable","name":{"kind":"Name","value":"q"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<SearchedShowsQuery, SearchedShowsQueryVariables>;
export const ShowDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ShowDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showDetailsId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showDetailsId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showDetailsId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"created_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"episode_run_time"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"in_production"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"last_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"last_episode_to_air"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"air_date"}},{"kind":"Field","name":{"kind":"Name","value":"episode_number"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"production_code"}},{"kind":"Field","name":{"kind":"Name","value":"runtime"}},{"kind":"Field","name":{"kind":"Name","value":"season_number"}},{"kind":"Field","name":{"kind":"Name","value":"show_id"}},{"kind":"Field","name":{"kind":"Name","value":"still_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"networks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo_path"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"number_of_episodes"}},{"kind":"Field","name":{"kind":"Name","value":"number_of_seasons"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"production_companies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logo_path"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"production_countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iso_3166_1"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seasons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"air_date"}},{"kind":"Field","name":{"kind":"Name","value":"episode_count"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"season_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spoken_languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"english_name"}},{"kind":"Field","name":{"kind":"Name","value":"iso_639_1"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tagline"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}},{"kind":"Field","name":{"kind":"Name","value":"next_episode_to_air"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"air_date"}},{"kind":"Field","name":{"kind":"Name","value":"episode_number"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"production_code"}},{"kind":"Field","name":{"kind":"Name","value":"runtime"}},{"kind":"Field","name":{"kind":"Name","value":"season_number"}},{"kind":"Field","name":{"kind":"Name","value":"show_id"}},{"kind":"Field","name":{"kind":"Name","value":"still_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<ShowDetailsQuery, ShowDetailsQueryVariables>;
export const PopularAnimeShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularAnimeShows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularAnimeShows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<PopularAnimeShowsQuery, PopularAnimeShowsQueryVariables>;
export const TrendingShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrendingShows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeWindow"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TimeWindowTypes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trendingShows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"timeWindow"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeWindow"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<TrendingShowsQuery, TrendingShowsQueryVariables>;
export const TopRatedShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TopRatedShows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topRatedShows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<TopRatedShowsQuery, TopRatedShowsQueryVariables>;
export const RecommendedShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecommendedShows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recommendedShowsId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recommendedShows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recommendedShowsId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recommendedShowsId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<RecommendedShowsQuery, RecommendedShowsQueryVariables>;
export const ShowReviewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ShowReviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showReviewsId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showReviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showReviewsId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"author_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_path"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<ShowReviewsQuery, ShowReviewsQueryVariables>;
export const PopularShowsByGenreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularShowsByGenre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"genre"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShowGenreTypes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularShowsByGenre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"genre"},"value":{"kind":"Variable","name":{"kind":"Name","value":"genre"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<PopularShowsByGenreQuery, PopularShowsByGenreQueryVariables>;
export const TopRatedShowsByGenreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TopRatedShowsByGenre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"genre"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShowGenreTypes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topRatedShowsByGenre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"genre"},"value":{"kind":"Variable","name":{"kind":"Name","value":"genre"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]}}]} as unknown as DocumentNode<TopRatedShowsByGenreQuery, TopRatedShowsByGenreQueryVariables>;
export const PopularPeopleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PopularPeople"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularPeople"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"media_type"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}}]}}]}}]}}]} as unknown as DocumentNode<PopularPeopleQuery, PopularPeopleQueryVariables>;
export const PersonDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PersonDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"personDetailsId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"personDetailsId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"personDetailsId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"also_known_as"}},{"kind":"Field","name":{"kind":"Name","value":"biography"}},{"kind":"Field","name":{"kind":"Name","value":"birthday"}},{"kind":"Field","name":{"kind":"Name","value":"deathday"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imdb_id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"place_of_birth"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}}]}}]}}]} as unknown as DocumentNode<PersonDetailsQuery, PersonDetailsQueryVariables>;
export const SearchedPeopleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchedPeople"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"q"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchedPeople"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"q"},"value":{"kind":"Variable","name":{"kind":"Name","value":"q"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"media_type"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}}]}}]}}]}}]} as unknown as DocumentNode<SearchedPeopleQuery, SearchedPeopleQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"movies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const UsersMovieDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersMovie"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usersMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"movieId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<UsersMovieQuery, UsersMovieQueryVariables>;
export const UsersMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersMovies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usersMovies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<UsersMoviesQuery, UsersMoviesQueryVariables>;
export const UsersShowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersShow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usersShow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}}]} as unknown as DocumentNode<UsersShowQuery, UsersShowQueryVariables>;
export const UsersShowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersShows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usersShows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"current_episode"}}]}}]}}]} as unknown as DocumentNode<UsersShowsQuery, UsersShowsQueryVariables>;
export const PersonsKnownForMovieDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PersonsKnownForMovie"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"personsKnownForMovieResId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personsKnownForMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"personsKnownForMovieResId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"personsKnownForMovieResId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cast"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"crew"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"job"}}]}}]}}]}}]} as unknown as DocumentNode<PersonsKnownForMovieQuery, PersonsKnownForMovieQueryVariables>;
export const PersonsKnownForShowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PersonsKnownForShow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"personsKnownForShowResId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personsKnownForShow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"personsKnownForShowResId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"personsKnownForShowResId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cast"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"episode_count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"crew"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"backdrop_path"}},{"kind":"Field","name":{"kind":"Name","value":"genre_ids"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"origin_country"}},{"kind":"Field","name":{"kind":"Name","value":"original_language"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"poster_path"}},{"kind":"Field","name":{"kind":"Name","value":"first_air_date"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"episode_count"}},{"kind":"Field","name":{"kind":"Name","value":"job"}}]}}]}}]}}]} as unknown as DocumentNode<PersonsKnownForShowQuery, PersonsKnownForShowQueryVariables>;
export const ShowsCastCrewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ShowsCastCrew"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showsCastCrew"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cast"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"crew"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"job"}}]}}]}}]}}]} as unknown as DocumentNode<ShowsCastCrewQuery, ShowsCastCrewQueryVariables>;
export const MoviesCastCrewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MoviesCastCrew"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moviesCastCrew"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"movieId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cast"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}},{"kind":"Field","name":{"kind":"Name","value":"cast_id"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"crew"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"job"}}]}}]}}]}}]} as unknown as DocumentNode<MoviesCastCrewQuery, MoviesCastCrewQueryVariables>;
export const EpisodeDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EpisodeDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"seasonNum"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"episodeNum"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"episodeDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showId"}}},{"kind":"Argument","name":{"kind":"Name","value":"seasonNum"},"value":{"kind":"Variable","name":{"kind":"Name","value":"seasonNum"}}},{"kind":"Argument","name":{"kind":"Name","value":"episodeNum"},"value":{"kind":"Variable","name":{"kind":"Name","value":"episodeNum"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"air_date"}},{"kind":"Field","name":{"kind":"Name","value":"crew"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"job"}}]}},{"kind":"Field","name":{"kind":"Name","value":"episode_number"}},{"kind":"Field","name":{"kind":"Name","value":"guest_stars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adult"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"known_for_department"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original_name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"profile_path"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"credit_id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"production_code"}},{"kind":"Field","name":{"kind":"Name","value":"runtime"}},{"kind":"Field","name":{"kind":"Name","value":"season_number"}},{"kind":"Field","name":{"kind":"Name","value":"still_path"}},{"kind":"Field","name":{"kind":"Name","value":"vote_average"}},{"kind":"Field","name":{"kind":"Name","value":"vote_count"}}]}}]}}]} as unknown as DocumentNode<EpisodeDetailsQuery, EpisodeDetailsQueryVariables>;
export const CheckEmailVerificationTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckEmailVerificationToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkEmailVerificationToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<CheckEmailVerificationTokenQuery, CheckEmailVerificationTokenQueryVariables>;
export const CheckForgotPasswordTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckForgotPasswordToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkForgotPasswordToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<CheckForgotPasswordTokenQuery, CheckForgotPasswordTokenQueryVariables>;
export const AccountVerifiedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountVerified"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountVerified"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}}]}}]}}]} as unknown as DocumentNode<AccountVerifiedQuery, AccountVerifiedQueryVariables>;
export const EmailFromRedisTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EmailFromRedisToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailFromRedisToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<EmailFromRedisTokenQuery, EmailFromRedisTokenQueryVariables>;
export const SearchGamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchGames"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"q"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchGames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"q"},"value":{"kind":"Variable","name":{"kind":"Name","value":"q"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total_results"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"age_ratings"}},{"kind":"Field","name":{"kind":"Name","value":"alternative_names"}},{"kind":"Field","name":{"kind":"Name","value":"artworks"}},{"kind":"Field","name":{"kind":"Name","value":"bundles"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"checksum"}},{"kind":"Field","name":{"kind":"Name","value":"collection"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"coverUrl"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"dlcs"}},{"kind":"Field","name":{"kind":"Name","value":"expanded_games"}},{"kind":"Field","name":{"kind":"Name","value":"expansions"}},{"kind":"Field","name":{"kind":"Name","value":"external_games"}},{"kind":"Field","name":{"kind":"Name","value":"first_release_date"}},{"kind":"Field","name":{"kind":"Name","value":"forks"}},{"kind":"Field","name":{"kind":"Name","value":"franchise"}},{"kind":"Field","name":{"kind":"Name","value":"franchises"}},{"kind":"Field","name":{"kind":"Name","value":"game_engines"}},{"kind":"Field","name":{"kind":"Name","value":"game_localizations"}},{"kind":"Field","name":{"kind":"Name","value":"game_modes"}},{"kind":"Field","name":{"kind":"Name","value":"genres"}},{"kind":"Field","name":{"kind":"Name","value":"hypes"}},{"kind":"Field","name":{"kind":"Name","value":"involved_companies"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"language_supports"}},{"kind":"Field","name":{"kind":"Name","value":"multiplayer_modes"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parent_game"}},{"kind":"Field","name":{"kind":"Name","value":"platforms"}},{"kind":"Field","name":{"kind":"Name","value":"player_perspectives"}},{"kind":"Field","name":{"kind":"Name","value":"ports"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"rating_count"}},{"kind":"Field","name":{"kind":"Name","value":"release_dates"}},{"kind":"Field","name":{"kind":"Name","value":"remakes"}},{"kind":"Field","name":{"kind":"Name","value":"remasters"}},{"kind":"Field","name":{"kind":"Name","value":"screenshots"}},{"kind":"Field","name":{"kind":"Name","value":"similar_games"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"standalone_expansions"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"storyline"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"themes"}},{"kind":"Field","name":{"kind":"Name","value":"total_rating"}},{"kind":"Field","name":{"kind":"Name","value":"total_rating_count"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"version_parent"}},{"kind":"Field","name":{"kind":"Name","value":"version_title"}},{"kind":"Field","name":{"kind":"Name","value":"videos"}},{"kind":"Field","name":{"kind":"Name","value":"websites"}}]}}]}}]}}]} as unknown as DocumentNode<SearchGamesQuery, SearchGamesQueryVariables>;
export const UsersGamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersGames"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usersGames"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<UsersGamesQuery, UsersGamesQueryVariables>;