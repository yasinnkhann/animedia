/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../../context"
import type { core, connectionPluginCore } from "nexus"

declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * Adds a Relay-style connection to the type, with numerous options for configuration
     *
     * @see https://nexusjs.org/docs/plugins/connection
     */
    connectionField<FieldName extends string>(
      fieldName: FieldName,
      config: connectionPluginCore.ConnectionFieldConfig<TypeName, FieldName>
    ): void
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  MovieDetailsGenre: { // root type
    id: number; // Int!
    name: string; // String!
  }
  MovieDetailsProdCompany: { // root type
    id: number; // Int!
    logo_path?: string | null; // String
    name: string; // String!
    origin_country: string; // String!
  }
  MovieDetailsProdCountry: { // root type
    iso_3166_1: string; // String!
    name: string; // String!
  }
  MovieDetailsRes: { // root type
    adult: boolean; // Boolean!
    backdrop_path?: string | null; // String
    genres: NexusGenRootTypes['MovieDetailsGenre'][]; // [MovieDetailsGenre!]!
    homepage: string; // String!
    id: number; // Int!
    imdb_id: string; // String!
    original_language: string; // String!
    original_title: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path: string; // String!
    production_companies: Array<NexusGenRootTypes['MovieDetailsProdCompany'] | null>; // [MovieDetailsProdCompany]!
    production_countries: Array<NexusGenRootTypes['MovieDetailsProdCountry'] | null>; // [MovieDetailsProdCountry]!
    release_date: string; // String!
    revenue: number; // Int!
    runtime: number; // Int!
    spoken_languages: Array<NexusGenRootTypes['MovieDetailsSpokenLang'] | null>; // [MovieDetailsSpokenLang]!
    status: string; // String!
    tagline: string; // String!
    title: string; // String!
    video: boolean; // Boolean!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  MovieDetailsSpokenLang: { // root type
    english_name: string; // String!
    iso_639_1: string; // String!
    name: string; // String!
  }
  MovieResult: { // root type
    adult: boolean; // Boolean!
    backdrop_path?: string | null; // String
    genre_ids: Array<number | null>; // [Int]!
    id: number; // Int!
    original_language: string; // String!
    original_title: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path?: string | null; // String
    release_date: string; // String!
    title: string; // String!
    video: boolean; // Boolean!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  MovieReviewAuthorDetails: { // root type
    avatar_path?: string | null; // String
    name: string; // String!
    rating?: number | null; // Float
    username: string; // String!
  }
  MovieReviewRes: { // root type
    id: number; // Int!
    page: number; // Int!
    results: Array<NexusGenRootTypes['MovieReviewResult'] | null>; // [MovieReviewResult]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  MovieReviewResult: { // root type
    author: string; // String!
    author_details: NexusGenRootTypes['MovieReviewAuthorDetails']; // MovieReviewAuthorDetails!
    content: string; // String!
    created_at: string; // String!
    id: string; // String!
    updated_at: string; // String!
    url: string; // String!
  }
  MoviesInTheatresRes: { // root type
    dates: NexusGenRootTypes['TheatreDates']; // TheatreDates!
    page: string; // String!
    results: Array<NexusGenRootTypes['MovieResult'] | null>; // [MovieResult]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  MoviesRes: { // root type
    page: number; // Int!
    results: NexusGenRootTypes['MovieResult'][]; // [MovieResult!]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  Mutation: {};
  Query: {};
  ShowDetailsCountry: { // root type
    iso_3166_1: string; // String!
    name: string; // String!
  }
  ShowDetailsCreatedBy: { // root type
    credit_id: string; // String!
    gender: number; // Int!
    id: number; // Int!
    name: string; // String!
    profile_path: string; // String!
  }
  ShowDetailsGenre: { // root type
    id: number; // Int!
    name: string; // String!
  }
  ShowDetailsLastEpToAir: { // root type
    air_date: string; // String!
    episode_number: number; // Int!
    id: number; // Int!
    name: string; // String!
    overview: string; // String!
    production_code: string; // String!
    runtime: number; // Int!
    season_number: number; // Int!
    show_id: number; // Int!
    still_path?: string | null; // String
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  ShowDetailsNetwork: { // root type
    id: number; // Int!
    logo_path?: string | null; // String
    name: string; // String!
    origin_country: string; // String!
  }
  ShowDetailsNextEpToAir: { // root type
    air_date: string; // String!
    episode_number: number; // Int!
    id: number; // Int!
    name: string; // String!
    overview: string; // String!
    production_code: string; // String!
    runtime: number; // Int!
    season_number: number; // Int!
    show_id: number; // Int!
    still_path?: string | null; // String
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  ShowDetailsProdCompany: { // root type
    id: number; // Int!
    logo_path?: string | null; // String
    name: string; // String!
    origin_country: string; // String!
  }
  ShowDetailsRes: { // root type
    adult: boolean; // Boolean!
    backdrop_path?: string | null; // String
    created_by: Array<NexusGenRootTypes['ShowDetailsCreatedBy'] | null>; // [ShowDetailsCreatedBy]!
    episode_run_time: Array<number | null>; // [Int]!
    first_air_date: string; // String!
    genres: NexusGenRootTypes['ShowDetailsGenre'][]; // [ShowDetailsGenre!]!
    homepage: string; // String!
    id: number; // Int!
    in_production: boolean; // Boolean!
    languages: Array<string | null>; // [String]!
    last_air_date: string; // String!
    last_episode_to_air: NexusGenRootTypes['ShowDetailsLastEpToAir']; // ShowDetailsLastEpToAir!
    name: string; // String!
    networks: NexusGenRootTypes['ShowDetailsNetwork'][]; // [ShowDetailsNetwork!]!
    next_episode_to_air?: NexusGenRootTypes['ShowDetailsNextEpToAir'] | null; // ShowDetailsNextEpToAir
    number_of_episodes: number; // Int!
    number_of_seasons: number; // Int!
    origin_country: Array<string | null>; // [String]!
    original_language: string; // String!
    original_name: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path: string; // String!
    production_companies: Array<NexusGenRootTypes['ShowDetailsProdCompany'] | null>; // [ShowDetailsProdCompany]!
    production_countries: Array<NexusGenRootTypes['ShowDetailsCountry'] | null>; // [ShowDetailsCountry]!
    seasons: Array<NexusGenRootTypes['ShowDetailsSeason'] | null>; // [ShowDetailsSeason]!
    spoken_languages: Array<NexusGenRootTypes['ShowDetailsSpokenLang'] | null>; // [ShowDetailsSpokenLang]!
    status: string; // String!
    tagline: string; // String!
    type: string; // String!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  ShowDetailsSeason: { // root type
    air_date: string; // String!
    episode_count: number; // Int!
    id: number; // Int!
    name: string; // String!
    overview: string; // String!
    poster_path: string; // String!
    season_number: number; // Int!
  }
  ShowDetailsSpokenLang: { // root type
    english_name: string; // String!
    iso_639_1: string; // String!
    name: string; // String!
  }
  ShowResult: { // root type
    backdrop_path?: string | null; // String
    first_air_date?: string | null; // String
    genre_ids: Array<number | null>; // [Int]!
    id: number; // Int!
    name: string; // String!
    origin_country: Array<string | null>; // [String]!
    original_language: string; // String!
    original_name: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path?: string | null; // String
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  ShowReviewAuthorDetails: { // root type
    avatar_path?: string | null; // String
    name: string; // String!
    rating?: number | null; // Float
    username: string; // String!
  }
  ShowReviewRes: { // root type
    id: number; // Int!
    page: number; // Int!
    results: Array<NexusGenRootTypes['ShowReviewResult'] | null>; // [ShowReviewResult]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  ShowReviewResult: { // root type
    author: string; // String!
    author_details: NexusGenRootTypes['ShowReviewAuthorDetails']; // ShowReviewAuthorDetails!
    content: string; // String!
    created_at: string; // String!
    id: string; // String!
    updated_at: string; // String!
    url: string; // String!
  }
  ShowsRes: { // root type
    page: number; // Int!
    results: NexusGenRootTypes['ShowResult'][]; // [ShowResult!]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  TheatreDates: { // root type
    maximum: string; // String!
    minimum: string; // String!
  }
  User: { // root type
    email: string; // String!
    id: string; // String!
    name: string; // String!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  MovieDetailsGenre: { // field return type
    id: number; // Int!
    name: string; // String!
  }
  MovieDetailsProdCompany: { // field return type
    id: number; // Int!
    logo_path: string | null; // String
    name: string; // String!
    origin_country: string; // String!
  }
  MovieDetailsProdCountry: { // field return type
    iso_3166_1: string; // String!
    name: string; // String!
  }
  MovieDetailsRes: { // field return type
    adult: boolean; // Boolean!
    backdrop_path: string | null; // String
    genres: NexusGenRootTypes['MovieDetailsGenre'][]; // [MovieDetailsGenre!]!
    homepage: string; // String!
    id: number; // Int!
    imdb_id: string; // String!
    original_language: string; // String!
    original_title: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path: string; // String!
    production_companies: Array<NexusGenRootTypes['MovieDetailsProdCompany'] | null>; // [MovieDetailsProdCompany]!
    production_countries: Array<NexusGenRootTypes['MovieDetailsProdCountry'] | null>; // [MovieDetailsProdCountry]!
    release_date: string; // String!
    revenue: number; // Int!
    runtime: number; // Int!
    spoken_languages: Array<NexusGenRootTypes['MovieDetailsSpokenLang'] | null>; // [MovieDetailsSpokenLang]!
    status: string; // String!
    tagline: string; // String!
    title: string; // String!
    video: boolean; // Boolean!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  MovieDetailsSpokenLang: { // field return type
    english_name: string; // String!
    iso_639_1: string; // String!
    name: string; // String!
  }
  MovieResult: { // field return type
    adult: boolean; // Boolean!
    backdrop_path: string | null; // String
    genre_ids: Array<number | null>; // [Int]!
    id: number; // Int!
    original_language: string; // String!
    original_title: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path: string | null; // String
    release_date: string; // String!
    title: string; // String!
    video: boolean; // Boolean!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  MovieReviewAuthorDetails: { // field return type
    avatar_path: string | null; // String
    name: string; // String!
    rating: number | null; // Float
    username: string; // String!
  }
  MovieReviewRes: { // field return type
    id: number; // Int!
    page: number; // Int!
    results: Array<NexusGenRootTypes['MovieReviewResult'] | null>; // [MovieReviewResult]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  MovieReviewResult: { // field return type
    author: string; // String!
    author_details: NexusGenRootTypes['MovieReviewAuthorDetails']; // MovieReviewAuthorDetails!
    content: string; // String!
    created_at: string; // String!
    id: string; // String!
    updated_at: string; // String!
    url: string; // String!
  }
  MoviesInTheatresRes: { // field return type
    dates: NexusGenRootTypes['TheatreDates']; // TheatreDates!
    page: string; // String!
    results: Array<NexusGenRootTypes['MovieResult'] | null>; // [MovieResult]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  MoviesRes: { // field return type
    page: number; // Int!
    results: NexusGenRootTypes['MovieResult'][]; // [MovieResult!]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  Mutation: { // field return type
    createdUser: NexusGenRootTypes['User']; // User!
  }
  Query: { // field return type
    movieDetails: NexusGenRootTypes['MovieDetailsRes']; // MovieDetailsRes!
    movieReviews: NexusGenRootTypes['MovieReviewRes']; // MovieReviewRes!
    moviesInTheatres: NexusGenRootTypes['MoviesInTheatresRes']; // MoviesInTheatresRes!
    popularAnimeMovies: NexusGenRootTypes['MoviesRes']; // MoviesRes!
    popularAnimeShows: NexusGenRootTypes['ShowsRes']; // ShowsRes!
    popularMovies: NexusGenRootTypes['MoviesRes']; // MoviesRes!
    popularMoviesByGenre: NexusGenRootTypes['MoviesRes']; // MoviesRes!
    popularShows: NexusGenRootTypes['ShowsRes']; // ShowsRes!
    popularShowsByGenre: NexusGenRootTypes['ShowsRes']; // ShowsRes!
    recommendedMovies: NexusGenRootTypes['MoviesRes']; // MoviesRes!
    recommendedShows: NexusGenRootTypes['ShowsRes']; // ShowsRes!
    searchedMovies: NexusGenRootTypes['MoviesRes']; // MoviesRes!
    searchedShows: NexusGenRootTypes['ShowsRes']; // ShowsRes!
    showDetails: NexusGenRootTypes['ShowDetailsRes']; // ShowDetailsRes!
    showReviews: NexusGenRootTypes['ShowReviewRes']; // ShowReviewRes!
    testgql: string | null; // String
    topRatedMovies: NexusGenRootTypes['MoviesRes']; // MoviesRes!
    topRatedMoviesByGenre: NexusGenRootTypes['MoviesRes']; // MoviesRes!
    topRatedShows: NexusGenRootTypes['ShowsRes']; // ShowsRes!
    topRatedShowsByGenre: NexusGenRootTypes['ShowsRes']; // ShowsRes!
    trendingMovies: NexusGenRootTypes['MoviesRes']; // MoviesRes!
    trendingShows: NexusGenRootTypes['ShowsRes']; // ShowsRes!
    users: NexusGenRootTypes['User'][]; // [User!]!
  }
  ShowDetailsCountry: { // field return type
    iso_3166_1: string; // String!
    name: string; // String!
  }
  ShowDetailsCreatedBy: { // field return type
    credit_id: string; // String!
    gender: number; // Int!
    id: number; // Int!
    name: string; // String!
    profile_path: string; // String!
  }
  ShowDetailsGenre: { // field return type
    id: number; // Int!
    name: string; // String!
  }
  ShowDetailsLastEpToAir: { // field return type
    air_date: string; // String!
    episode_number: number; // Int!
    id: number; // Int!
    name: string; // String!
    overview: string; // String!
    production_code: string; // String!
    runtime: number; // Int!
    season_number: number; // Int!
    show_id: number; // Int!
    still_path: string | null; // String
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  ShowDetailsNetwork: { // field return type
    id: number; // Int!
    logo_path: string | null; // String
    name: string; // String!
    origin_country: string; // String!
  }
  ShowDetailsNextEpToAir: { // field return type
    air_date: string; // String!
    episode_number: number; // Int!
    id: number; // Int!
    name: string; // String!
    overview: string; // String!
    production_code: string; // String!
    runtime: number; // Int!
    season_number: number; // Int!
    show_id: number; // Int!
    still_path: string | null; // String
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  ShowDetailsProdCompany: { // field return type
    id: number; // Int!
    logo_path: string | null; // String
    name: string; // String!
    origin_country: string; // String!
  }
  ShowDetailsRes: { // field return type
    adult: boolean; // Boolean!
    backdrop_path: string | null; // String
    created_by: Array<NexusGenRootTypes['ShowDetailsCreatedBy'] | null>; // [ShowDetailsCreatedBy]!
    episode_run_time: Array<number | null>; // [Int]!
    first_air_date: string; // String!
    genres: NexusGenRootTypes['ShowDetailsGenre'][]; // [ShowDetailsGenre!]!
    homepage: string; // String!
    id: number; // Int!
    in_production: boolean; // Boolean!
    languages: Array<string | null>; // [String]!
    last_air_date: string; // String!
    last_episode_to_air: NexusGenRootTypes['ShowDetailsLastEpToAir']; // ShowDetailsLastEpToAir!
    name: string; // String!
    networks: NexusGenRootTypes['ShowDetailsNetwork'][]; // [ShowDetailsNetwork!]!
    next_episode_to_air: NexusGenRootTypes['ShowDetailsNextEpToAir'] | null; // ShowDetailsNextEpToAir
    number_of_episodes: number; // Int!
    number_of_seasons: number; // Int!
    origin_country: Array<string | null>; // [String]!
    original_language: string; // String!
    original_name: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path: string; // String!
    production_companies: Array<NexusGenRootTypes['ShowDetailsProdCompany'] | null>; // [ShowDetailsProdCompany]!
    production_countries: Array<NexusGenRootTypes['ShowDetailsCountry'] | null>; // [ShowDetailsCountry]!
    seasons: Array<NexusGenRootTypes['ShowDetailsSeason'] | null>; // [ShowDetailsSeason]!
    spoken_languages: Array<NexusGenRootTypes['ShowDetailsSpokenLang'] | null>; // [ShowDetailsSpokenLang]!
    status: string; // String!
    tagline: string; // String!
    type: string; // String!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  ShowDetailsSeason: { // field return type
    air_date: string; // String!
    episode_count: number; // Int!
    id: number; // Int!
    name: string; // String!
    overview: string; // String!
    poster_path: string; // String!
    season_number: number; // Int!
  }
  ShowDetailsSpokenLang: { // field return type
    english_name: string; // String!
    iso_639_1: string; // String!
    name: string; // String!
  }
  ShowResult: { // field return type
    backdrop_path: string | null; // String
    first_air_date: string | null; // String
    genre_ids: Array<number | null>; // [Int]!
    id: number; // Int!
    name: string; // String!
    origin_country: Array<string | null>; // [String]!
    original_language: string; // String!
    original_name: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path: string | null; // String
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  ShowReviewAuthorDetails: { // field return type
    avatar_path: string | null; // String
    name: string; // String!
    rating: number | null; // Float
    username: string; // String!
  }
  ShowReviewRes: { // field return type
    id: number; // Int!
    page: number; // Int!
    results: Array<NexusGenRootTypes['ShowReviewResult'] | null>; // [ShowReviewResult]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  ShowReviewResult: { // field return type
    author: string; // String!
    author_details: NexusGenRootTypes['ShowReviewAuthorDetails']; // ShowReviewAuthorDetails!
    content: string; // String!
    created_at: string; // String!
    id: string; // String!
    updated_at: string; // String!
    url: string; // String!
  }
  ShowsRes: { // field return type
    page: number; // Int!
    results: NexusGenRootTypes['ShowResult'][]; // [ShowResult!]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  TheatreDates: { // field return type
    maximum: string; // String!
    minimum: string; // String!
  }
  User: { // field return type
    email: string; // String!
    id: string; // String!
    name: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  MovieDetailsGenre: { // field return type name
    id: 'Int'
    name: 'String'
  }
  MovieDetailsProdCompany: { // field return type name
    id: 'Int'
    logo_path: 'String'
    name: 'String'
    origin_country: 'String'
  }
  MovieDetailsProdCountry: { // field return type name
    iso_3166_1: 'String'
    name: 'String'
  }
  MovieDetailsRes: { // field return type name
    adult: 'Boolean'
    backdrop_path: 'String'
    genres: 'MovieDetailsGenre'
    homepage: 'String'
    id: 'Int'
    imdb_id: 'String'
    original_language: 'String'
    original_title: 'String'
    overview: 'String'
    popularity: 'Float'
    poster_path: 'String'
    production_companies: 'MovieDetailsProdCompany'
    production_countries: 'MovieDetailsProdCountry'
    release_date: 'String'
    revenue: 'Int'
    runtime: 'Int'
    spoken_languages: 'MovieDetailsSpokenLang'
    status: 'String'
    tagline: 'String'
    title: 'String'
    video: 'Boolean'
    vote_average: 'Float'
    vote_count: 'Int'
  }
  MovieDetailsSpokenLang: { // field return type name
    english_name: 'String'
    iso_639_1: 'String'
    name: 'String'
  }
  MovieResult: { // field return type name
    adult: 'Boolean'
    backdrop_path: 'String'
    genre_ids: 'Int'
    id: 'Int'
    original_language: 'String'
    original_title: 'String'
    overview: 'String'
    popularity: 'Float'
    poster_path: 'String'
    release_date: 'String'
    title: 'String'
    video: 'Boolean'
    vote_average: 'Float'
    vote_count: 'Int'
  }
  MovieReviewAuthorDetails: { // field return type name
    avatar_path: 'String'
    name: 'String'
    rating: 'Float'
    username: 'String'
  }
  MovieReviewRes: { // field return type name
    id: 'Int'
    page: 'Int'
    results: 'MovieReviewResult'
    total_pages: 'Int'
    total_results: 'Int'
  }
  MovieReviewResult: { // field return type name
    author: 'String'
    author_details: 'MovieReviewAuthorDetails'
    content: 'String'
    created_at: 'String'
    id: 'String'
    updated_at: 'String'
    url: 'String'
  }
  MoviesInTheatresRes: { // field return type name
    dates: 'TheatreDates'
    page: 'String'
    results: 'MovieResult'
    total_pages: 'Int'
    total_results: 'Int'
  }
  MoviesRes: { // field return type name
    page: 'Int'
    results: 'MovieResult'
    total_pages: 'Int'
    total_results: 'Int'
  }
  Mutation: { // field return type name
    createdUser: 'User'
  }
  Query: { // field return type name
    movieDetails: 'MovieDetailsRes'
    movieReviews: 'MovieReviewRes'
    moviesInTheatres: 'MoviesInTheatresRes'
    popularAnimeMovies: 'MoviesRes'
    popularAnimeShows: 'ShowsRes'
    popularMovies: 'MoviesRes'
    popularMoviesByGenre: 'MoviesRes'
    popularShows: 'ShowsRes'
    popularShowsByGenre: 'ShowsRes'
    recommendedMovies: 'MoviesRes'
    recommendedShows: 'ShowsRes'
    searchedMovies: 'MoviesRes'
    searchedShows: 'ShowsRes'
    showDetails: 'ShowDetailsRes'
    showReviews: 'ShowReviewRes'
    testgql: 'String'
    topRatedMovies: 'MoviesRes'
    topRatedMoviesByGenre: 'MoviesRes'
    topRatedShows: 'ShowsRes'
    topRatedShowsByGenre: 'ShowsRes'
    trendingMovies: 'MoviesRes'
    trendingShows: 'ShowsRes'
    users: 'User'
  }
  ShowDetailsCountry: { // field return type name
    iso_3166_1: 'String'
    name: 'String'
  }
  ShowDetailsCreatedBy: { // field return type name
    credit_id: 'String'
    gender: 'Int'
    id: 'Int'
    name: 'String'
    profile_path: 'String'
  }
  ShowDetailsGenre: { // field return type name
    id: 'Int'
    name: 'String'
  }
  ShowDetailsLastEpToAir: { // field return type name
    air_date: 'String'
    episode_number: 'Int'
    id: 'Int'
    name: 'String'
    overview: 'String'
    production_code: 'String'
    runtime: 'Int'
    season_number: 'Int'
    show_id: 'Int'
    still_path: 'String'
    vote_average: 'Float'
    vote_count: 'Int'
  }
  ShowDetailsNetwork: { // field return type name
    id: 'Int'
    logo_path: 'String'
    name: 'String'
    origin_country: 'String'
  }
  ShowDetailsNextEpToAir: { // field return type name
    air_date: 'String'
    episode_number: 'Int'
    id: 'Int'
    name: 'String'
    overview: 'String'
    production_code: 'String'
    runtime: 'Int'
    season_number: 'Int'
    show_id: 'Int'
    still_path: 'String'
    vote_average: 'Float'
    vote_count: 'Int'
  }
  ShowDetailsProdCompany: { // field return type name
    id: 'Int'
    logo_path: 'String'
    name: 'String'
    origin_country: 'String'
  }
  ShowDetailsRes: { // field return type name
    adult: 'Boolean'
    backdrop_path: 'String'
    created_by: 'ShowDetailsCreatedBy'
    episode_run_time: 'Int'
    first_air_date: 'String'
    genres: 'ShowDetailsGenre'
    homepage: 'String'
    id: 'Int'
    in_production: 'Boolean'
    languages: 'String'
    last_air_date: 'String'
    last_episode_to_air: 'ShowDetailsLastEpToAir'
    name: 'String'
    networks: 'ShowDetailsNetwork'
    next_episode_to_air: 'ShowDetailsNextEpToAir'
    number_of_episodes: 'Int'
    number_of_seasons: 'Int'
    origin_country: 'String'
    original_language: 'String'
    original_name: 'String'
    overview: 'String'
    popularity: 'Float'
    poster_path: 'String'
    production_companies: 'ShowDetailsProdCompany'
    production_countries: 'ShowDetailsCountry'
    seasons: 'ShowDetailsSeason'
    spoken_languages: 'ShowDetailsSpokenLang'
    status: 'String'
    tagline: 'String'
    type: 'String'
    vote_average: 'Float'
    vote_count: 'Int'
  }
  ShowDetailsSeason: { // field return type name
    air_date: 'String'
    episode_count: 'Int'
    id: 'Int'
    name: 'String'
    overview: 'String'
    poster_path: 'String'
    season_number: 'Int'
  }
  ShowDetailsSpokenLang: { // field return type name
    english_name: 'String'
    iso_639_1: 'String'
    name: 'String'
  }
  ShowResult: { // field return type name
    backdrop_path: 'String'
    first_air_date: 'String'
    genre_ids: 'Int'
    id: 'Int'
    name: 'String'
    origin_country: 'String'
    original_language: 'String'
    original_name: 'String'
    overview: 'String'
    popularity: 'Float'
    poster_path: 'String'
    vote_average: 'Float'
    vote_count: 'Int'
  }
  ShowReviewAuthorDetails: { // field return type name
    avatar_path: 'String'
    name: 'String'
    rating: 'Float'
    username: 'String'
  }
  ShowReviewRes: { // field return type name
    id: 'Int'
    page: 'Int'
    results: 'ShowReviewResult'
    total_pages: 'Int'
    total_results: 'Int'
  }
  ShowReviewResult: { // field return type name
    author: 'String'
    author_details: 'ShowReviewAuthorDetails'
    content: 'String'
    created_at: 'String'
    id: 'String'
    updated_at: 'String'
    url: 'String'
  }
  ShowsRes: { // field return type name
    page: 'Int'
    results: 'ShowResult'
    total_pages: 'Int'
    total_results: 'Int'
  }
  TheatreDates: { // field return type name
    maximum: 'String'
    minimum: 'String'
  }
  User: { // field return type name
    email: 'String'
    id: 'String'
    name: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createdUser: { // args
      email: string; // String!
      name: string; // String!
    }
  }
  Query: {
    movieDetails: { // args
      id: number; // Int!
    }
    movieReviews: { // args
      id: number; // Int!
    }
    popularMoviesByGenre: { // args
      genre: string; // String!
      mediaType: string; // String!
    }
    popularShowsByGenre: { // args
      genre: string; // String!
      mediaType: string; // String!
    }
    recommendedMovies: { // args
      id: number; // Int!
    }
    recommendedShows: { // args
      id: number; // Int!
    }
    searchedMovies: { // args
      q: string; // String!
    }
    searchedShows: { // args
      q: string; // String!
    }
    showDetails: { // args
      id: number; // Int!
    }
    showReviews: { // args
      id: number; // Int!
    }
    topRatedMoviesByGenre: { // args
      genre: string; // String!
      mediaType: string; // String!
    }
    topRatedShowsByGenre: { // args
      genre: string; // String!
      mediaType: string; // String!
    }
    trendingMovies: { // args
      timeWindow: string; // String!
    }
    trendingShows: { // args
      timeWindow: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}