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
