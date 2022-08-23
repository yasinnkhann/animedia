import { objectType, extendType, nonNull, stringArg } from 'nexus';
import axios from 'axios';
import { BASE_URL } from '../../utils/base_url';
import { GET_KEYWORD_ID } from '../../utils/getkeywordID';

export const MovieResults = objectType({
	name: 'MovieResult',
	definition(t) {
		t.nonNull.boolean('adult');
		t.nonNull.string('backdrop_path');
		t.nonNull.list.int('genre_ids');
		t.nonNull.int('id');
		t.nonNull.string('original_language');
		t.nonNull.string('original_title');
		t.nonNull.string('overview');
		t.nonNull.float('popularity');
		t.nonNull.string('poster_path');
		t.nonNull.string('release_date');
		t.nonNull.string('title');
		t.nonNull.boolean('video');
		t.nonNull.float('vote_average');
		t.nonNull.int('vote_count');
	},
});

export const Movie = objectType({
	name: 'MoviesRes',
	definition(t) {
		t.nonNull.int('page');
		t.nonNull.int('total_pages');
		t.nonNull.int('total_results');
		t.nonNull.list.field('results', {
			type: nonNull('MovieResult'),
		});
	},
});

export const getPopularMovies = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularMovies', {
			type: 'MoviesRes',
			resolve: async () => {
				const { data } = await axios.get(
					`${BASE_URL}/movie/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
				);

				return data;
			},
		});
	},
});

export const getSearchedMovies = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('searchedMovies', {
			type: 'MoviesRes',
			args: {
				q: nonNull(stringArg()),
			},
			resolve: async (_parent, { q }) => {
				q = q.split(' ').join('+');
				const { data } = await axios.get(
					`${BASE_URL}/search/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${q}`
				);

				return data;
			},
		});
	},
});

export const getPopularAnimeMovies = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('popularAnimeMovies', {
			type: 'MoviesRes',
			resolve: async () => {
				const keywordID = await GET_KEYWORD_ID('anime');

				const { data } = await axios.get(
					`${BASE_URL}/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&sort_by=popularity.desc&page=1&with_keywords=${keywordID}`
				);

				return data;
			},
		});
	},
});
