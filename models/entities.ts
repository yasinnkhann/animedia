import type PrismaTypes from '@pothos/plugin-prisma/generated';

export class RegisteredUserRes {
	constructor(
		public error: string | null,
		public createdUser: PrismaTypes['User']['Shape'] | null,
		public ok: boolean,
		public statusCode: number
	) {}
}

export class RedisRes {
	constructor(
		public error: string | null,
		public successMsg: string | null,
		public token?: string | null,
		public userId?: string | null
	) {}
}

export class AccountVerifiedRes {
	constructor(
		public error: string | null,
		public id: string | null,
		public emailVerified: Date | null
	) {}
}

export class HttpRes {
	constructor(
		public error: string | null,
		public successMsg: string | null,
		public ok: boolean,
		public statusCode: number
	) {}
}
export class MovieResult {
	constructor(
		public adult: boolean,
		public backdrop_path: string | null,
		public genre_ids: number[],
		public id: number,
		public original_language: string,
		public original_title: string,
		public overview: string,
		public popularity: number,
		public poster_path: string | null,
		public release_date: string | null,
		public title: string,
		public video: boolean,
		public vote_average: number,
		public vote_count: number
	) {}
}

export class MoviesRes {
	constructor(
		public page: number,
		public total_pages: number,
		public total_results: number,
		public results: MovieResult[]
	) {}
}

export class MovieDetailsGenre {
	constructor(public id: number, public name: string) {}
}

export class MovieDetailsProdCompany {
	constructor(
		public id: number,
		public logo_path: string | null,
		public name: string,
		public origin_country: string
	) {}
}

export class MovieDetailsProdCountry {
	constructor(public iso_3166_1: string, public name: string) {}
}

export class MovieDetailsSpokenLang {
	constructor(
		public english_name: string,
		public iso_639_1: string,
		public name: string
	) {}
}

export class MovieDetailsRes {
	constructor(
		public adult: boolean,
		public backdrop_path: string | null,
		public genres: MovieDetailsGenre[],
		public homepage: string,
		public id: number,
		public imdb_id: string | null,
		public original_language: string,
		public original_title: string,
		public overview: string,
		public popularity: number,
		public poster_path: string | null,
		public production_companies: MovieDetailsProdCompany[],
		public production_countries: MovieDetailsProdCountry[],
		public release_date: string | null,
		public revenue: bigint | null,
		public runtime: number | null,
		public spoken_languages: MovieDetailsSpokenLang[],
		public status: string,
		public tagline: string,
		public title: string,
		public video: boolean | null,
		public vote_average: number,
		public vote_count: number
	) {}
}

export class MovieReviewAuthorDetails {
	constructor(
		public name: string,
		public username: string,
		public avatar_path: string | null,
		public rating: number | null
	) {}
}

export class MovieReviewsResult {
	constructor(
		public author: string,
		public author_details: MovieReviewAuthorDetails,
		public content: string,
		public created_at: string,
		public id: string,
		public updated_at: string,
		public url: string
	) {}
}

export class MovieReviewsRes {
	constructor(
		public id: number,
		public page: number,
		public total_pages: number,
		public total_results: number,
		public results: MovieReviewsResult[]
	) {}
}

export class TheatreDates {
	constructor(public maximum: string, public minimum: string) {}
}

export class MoviesInTheatresRes {
	constructor(
		public dates: TheatreDates,
		public page: string,
		public total_pages: number,
		public total_results: number,
		public results: MovieResult[]
	) {}
}

export class MoviesCastModel {
	constructor(
		public adult: boolean | null,
		public gender: number | null,
		public id: number | null,
		public known_for_department: string | null,
		public name: string | null,
		public original_name: string | null,
		public popularity: number | null,
		public profile_path: string | null,
		public cast_id: number | null,
		public character: string | null,
		public credit_id: string | null,
		public order: number | null
	) {}
}

export class MoviesCrewModel {
	constructor(
		public adult: boolean | null,
		public gender: number | null,
		public id: number | null,
		public known_for_department: string | null,
		public name: string | null,
		public original_name: string | null,
		public popularity: number | null,
		public profile_path: string | null,
		public credit_id: string | null,
		public department: string | null,
		public job: string | null
	) {}
}

export class MoviesCastCrewRes {
	constructor(
		public id: number,
		public cast: MoviesCastModel[],
		public crew: MoviesCrewModel[]
	) {}
}

export class ShowResult {
	constructor(
		public backdrop_path: string | null,
		public first_air_date: string | null,
		public genre_ids: number[],
		public id: number,
		public name: string,
		public origin_country: string[],
		public original_language: string,
		public original_name: string,
		public overview: string,
		public popularity: number,
		public poster_path: string | null,
		public vote_average: number,
		public vote_count: number
	) {}
}

export class ShowsRes {
	constructor(
		public page: number,
		public total_pages: number,
		public total_results: number,
		public results: ShowResult[]
	) {}
}

export class ShowDetailsCreatedBy {
	constructor(
		public id: number | null,
		public credit_id: string | null,
		public name: string | null,
		public gender: number | null,
		public profile_path: string | null
	) {}
}

export class ShowDetailsGenre {
	constructor(public id: number, public name: string) {}
}

export class ShowDetailsLastEpToAir {
	constructor(
		public air_date: string | null,
		public episode_number: number,
		public id: number,
		public name: string,
		public overview: string,
		public production_code: string,
		public runtime: number | null,
		public season_number: number,
		public show_id: number,
		public still_path: string | null,
		public vote_average: number,
		public vote_count: number
	) {}
}

export class ShowDetailsNetwork {
	constructor(
		public id: number,
		public name: string,
		public logo_path: string | null,
		public origin_country: string
	) {}
}

export class ShowDetailsProdCompany {
	constructor(
		public id: number,
		public logo_path: string | null,
		public name: string,
		public origin_country: string
	) {}
}

export class ShowDetailsCountry {
	constructor(public iso_3166_1: string, public name: string) {}
}

export class ShowDetailsSeason {
	constructor(
		public air_date: string | null,
		public episode_count: number,
		public id: number,
		public name: string,
		public overview: string,
		public poster_path: string | null,
		public season_number: number
	) {}
}

export class ShowDetailsSpokenLang {
	constructor(
		public english_name: string,
		public iso_639_1: string,
		public name: string
	) {}
}

export class ShowDetailsNextEpToAir {
	constructor(
		public air_date: string | null,
		public episode_number: number,
		public id: number,
		public name: string,
		public overview: string,
		public production_code: string,
		public runtime: number | null,
		public season_number: number,
		public show_id: number,
		public still_path: string | null,
		public vote_average: number,
		public vote_count: number
	) {}
}

export class ShowDetailsRes {
	constructor(
		public adult: boolean,
		public backdrop_path: string | null,
		public created_by: ShowDetailsCreatedBy[],
		public episode_run_time: number[],
		public first_air_date: string | null,
		public genres: ShowDetailsGenre[],
		public homepage: string,
		public id: number,
		public in_production: boolean,
		public languages: string[],
		public last_air_date: string | null,
		public last_episode_to_air: ShowDetailsLastEpToAir | null,
		public name: string,
		public next_episode_to_air: ShowDetailsNextEpToAir | null,
		public networks: ShowDetailsNetwork[],
		public number_of_episodes: number,
		public number_of_seasons: number,
		public origin_country: string[],
		public original_language: string,
		public original_name: string,
		public overview: string,
		public popularity: number,
		public poster_path: string | null,
		public production_companies: ShowDetailsProdCompany[],
		public production_countries: ShowDetailsCountry[],
		public seasons: ShowDetailsSeason[],
		public spoken_languages: ShowDetailsSpokenLang[],
		public status: string,
		public tagline: string,
		public type: string,
		public vote_average: number,
		public vote_count: number
	) {}
}

export class ShowReviewAuthorDetails {
	constructor(
		public name: string,
		public username: string,
		public avatar_path: string | null,
		public rating: number | null
	) {}
}

export class ShowReviewResult {
	constructor(
		public author: string,
		public author_details: ShowReviewAuthorDetails,
		public content: string,
		public created_at: string,
		public id: string,
		public updated_at: string,
		public url: string
	) {}
}

export class ShowReviewRes {
	constructor(
		public id: number,
		public page: number,
		public total_pages: number,
		public total_results: number,
		public results: ShowReviewResult[]
	) {}
}

export class ShowsCastModel {
	constructor(
		public adult: boolean | null,
		public gender: number | null,
		public id: number | null,
		public known_for_department: string | null,
		public name: string | null,
		public original_name: string | null,
		public popularity: number | null,
		public profile_path: string | null,
		public character: string | null,
		public credit_id: string | null,
		public order: number | null
	) {}
}

export class ShowsCrewModel {
	constructor(
		public adult: boolean | null,
		public gender: number | null,
		public id: number | null,
		public known_for_department: string | null,
		public name: string | null,
		public original_name: string | null,
		public popularity: number | null,
		public profile_path: string | null,
		public credit_id: string | null,
		public department: string | null,
		public job: string | null
	) {}
}

export class ShowsCastCrewRes {
	constructor(
		public id: number | null,
		public cast: ShowsCastModel[] | null,
		public crew: ShowsCrewModel[] | null
	) {}
}

export class EpisodeDetailsRes {
	constructor(
		public air_date: string | null,
		public crew: ShowsCrewModel[] | null,
		public episode_number: number,
		public guest_stars: ShowsCastModel[] | null,
		public name: string,
		public overview: string,
		public id: number,
		public production_code: string,
		public runtime: number,
		public season_number: number,
		public still_path: string | null,
		public vote_average: number,
		public vote_count: number
	) {}
}

export class KnownForResult {
	constructor(
		public adult: boolean | null,
		public backdrop_path: string | null,
		public genre_ids: number[] | null,
		public id: number | null,
		public media_type: string | null,
		public original_language: string | null,
		public original_title: string | null,
		public overview: string | null,
		public poster_path: string | null,
		public release_date: string | null,
		public title: string | null,
		public video: boolean | null,
		public vote_average: number | null,
		public vote_count: number | null
	) {}
}

export class PersonResult {
	constructor(
		public adult: boolean,
		public gender: number,
		public id: number,
		public known_for: KnownForResult[],
		public known_for_department: string | null,
		public name: string,
		public popularity: number,
		public profile_path: string | null
	) {}
}

export class PeopleRes {
	constructor(
		public page: number,
		public total_pages: number,
		public total_results: number,
		public results: PersonResult[]
	) {}
}

export class PersonDetailsRes {
	constructor(
		public adult: boolean | null,
		public also_known_as: string[] | null,
		public biography: string | null,
		public birthday: string | null,
		public deathday: string | null,
		public gender: number | null,
		public homepage: string | null,
		public id: number,
		public imdb_id: string | null,
		public known_for_department: string | null,
		public name: string | null,
		public place_of_birth: string | null,
		public popularity: number | null,
		public profile_path: string | null
	) {}
}

export class PersonsKnownForMovieCast {
	constructor(
		public adult: boolean,
		public backdrop_path: string | null,
		public genre_ids: number[],
		public id: number,
		public original_language: string,
		public original_title: string,
		public overview: string,
		public popularity: number,
		public poster_path: string | null,
		public release_date: string | null,
		public title: string,
		public video: boolean,
		public vote_average: number,
		public vote_count: number,
		public character: string | null,
		public credit_id: string | null,
		public order: number | null
	) {}
}

export class PersonsKnownForMovieCrew {
	constructor(
		public adult: boolean,
		public backdrop_path: string | null,
		public genre_ids: number[],
		public id: number,
		public original_language: string,
		public original_title: string,
		public overview: string,
		public popularity: number,
		public poster_path: string | null,
		public release_date: string | null,
		public title: string,
		public video: boolean,
		public vote_average: number,
		public vote_count: number,
		public credit_id: string | null,
		public department: string | null,
		public job: string | null
	) {}
}

export class PersonsKnownForMovieRes {
	constructor(
		public id: number,
		public cast: PersonsKnownForMovieCast[],
		public crew: PersonsKnownForMovieCrew[]
	) {}
}

export class PersonsKnownForShowCast {
	constructor(
		public adult: boolean,
		public backdrop_path: string | null,
		public genre_ids: number[],
		public id: number,
		public origin_country: string[],
		public original_language: string,
		public original_name: string,
		public overview: string,
		public popularity: number,
		public poster_path: string | null,
		public first_air_date: string | null,
		public name: string,
		public vote_average: number,
		public vote_count: number,
		public character: string | null,
		public credit_id: string | null,
		public episode_count: number | null
	) {}
}

export class PersonsKnownForShowCrew {
	constructor(
		public adult: boolean,
		public backdrop_path: string | null,
		public genre_ids: number[],
		public id: number,
		public origin_country: string[],
		public original_language: string,
		public original_name: string,
		public overview: string,
		public popularity: number,
		public poster_path: string | null,
		public first_air_date: string | null,
		public name: string,
		public vote_average: number,
		public vote_count: number,
		public credit_id: string | null,
		public department: string | null,
		public episode_count: number | null,
		public job: string | null
	) {}
}

export class PersonsKnownForShowRes {
	constructor(
		public id: number,
		public cast: PersonsKnownForShowCast[],
		public crew: PersonsKnownForShowCrew[]
	) {}
}
