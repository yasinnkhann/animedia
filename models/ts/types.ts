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
	MoviesRes,
	ShowsRes,
	PeopleRes,
	PopularGamesByGenreQuery,
	TopRatedGamesByGenreQuery,
	MovieResult,
	ShowResult,
} from 'graphql/generated/code-gen/graphql';

export type NullablePartial<T, K extends keyof T> = {
	[P in keyof T]: P extends K ? T[P] | null | undefined : T[P];
};

export type ExtractStrict<T, U extends T> = U;

export type THomeHorizontalScrollerData = MovieResult[] | ShowResult[];

export type TStatusParam = 'watching' | 'completed' | 'on-hold' | 'dropped' | 'plan-to-watch';

const searchResultsConst = ['movies', 'shows', 'people', 'games'] as const;

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

export type TGamesGenreData =
	| PopularGamesByGenreQuery['popularGamesByGenre']
	| TopRatedGamesByGenreQuery['topRatedGamesByGenre'];

export type TDropDownSearchResult = NullablePartial<
	{
		id: string;
		titleName: string;
		releaseDate?: string;
		firstAirDate?: string;
		knownForDepartment?: string;
		type: 'movie' | 'show' | 'game' | 'person';
	},
	'titleName' | 'releaseDate' | 'firstAirDate' | 'knownForDepartment' | 'type'
>;

const contentConst = [
	'movie',
	'movies',
	'show',
	'shows',
	'person',
	'people',
	'game',
	'games',
] as const;

export type TContent = (typeof contentConst)[number];

export type TTheMovieDBRes = MoviesRes | ShowsRes | PeopleRes;

const igdbImageSizesConst = [
	'cover_small',
	'screenshot_med',
	'cover_big',
	'logo_med',
	'screenshot_big',
	'screenshot_huge',
	'thumb',
	'micro',
	'720p',
	'1080p',
] as const;

export type TIGDBImageSizes = (typeof igdbImageSizesConst)[number];

export type TEpisodeCountDisplay = 'total-episodes' | 'season-episode';

export type TSeasonEpisodeAction = 'increment' | 'decrement';
