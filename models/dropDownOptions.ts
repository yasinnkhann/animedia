import { NexusGenEnums } from 'graphql/generated/nexus-typegen';

export const SORT_BY_OPTIONS = [
	{
		value: 'Popular',
		text: 'Popular',
	},
	{
		value: 'Top Rated',
		text: 'Top Rated',
	},
];

interface IMovieGenreTypeOption {
	value: NexusGenEnums['MovieGenreTypes'];
	text: NexusGenEnums['MovieGenreTypes'];
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
		value: 'Science',
		text: 'Science',
	},
	{
		value: 'TV',
		text: 'TV',
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
