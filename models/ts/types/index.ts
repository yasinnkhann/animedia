import {
	PopularMoviesQuery,
	PopularShowsQuery,
	MoviesInTheatresQuery,
	TrendingMoviesQuery,
	TrendingShowsQuery,
	PopularMoviesByGenreQuery,
	TopRatedMoviesByGenreQuery,
	PopularShowsByGenreQuery,
	TopRatedShowsByGenreQuery,
} from 'graphql/generated/code-gen/graphql';
import {
	MovieResult,
	ShowResult,
} from '../../../graphql/generated/code-gen/graphql';

export type THomeHorizontalScrollerData = MovieResult[] | ShowResult[];

export type TStatusParam =
	| 'watching'
	| 'completed'
	| 'on-hold'
	| 'dropped'
	| 'plan-to-watch';

export const searchResultsConst = ['movies', 'shows', 'people'] as const;

export type TSearchResults = (typeof searchResultsConst)[number];

export type TWhatsPopularData =
	| PopularMoviesQuery['popularMovies']
	| PopularShowsQuery['popularShows']
	| MoviesInTheatresQuery['moviesInTheatres'];

export type TTrendingData =
	| TrendingMoviesQuery['trendingMovies']
	| TrendingShowsQuery['trendingShows'];

export type TMoviesGenreData =
	| PopularMoviesByGenreQuery['popularMoviesByGenre']
	| TopRatedMoviesByGenreQuery['topRatedMoviesByGenre'];

export type TShowsGenreData =
	| PopularShowsByGenreQuery['popularShowsByGenre']
	| TopRatedShowsByGenreQuery['topRatedShowsByGenre'];
