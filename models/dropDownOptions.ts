import { NexusGenEnums } from 'graphql/generated/nexus-typegen';

export const SORT_BY_OPTIONS = [
	{
		value: 'Popular',
		text: 'Popular',
	},
	{
		value: 'Top-Rated',
		text: 'Top-Rated',
	},
];

interface IMovieGenreTypeOption {
	value: NexusGenEnums['MovieGenreTypes'];
	text: string;
}

export const MOVIE_GENRE_TYPE_OPTIONS: IMovieGenreTypeOption[] = [
	{
		value: 'Action',
		text: 'Action',
	},
	{
		value: 'Adventure',
		text: 'Adventure',
	},
	{
		value: 'Animation',
		text: 'Animation',
	},
	{
		value: 'Comedy',
		text: 'Comedy',
	},
	{
		value: 'Crime',
		text: 'Crime',
	},
	{
		value: 'Documentary',
		text: 'Documentary',
	},
	{
		value: 'Drama',
		text: 'Drama',
	},
	{
		value: 'Family',
		text: 'Family',
	},
	{
		value: 'Fantasy',
		text: 'Fantasy',
	},
	{
		value: 'History',
		text: 'History',
	},
	{
		value: 'Horror',
		text: 'Horror',
	},
	{
		value: 'Music',
		text: 'Music',
	},
	{
		value: 'Mystery',
		text: 'Mystery',
	},
	{
		value: 'Romance',
		text: 'Romance',
	},
	{
		value: 'Science_Fiction',
		text: 'Science Fiction',
	},
	{
		value: 'TV_Movie',
		text: 'TV Movie',
	},
	{
		value: 'Thriller',
		text: 'Thriller',
	},
	{
		value: 'War',
		text: 'War',
	},
	{
		value: 'Western',
		text: 'Western',
	},
];

interface IShowGenreTypeOption {
	value: NexusGenEnums['ShowGenreTypes'];
	text: string;
}

export const SHOW_GENRE_TYPE_OPTIONS: IShowGenreTypeOption[] = [
	{
		value: 'Action_AMPERSAND_Adventure',
		text: 'Action & Adventure',
	},

	{
		value: 'Animation',
		text: 'Animation',
	},

	{
		value: 'Comedy',
		text: 'Comedy',
	},

	{
		value: 'Crime',
		text: 'Crime',
	},

	{
		value: 'Documentary',
		text: 'Documentary',
	},

	{
		value: 'Drama',
		text: 'Drama',
	},

	{
		value: 'Family',
		text: 'Family',
	},

	{
		value: 'Kids',
		text: 'Kids',
	},

	{
		value: 'Mystery',
		text: 'Mystery',
	},

	{
		value: 'News',
		text: 'News',
	},

	{
		value: 'Reality',
		text: 'Reality',
	},

	{
		value: 'SciDASHFi_AMPERSAND_Fantasy',
		text: 'Sci-Fi & Fantasy',
	},

	{
		value: 'Soap',
		text: 'Soap',
	},

	{
		value: 'Talk',
		text: 'Talk',
	},

	{
		value: 'War_AMPERSAND_Politics',
		text: 'War & Politics',
	},

	{
		value: 'Western',
		text: 'Western',
	},
];

export const MOVIES_ITEMS = [
	{
		label: 'Popular Movies',
		key: 'popular',
	},
	{
		label: 'Top Rated Movies',
		key: 'top-rated',
	},
	{
		label: 'Popular Anime Movies',
		key: 'popular-anime',
	},
	{
		label: 'Explore Movies by Genre',
		key: 'genre',
	},
];

export const SHOWS_ITEMS = [
	{
		label: 'Popular Shows',
		key: 'popular',
	},
	{
		label: 'Top Rated Shows',
		key: 'top-rated',
	},
	{
		label: 'Popular Anime Shows',
		key: 'popular-anime',
	},
	{
		label: 'Explore Shows by Genre',
		key: 'genre',
	},
];

export const PEOPLE_ITEMS = [
	{
		label: 'Popular People',
		key: 'popular',
	},
];

export const MY_MEDIA_ITEMS = [
	{
		label: 'Watching',
		key: 'watching',
	},
	{
		label: 'Completed',
		key: 'completed',
	},
	{
		label: 'On Hold',
		key: 'on-hold',
	},
	{
		label: 'Dropped',
		key: 'dropped',
	},
	{
		label: 'Plan To Watch',
		key: 'plan-to-watch',
	},
];
