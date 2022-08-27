/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../context"
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
  MoviesRes: { // root type
    page: number; // Int!
    results: NexusGenRootTypes['MovieResult'][]; // [MovieResult!]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  Mutation: {};
  Query: {};
  ShowResult: { // root type
    backdrop_path?: string | null; // String
    first_air_date: string; // String!
    genre_ids: Array<number | null>; // [Int]!
    id: number; // Int!
    name: string; // String!
    origin_country: Array<string | null>; // [String]!
    original_language: string; // String!
    original_name: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path: string; // String!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  ShowsRes: { // root type
    page: number; // Int!
    results: NexusGenRootTypes['ShowResult'][]; // [ShowResult!]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  User: { // root type
    email: string; // String!
    id: string; // String!
    name: string; // String!
  }
  movieDetailsGenre: { // root type
    id: number; // Int!
    name: string; // String!
  }
  movieDetailsProdCompany: { // root type
    id: number; // Int!
    logo_path?: string | null; // String
    name: string; // String!
    origin_country: string; // String!
  }
  movieDetailsProdCountry: { // root type
    iso_3166_1: string; // String!
    name: string; // String!
  }
  movieDetailsRes: { // root type
    adult: boolean; // Boolean!
    backdrop_path: string; // String!
    genres: NexusGenRootTypes['movieDetailsGenre'][]; // [movieDetailsGenre!]!
    homepage: string; // String!
    id: number; // Int!
    imdb_id: string; // String!
    original_language: string; // String!
    original_title: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path: string; // String!
    production_companies: Array<NexusGenRootTypes['movieDetailsProdCompany'] | null>; // [movieDetailsProdCompany]!
    production_countries: Array<NexusGenRootTypes['movieDetailsProdCountry'] | null>; // [movieDetailsProdCountry]!
    release_date: string; // String!
    revenue: number; // Int!
    runtime: number; // Int!
    spoken_languages: Array<NexusGenRootTypes['movieDetailsSpokenLang'] | null>; // [movieDetailsSpokenLang]!
    status: string; // String!
    tagline: string; // String!
    title: string; // String!
    video: boolean; // Boolean!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  movieDetailsSpokenLang: { // root type
    english_name: string; // String!
    iso_639_1: string; // String!
    name: string; // String!
  }
  movieReviewAuthorDetails: { // root type
    avatar_path?: string | null; // String
    name: string; // String!
    rating?: number | null; // Float
    username: string; // String!
  }
  movieReviewRes: { // root type
    id: number; // Int!
    page: number; // Int!
    results: Array<NexusGenRootTypes['movieReviewResult'] | null>; // [movieReviewResult]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  movieReviewResult: { // root type
    author: string; // String!
    author_details: NexusGenRootTypes['movieReviewAuthorDetails']; // movieReviewAuthorDetails!
    content: string; // String!
    created_at: string; // String!
    id: string; // String!
    updated_at: string; // String!
    url: string; // String!
  }
  moviesInTheatresRes: { // root type
    dates: NexusGenRootTypes['theatreDates']; // theatreDates!
    page: string; // String!
    results: Array<NexusGenRootTypes['MovieResult'] | null>; // [MovieResult]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  showDetailsCountry: { // root type
    iso_3166_1: string; // String!
    name: string; // String!
  }
  showDetailsCreatedBy: { // root type
    credit_id: string; // String!
    gender: number; // Int!
    id: number; // Int!
    name: string; // String!
    profile_path: string; // String!
  }
  showDetailsGenre: { // root type
    id: number; // Int!
    name: string; // String!
  }
  showDetailsLastEpToAir: { // root type
    air_date: string; // String!
    episode_number: number; // Int!
    id: number; // Int!
    name: string; // String!
    overview: string; // String!
    production_code: string; // String!
    runtime: number; // Int!
    season_number: number; // Int!
    show_id: number; // Int!
    still_path: string; // String!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  showDetailsNetwork: { // root type
    id: number; // Int!
    logo_path: string; // String!
    name: string; // String!
    origin_country: string; // String!
  }
  showDetailsNextEpToAir: { // root type
    air_date: string; // String!
    episode_number: number; // Int!
    id: number; // Int!
    name: string; // String!
    overview: string; // String!
    production_code: string; // String!
    runtime: number; // Int!
    season_number: number; // Int!
    show_id: number; // Int!
    still_path: string; // String!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  showDetailsProdCompany: { // root type
    id: number; // Int!
    logo_path?: string | null; // String
    name: string; // String!
    origin_country: string; // String!
  }
  showDetailsRes: { // root type
    adult: boolean; // Boolean!
    backdrop_path: string; // String!
    created_by: Array<NexusGenRootTypes['showDetailsCreatedBy'] | null>; // [showDetailsCreatedBy]!
    episode_run_time: Array<number | null>; // [Int]!
    first_air_date: string; // String!
    genres: NexusGenRootTypes['showDetailsGenre'][]; // [showDetailsGenre!]!
    homepage: string; // String!
    id: number; // Int!
    in_production: boolean; // Boolean!
    languages: Array<string | null>; // [String]!
    last_air_date: string; // String!
    last_episode_to_air: NexusGenRootTypes['showDetailsLastEpToAir']; // showDetailsLastEpToAir!
    name: string; // String!
    networks: NexusGenRootTypes['showDetailsNetwork'][]; // [showDetailsNetwork!]!
    next_episode_to_air?: NexusGenRootTypes['showDetailsNextEpToAir'] | null; // showDetailsNextEpToAir
    number_of_episodes: number; // Int!
    number_of_seasons: number; // Int!
    origin_country: Array<string | null>; // [String]!
    original_language: string; // String!
    original_name: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path: string; // String!
    production_companies: Array<NexusGenRootTypes['showDetailsProdCompany'] | null>; // [showDetailsProdCompany]!
    production_countries: Array<NexusGenRootTypes['showDetailsCountry'] | null>; // [showDetailsCountry]!
    seasons: Array<NexusGenRootTypes['showDetailsSeason'] | null>; // [showDetailsSeason]!
    spoken_languages: Array<NexusGenRootTypes['showDetailsSpokenLang'] | null>; // [showDetailsSpokenLang]!
    status: string; // String!
    tagline: string; // String!
    type: string; // String!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  showDetailsSeason: { // root type
    air_date: string; // String!
    episode_count: number; // Int!
    id: number; // Int!
    name: string; // String!
    overview: string; // String!
    poster_path: string; // String!
    season_number: number; // Int!
  }
  showDetailsSpokenLang: { // root type
    english_name: string; // String!
    iso_639_1: string; // String!
    name: string; // String!
  }
  showReviewAuthorDetails: { // root type
    avatar_path?: string | null; // String
    name: string; // String!
    rating?: number | null; // Float
    username: string; // String!
  }
  showReviewRes: { // root type
    id: number; // Int!
    page: number; // Int!
    results: Array<NexusGenRootTypes['showReviewResult'] | null>; // [showReviewResult]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  showReviewResult: { // root type
    author: string; // String!
    author_details: NexusGenRootTypes['showReviewAuthorDetails']; // showReviewAuthorDetails!
    content: string; // String!
    created_at: string; // String!
    id: string; // String!
    updated_at: string; // String!
    url: string; // String!
  }
  theatreDates: { // root type
    maximum: string; // String!
    minimum: string; // String!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
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
    movieDetails: NexusGenRootTypes['movieDetailsRes']; // movieDetailsRes!
    movieReviews: NexusGenRootTypes['movieReviewRes']; // movieReviewRes!
    moviesInTheatres: NexusGenRootTypes['moviesInTheatresRes']; // moviesInTheatresRes!
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
    showDetails: NexusGenRootTypes['showDetailsRes']; // showDetailsRes!
    showReviews: NexusGenRootTypes['showReviewRes']; // showReviewRes!
    testgql: string | null; // String
    topRatedMovies: NexusGenRootTypes['MoviesRes']; // MoviesRes!
    topRatedMoviesByGenre: NexusGenRootTypes['MoviesRes']; // MoviesRes!
    topRatedShows: NexusGenRootTypes['ShowsRes']; // ShowsRes!
    topRatedShowsByGenre: NexusGenRootTypes['ShowsRes']; // ShowsRes!
    trendingMovies: NexusGenRootTypes['MoviesRes']; // MoviesRes!
    trendingShows: NexusGenRootTypes['ShowsRes']; // ShowsRes!
    users: NexusGenRootTypes['User'][]; // [User!]!
  }
  ShowResult: { // field return type
    backdrop_path: string | null; // String
    first_air_date: string; // String!
    genre_ids: Array<number | null>; // [Int]!
    id: number; // Int!
    name: string; // String!
    origin_country: Array<string | null>; // [String]!
    original_language: string; // String!
    original_name: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path: string; // String!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  ShowsRes: { // field return type
    page: number; // Int!
    results: NexusGenRootTypes['ShowResult'][]; // [ShowResult!]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  User: { // field return type
    email: string; // String!
    id: string; // String!
    name: string; // String!
  }
  movieDetailsGenre: { // field return type
    id: number; // Int!
    name: string; // String!
  }
  movieDetailsProdCompany: { // field return type
    id: number; // Int!
    logo_path: string | null; // String
    name: string; // String!
    origin_country: string; // String!
  }
  movieDetailsProdCountry: { // field return type
    iso_3166_1: string; // String!
    name: string; // String!
  }
  movieDetailsRes: { // field return type
    adult: boolean; // Boolean!
    backdrop_path: string; // String!
    genres: NexusGenRootTypes['movieDetailsGenre'][]; // [movieDetailsGenre!]!
    homepage: string; // String!
    id: number; // Int!
    imdb_id: string; // String!
    original_language: string; // String!
    original_title: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path: string; // String!
    production_companies: Array<NexusGenRootTypes['movieDetailsProdCompany'] | null>; // [movieDetailsProdCompany]!
    production_countries: Array<NexusGenRootTypes['movieDetailsProdCountry'] | null>; // [movieDetailsProdCountry]!
    release_date: string; // String!
    revenue: number; // Int!
    runtime: number; // Int!
    spoken_languages: Array<NexusGenRootTypes['movieDetailsSpokenLang'] | null>; // [movieDetailsSpokenLang]!
    status: string; // String!
    tagline: string; // String!
    title: string; // String!
    video: boolean; // Boolean!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  movieDetailsSpokenLang: { // field return type
    english_name: string; // String!
    iso_639_1: string; // String!
    name: string; // String!
  }
  movieReviewAuthorDetails: { // field return type
    avatar_path: string | null; // String
    name: string; // String!
    rating: number | null; // Float
    username: string; // String!
  }
  movieReviewRes: { // field return type
    id: number; // Int!
    page: number; // Int!
    results: Array<NexusGenRootTypes['movieReviewResult'] | null>; // [movieReviewResult]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  movieReviewResult: { // field return type
    author: string; // String!
    author_details: NexusGenRootTypes['movieReviewAuthorDetails']; // movieReviewAuthorDetails!
    content: string; // String!
    created_at: string; // String!
    id: string; // String!
    updated_at: string; // String!
    url: string; // String!
  }
  moviesInTheatresRes: { // field return type
    dates: NexusGenRootTypes['theatreDates']; // theatreDates!
    page: string; // String!
    results: Array<NexusGenRootTypes['MovieResult'] | null>; // [MovieResult]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  showDetailsCountry: { // field return type
    iso_3166_1: string; // String!
    name: string; // String!
  }
  showDetailsCreatedBy: { // field return type
    credit_id: string; // String!
    gender: number; // Int!
    id: number; // Int!
    name: string; // String!
    profile_path: string; // String!
  }
  showDetailsGenre: { // field return type
    id: number; // Int!
    name: string; // String!
  }
  showDetailsLastEpToAir: { // field return type
    air_date: string; // String!
    episode_number: number; // Int!
    id: number; // Int!
    name: string; // String!
    overview: string; // String!
    production_code: string; // String!
    runtime: number; // Int!
    season_number: number; // Int!
    show_id: number; // Int!
    still_path: string; // String!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  showDetailsNetwork: { // field return type
    id: number; // Int!
    logo_path: string; // String!
    name: string; // String!
    origin_country: string; // String!
  }
  showDetailsNextEpToAir: { // field return type
    air_date: string; // String!
    episode_number: number; // Int!
    id: number; // Int!
    name: string; // String!
    overview: string; // String!
    production_code: string; // String!
    runtime: number; // Int!
    season_number: number; // Int!
    show_id: number; // Int!
    still_path: string; // String!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  showDetailsProdCompany: { // field return type
    id: number; // Int!
    logo_path: string | null; // String
    name: string; // String!
    origin_country: string; // String!
  }
  showDetailsRes: { // field return type
    adult: boolean; // Boolean!
    backdrop_path: string; // String!
    created_by: Array<NexusGenRootTypes['showDetailsCreatedBy'] | null>; // [showDetailsCreatedBy]!
    episode_run_time: Array<number | null>; // [Int]!
    first_air_date: string; // String!
    genres: NexusGenRootTypes['showDetailsGenre'][]; // [showDetailsGenre!]!
    homepage: string; // String!
    id: number; // Int!
    in_production: boolean; // Boolean!
    languages: Array<string | null>; // [String]!
    last_air_date: string; // String!
    last_episode_to_air: NexusGenRootTypes['showDetailsLastEpToAir']; // showDetailsLastEpToAir!
    name: string; // String!
    networks: NexusGenRootTypes['showDetailsNetwork'][]; // [showDetailsNetwork!]!
    next_episode_to_air: NexusGenRootTypes['showDetailsNextEpToAir'] | null; // showDetailsNextEpToAir
    number_of_episodes: number; // Int!
    number_of_seasons: number; // Int!
    origin_country: Array<string | null>; // [String]!
    original_language: string; // String!
    original_name: string; // String!
    overview: string; // String!
    popularity: number; // Float!
    poster_path: string; // String!
    production_companies: Array<NexusGenRootTypes['showDetailsProdCompany'] | null>; // [showDetailsProdCompany]!
    production_countries: Array<NexusGenRootTypes['showDetailsCountry'] | null>; // [showDetailsCountry]!
    seasons: Array<NexusGenRootTypes['showDetailsSeason'] | null>; // [showDetailsSeason]!
    spoken_languages: Array<NexusGenRootTypes['showDetailsSpokenLang'] | null>; // [showDetailsSpokenLang]!
    status: string; // String!
    tagline: string; // String!
    type: string; // String!
    vote_average: number; // Float!
    vote_count: number; // Int!
  }
  showDetailsSeason: { // field return type
    air_date: string; // String!
    episode_count: number; // Int!
    id: number; // Int!
    name: string; // String!
    overview: string; // String!
    poster_path: string; // String!
    season_number: number; // Int!
  }
  showDetailsSpokenLang: { // field return type
    english_name: string; // String!
    iso_639_1: string; // String!
    name: string; // String!
  }
  showReviewAuthorDetails: { // field return type
    avatar_path: string | null; // String
    name: string; // String!
    rating: number | null; // Float
    username: string; // String!
  }
  showReviewRes: { // field return type
    id: number; // Int!
    page: number; // Int!
    results: Array<NexusGenRootTypes['showReviewResult'] | null>; // [showReviewResult]!
    total_pages: number; // Int!
    total_results: number; // Int!
  }
  showReviewResult: { // field return type
    author: string; // String!
    author_details: NexusGenRootTypes['showReviewAuthorDetails']; // showReviewAuthorDetails!
    content: string; // String!
    created_at: string; // String!
    id: string; // String!
    updated_at: string; // String!
    url: string; // String!
  }
  theatreDates: { // field return type
    maximum: string; // String!
    minimum: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
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
    movieDetails: 'movieDetailsRes'
    movieReviews: 'movieReviewRes'
    moviesInTheatres: 'moviesInTheatresRes'
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
    showDetails: 'showDetailsRes'
    showReviews: 'showReviewRes'
    testgql: 'String'
    topRatedMovies: 'MoviesRes'
    topRatedMoviesByGenre: 'MoviesRes'
    topRatedShows: 'ShowsRes'
    topRatedShowsByGenre: 'ShowsRes'
    trendingMovies: 'MoviesRes'
    trendingShows: 'ShowsRes'
    users: 'User'
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
  ShowsRes: { // field return type name
    page: 'Int'
    results: 'ShowResult'
    total_pages: 'Int'
    total_results: 'Int'
  }
  User: { // field return type name
    email: 'String'
    id: 'String'
    name: 'String'
  }
  movieDetailsGenre: { // field return type name
    id: 'Int'
    name: 'String'
  }
  movieDetailsProdCompany: { // field return type name
    id: 'Int'
    logo_path: 'String'
    name: 'String'
    origin_country: 'String'
  }
  movieDetailsProdCountry: { // field return type name
    iso_3166_1: 'String'
    name: 'String'
  }
  movieDetailsRes: { // field return type name
    adult: 'Boolean'
    backdrop_path: 'String'
    genres: 'movieDetailsGenre'
    homepage: 'String'
    id: 'Int'
    imdb_id: 'String'
    original_language: 'String'
    original_title: 'String'
    overview: 'String'
    popularity: 'Float'
    poster_path: 'String'
    production_companies: 'movieDetailsProdCompany'
    production_countries: 'movieDetailsProdCountry'
    release_date: 'String'
    revenue: 'Int'
    runtime: 'Int'
    spoken_languages: 'movieDetailsSpokenLang'
    status: 'String'
    tagline: 'String'
    title: 'String'
    video: 'Boolean'
    vote_average: 'Float'
    vote_count: 'Int'
  }
  movieDetailsSpokenLang: { // field return type name
    english_name: 'String'
    iso_639_1: 'String'
    name: 'String'
  }
  movieReviewAuthorDetails: { // field return type name
    avatar_path: 'String'
    name: 'String'
    rating: 'Float'
    username: 'String'
  }
  movieReviewRes: { // field return type name
    id: 'Int'
    page: 'Int'
    results: 'movieReviewResult'
    total_pages: 'Int'
    total_results: 'Int'
  }
  movieReviewResult: { // field return type name
    author: 'String'
    author_details: 'movieReviewAuthorDetails'
    content: 'String'
    created_at: 'String'
    id: 'String'
    updated_at: 'String'
    url: 'String'
  }
  moviesInTheatresRes: { // field return type name
    dates: 'theatreDates'
    page: 'String'
    results: 'MovieResult'
    total_pages: 'Int'
    total_results: 'Int'
  }
  showDetailsCountry: { // field return type name
    iso_3166_1: 'String'
    name: 'String'
  }
  showDetailsCreatedBy: { // field return type name
    credit_id: 'String'
    gender: 'Int'
    id: 'Int'
    name: 'String'
    profile_path: 'String'
  }
  showDetailsGenre: { // field return type name
    id: 'Int'
    name: 'String'
  }
  showDetailsLastEpToAir: { // field return type name
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
  showDetailsNetwork: { // field return type name
    id: 'Int'
    logo_path: 'String'
    name: 'String'
    origin_country: 'String'
  }
  showDetailsNextEpToAir: { // field return type name
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
  showDetailsProdCompany: { // field return type name
    id: 'Int'
    logo_path: 'String'
    name: 'String'
    origin_country: 'String'
  }
  showDetailsRes: { // field return type name
    adult: 'Boolean'
    backdrop_path: 'String'
    created_by: 'showDetailsCreatedBy'
    episode_run_time: 'Int'
    first_air_date: 'String'
    genres: 'showDetailsGenre'
    homepage: 'String'
    id: 'Int'
    in_production: 'Boolean'
    languages: 'String'
    last_air_date: 'String'
    last_episode_to_air: 'showDetailsLastEpToAir'
    name: 'String'
    networks: 'showDetailsNetwork'
    next_episode_to_air: 'showDetailsNextEpToAir'
    number_of_episodes: 'Int'
    number_of_seasons: 'Int'
    origin_country: 'String'
    original_language: 'String'
    original_name: 'String'
    overview: 'String'
    popularity: 'Float'
    poster_path: 'String'
    production_companies: 'showDetailsProdCompany'
    production_countries: 'showDetailsCountry'
    seasons: 'showDetailsSeason'
    spoken_languages: 'showDetailsSpokenLang'
    status: 'String'
    tagline: 'String'
    type: 'String'
    vote_average: 'Float'
    vote_count: 'Int'
  }
  showDetailsSeason: { // field return type name
    air_date: 'String'
    episode_count: 'Int'
    id: 'Int'
    name: 'String'
    overview: 'String'
    poster_path: 'String'
    season_number: 'Int'
  }
  showDetailsSpokenLang: { // field return type name
    english_name: 'String'
    iso_639_1: 'String'
    name: 'String'
  }
  showReviewAuthorDetails: { // field return type name
    avatar_path: 'String'
    name: 'String'
    rating: 'Float'
    username: 'String'
  }
  showReviewRes: { // field return type name
    id: 'Int'
    page: 'Int'
    results: 'showReviewResult'
    total_pages: 'Int'
    total_results: 'Int'
  }
  showReviewResult: { // field return type name
    author: 'String'
    author_details: 'showReviewAuthorDetails'
    content: 'String'
    created_at: 'String'
    id: 'String'
    updated_at: 'String'
    url: 'String'
  }
  theatreDates: { // field return type name
    maximum: 'String'
    minimum: 'String'
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