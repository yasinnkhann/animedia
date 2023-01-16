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

export const MOVIE_GENRE_TYPE_OPTIONS: {
	value: NexusGenEnums['MovieGenreTypes'];
	text: string;
}[] = [
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

export const SHOW_GENRE_TYPE_OPTIONS: {
	value: NexusGenEnums['ShowGenreTypes'];
	text: string;
}[] = [
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

export const ratingOptions = [
	{
		value: '',
		text: 'Select Rating',
	},
	{
		value: 10,
		text: '(10) Masterpiece',
	},
	{
		value: 9,
		text: '(9) Great',
	},
	{
		value: 8,
		text: '(8) Very Good',
	},
	{
		value: 7,
		text: '(7) Good',
	},
	{
		value: 6,
		text: '(6) Fine',
	},
	{
		value: 5,
		text: '(5) Average',
	},
	{
		value: 4,
		text: '(4) Bad',
	},
	{
		value: 3,
		text: '(3) Very Bad',
	},
	{
		value: 2,
		text: '(2) Horrible',
	},
	{
		value: 1,
		text: '(1) Appalling',
	},
];

export const watchStatusOptions: {
	value: NexusGenEnums['WatchStatusTypes'];
	text: string;
}[] = [
	{
		value: 'NOT_WATCHING',
		text: 'Not Watching',
	},
	{
		value: 'WATCHING',
		text: 'Watching',
	},
	{
		value: 'PLAN_TO_WATCH',
		text: 'Plan to Watch',
	},
	{
		value: 'COMPLETED',
		text: 'Completed',
	},
	{
		value: 'ON_HOLD',
		text: 'On Hold',
	},
	{
		value: 'DROPPED',
		text: 'Dropped',
	},
];
