import { builder } from '../builder';
import {
	MovieResult,
	MoviesRes,
	MovieDetailsGenre,
	MovieDetailsProdCompany,
	MovieDetailsProdCountry,
	MovieDetailsSpokenLang,
	MovieDetailsRes,
	MovieReviewAuthorDetails,
	MovieReviewsResult,
	MovieReviewsRes,
	TheatreDates,
	MoviesInTheatresRes,
	MoviesCastModel,
	MoviesCrewModel,
	MoviesCastCrewRes,
} from '../../models/entities';
import { BASE_URL } from 'utils/constants';

builder.objectType(MovieResult, {
	name: 'MovieResult',
	fields: t => ({
		adult: t.exposeBoolean('adult'),
		backdrop_path: t.exposeString('backdrop_path', { nullable: true }),
		genre_ids: t.exposeIntList('genre_ids'),
		id: t.exposeID('id'),
		original_language: t.exposeString('original_language'),
		original_title: t.exposeString('original_title'),
		overview: t.exposeString('overview'),
		popularity: t.exposeFloat('popularity'),
		poster_path: t.exposeString('poster_path', { nullable: true }),
		release_date: t.exposeString('release_date', { nullable: true }),
		title: t.exposeString('title'),
		video: t.exposeBoolean('video'),
		vote_average: t.exposeFloat('vote_average'),
		vote_count: t.exposeInt('vote_count'),
	}),
});

builder.objectType(MoviesRes, {
	name: 'MoviesRes',
	fields: t => ({
		page: t.exposeInt('page'),
		total_pages: t.exposeInt('total_pages'),
		total_results: t.exposeInt('total_results'),
		results: t.expose('results', { type: [MovieResult] }),
	}),
});

builder.objectType(MovieDetailsGenre, {
	name: 'MovieDetailsGenre',
	fields: t => ({
		id: t.exposeID('id'),
		name: t.exposeString('name'),
	}),
});

builder.objectType(MovieDetailsProdCompany, {
	name: 'MovieDetailsProdCompany',
	fields: t => ({
		id: t.exposeID('id'),
		logo_path: t.exposeString('logo_path', { nullable: true }),
		name: t.exposeString('name'),
		origin_country: t.exposeString('origin_country'),
	}),
});

builder.objectType(MovieDetailsProdCountry, {
	name: 'MovieDetailsProdCountry',
	fields: t => ({
		iso_3166_1: t.exposeString('iso_3166_1'),
		name: t.exposeString('name'),
	}),
});

builder.objectType(MovieDetailsSpokenLang, {
	name: 'MovieDetailsSpokenLang',
	fields: t => ({
		english_name: t.exposeString('english_name'),
		iso_639_1: t.exposeString('iso_639_1'),
		name: t.exposeString('name'),
	}),
});

builder.objectType(MovieDetailsRes, {
	name: 'MovieDetailsRes',
	fields: t => ({
		adult: t.exposeBoolean('adult'),
		backdrop_path: t.exposeString('backdrop_path', { nullable: true }),
		genres: t.expose('genres', { type: [MovieDetailsGenre] }),
		homepage: t.exposeString('homepage'),
		id: t.exposeID('id'),
		imdb_id: t.exposeString('imdb_id', { nullable: true }),
		original_language: t.exposeString('original_language'),
		original_title: t.exposeString('original_title'),
		overview: t.exposeString('overview'),
		popularity: t.exposeFloat('popularity'),
		poster_path: t.exposeString('poster_path', { nullable: true }),
		production_companies: t.expose('production_companies', {
			type: [MovieDetailsProdCompany],
		}),
		production_countries: t.expose('production_countries', {
			type: [MovieDetailsProdCountry],
		}),
		release_date: t.exposeString('release_date', { nullable: true }),
		revenue: t.expose('revenue', { type: 'BigInt', nullable: true }),
		runtime: t.exposeInt('runtime', { nullable: true }),
		spoken_languages: t.expose('spoken_languages', {
			type: [MovieDetailsSpokenLang],
		}),
		status: t.exposeString('status'),
		tagline: t.exposeString('tagline'),
		title: t.exposeString('title'),
		video: t.exposeBoolean('video', { nullable: true }),
		vote_average: t.exposeFloat('vote_average'),
		vote_count: t.exposeInt('vote_count'),
	}),
});

builder.objectType(MovieReviewAuthorDetails, {
	name: 'MovieReviewAuthorDetails',
	fields: t => ({
		name: t.exposeString('name'),
		username: t.exposeString('username'),
		avatar_path: t.exposeString('avatar_path', { nullable: true }),
		rating: t.exposeFloat('rating', { nullable: true }),
	}),
});

builder.objectType(MovieReviewsResult, {
	name: 'MovieReviewsResult',
	fields: t => ({
		author: t.exposeString('author'),
		author_details: t.expose('author_details', {
			type: MovieReviewAuthorDetails,
		}),
		content: t.exposeString('content'),
		created_at: t.exposeString('created_at'),
		id: t.exposeID('id'),
		updated_at: t.exposeString('updated_at'),
		url: t.exposeString('url'),
	}),
});

builder.objectType(MovieReviewsRes, {
	name: 'MovieReviewsRes',
	fields: t => ({
		id: t.exposeID('id'),
		page: t.exposeInt('page'),
		total_pages: t.exposeInt('total_pages'),
		total_results: t.exposeInt('total_results'),
		results: t.expose('results', {
			type: [MovieReviewsResult],
		}),
	}),
});

builder.objectType(TheatreDates, {
	name: 'TheatreDates',
	fields: t => ({
		maximum: t.exposeString('maximum'),
		minimum: t.exposeString('minimum'),
	}),
});

builder.objectType(MoviesInTheatresRes, {
	name: 'MoviesInTheatresRes',
	fields: t => ({
		dates: t.expose('dates', { type: TheatreDates }),
		page: t.exposeString('page'),
		total_pages: t.exposeInt('total_pages'),
		total_results: t.exposeInt('total_results'),
		results: t.expose('results', {
			type: [MovieResult],
		}),
	}),
});

builder.objectType(MoviesCastModel, {
	name: 'MoviesCastModel',
	fields: t => ({
		adult: t.exposeBoolean('adult', { nullable: true }),
		gender: t.exposeInt('gender', { nullable: true }),
		id: t.exposeID('id', { nullable: true }),
		known_for_department: t.exposeString('known_for_department', {
			nullable: true,
		}),
		name: t.exposeString('name', {
			nullable: true,
		}),
		original_name: t.exposeString('original_name', {
			nullable: true,
		}),
		popularity: t.exposeFloat('popularity', {
			nullable: true,
		}),
		profile_path: t.exposeString('profile_path', {
			nullable: true,
		}),
		cast_id: t.exposeID('cast_id', {
			nullable: true,
		}),
		character: t.exposeString('character', {
			nullable: true,
		}),
		credit_id: t.exposeID('credit_id', {
			nullable: true,
		}),
		order: t.exposeInt('order', {
			nullable: true,
		}),
	}),
});

builder.objectType(MoviesCrewModel, {
	name: 'MoviesCrewModel',
	fields: t => ({
		adult: t.exposeBoolean('adult', { nullable: true }),
		gender: t.exposeInt('gender', { nullable: true }),
		id: t.exposeID('id', { nullable: true }),
		known_for_department: t.exposeString('known_for_department', {
			nullable: true,
		}),
		name: t.exposeString('name', {
			nullable: true,
		}),
		original_name: t.exposeString('original_name', {
			nullable: true,
		}),
		popularity: t.exposeFloat('popularity', {
			nullable: true,
		}),
		profile_path: t.exposeString('profile_path', {
			nullable: true,
		}),
		credit_id: t.exposeID('credit_id', {
			nullable: true,
		}),
		department: t.exposeString('department', {
			nullable: true,
		}),
		job: t.exposeString('job', {
			nullable: true,
		}),
	}),
});

builder.objectType(MoviesCastCrewRes, {
	name: 'MoviesCastCrewRes',
	fields: t => ({
		id: t.exposeID('id', { nullable: true }),
		cast: t.expose('cast', {
			type: [MoviesCastModel],
			nullable: true,
		}),
		crew: t.expose('crew', {
			type: [MoviesCrewModel],
			nullable: true,
		}),
	}),
});

builder.queryField('popularMovies', t =>
	t.field({
		type: MoviesRes,
		args: {
			page: t.arg.int({ required: false }),
		},
		resolve: async (_root, { page }) => {
			try {
				const res = await fetch(
					`${BASE_URL}/movie/popular?api_key=${process.env
						.API_KEY!}&language=en-US&page=${page ?? 1}`
				);
				const data = await res.json();
				return data;
			} catch (err) {
				console.error(err);
			}
		},
	})
);

builder.queryField('searchedMovies', t =>
	t.field({
		type: MoviesRes,
		args: {
			q: t.arg.string(),
			page: t.arg.int({ required: false }),
		},
		resolve: async (_root, { q, page }) => {
			q = q.split(' ').join('+');
			try {
				const res = await fetch(
					`${BASE_URL}/search/movie?api_key=${process.env
						.API_KEY!}&language=en-US&query=${q}&page=${page ?? 1}`
				);
				const data = await res.json();
				return data;
			} catch (err) {
				console.error(err);
			}
		},
	})
);
