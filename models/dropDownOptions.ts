import {
	MovieGenreTypes,
	ShowGenreTypes,
	WatchStatusTypes,
} from '../graphql/generated/code-gen/graphql';

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
	value: MovieGenreTypes;
	text: string;
}[] = [
	{
		value: MovieGenreTypes.Action,
		text: 'Action',
	},
	{
		value: MovieGenreTypes.Adventure,
		text: 'Adventure',
	},
	{
		value: MovieGenreTypes.Animation,
		text: 'Animation',
	},
	{
		value: MovieGenreTypes.Comedy,
		text: 'Comedy',
	},
	{
		value: MovieGenreTypes.Crime,
		text: 'Crime',
	},
	{
		value: MovieGenreTypes.Documentary,
		text: 'Documentary',
	},
	{
		value: MovieGenreTypes.Drama,
		text: 'Drama',
	},
	{
		value: MovieGenreTypes.Family,
		text: 'Family',
	},
	{
		value: MovieGenreTypes.Fantasy,
		text: 'Fantasy',
	},
	{
		value: MovieGenreTypes.History,
		text: 'History',
	},
	{
		value: MovieGenreTypes.Horror,
		text: 'Horror',
	},
	{
		value: MovieGenreTypes.Music,
		text: 'Music',
	},
	{
		value: MovieGenreTypes.Mystery,
		text: 'Mystery',
	},
	{
		value: MovieGenreTypes.Romance,
		text: 'Romance',
	},
	{
		value: MovieGenreTypes.ScienceFiction,
		text: 'Science Fiction',
	},
	{
		value: MovieGenreTypes.TvMovie,
		text: 'TV Movie',
	},
	{
		value: MovieGenreTypes.Thriller,
		text: 'Thriller',
	},
	{
		value: MovieGenreTypes.War,
		text: 'War',
	},
	{
		value: MovieGenreTypes.Western,
		text: 'Western',
	},
];

export const SHOW_GENRE_TYPE_OPTIONS: {
	value: ShowGenreTypes;
	text: string;
}[] = [
	{
		value: ShowGenreTypes.ActionAmpersandAdventure,
		text: 'Action & Adventure',
	},

	{
		value: ShowGenreTypes.Animation,
		text: 'Animation',
	},

	{
		value: ShowGenreTypes.Comedy,
		text: 'Comedy',
	},

	{
		value: ShowGenreTypes.Crime,
		text: 'Crime',
	},

	{
		value: ShowGenreTypes.Documentary,
		text: 'Documentary',
	},

	{
		value: ShowGenreTypes.Drama,
		text: 'Drama',
	},

	{
		value: ShowGenreTypes.Family,
		text: 'Family',
	},

	{
		value: ShowGenreTypes.Kids,
		text: 'Kids',
	},

	{
		value: ShowGenreTypes.Mystery,
		text: 'Mystery',
	},

	{
		value: ShowGenreTypes.News,
		text: 'News',
	},

	{
		value: ShowGenreTypes.Reality,
		text: 'Reality',
	},

	{
		value: ShowGenreTypes.SciDashFiAmpersandFantasy,
		text: 'Sci-Fi & Fantasy',
	},

	{
		value: ShowGenreTypes.Soap,
		text: 'Soap',
	},

	{
		value: ShowGenreTypes.Talk,
		text: 'Talk',
	},

	{
		value: ShowGenreTypes.WarAmpersandPolitics,
		text: 'War & Politics',
	},

	{
		value: ShowGenreTypes.Western,
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
		value: 0,
		text: 'Select Rating',
	},
	{
		value: 1,
		text: '(1) Appalling',
	},
	{
		value: 2,
		text: '(2) Horrible',
	},
	{
		value: 3,
		text: '(3) Very Bad',
	},
	{
		value: 4,
		text: '(4) Bad',
	},
	{
		value: 5,
		text: '(5) Average',
	},
	{
		value: 6,
		text: '(6) Fine',
	},
	{
		value: 7,
		text: '(7) Good',
	},
	{
		value: 8,
		text: '(8) Very Good',
	},
	{
		value: 9,
		text: '(9) Great',
	},
	{
		value: 10,
		text: '(10) Masterpiece',
	},
];

export const watchStatusOptions: {
	value: WatchStatusTypes;
	text: string;
}[] = [
	{
		value: WatchStatusTypes.NotWatching,
		text: 'Not Watching',
	},
	{
		value: WatchStatusTypes.Watching,
		text: 'Watching',
	},
	{
		value: WatchStatusTypes.PlanToWatch,
		text: 'Plan to Watch',
	},
	{
		value: WatchStatusTypes.Completed,
		text: 'Completed',
	},
	{
		value: WatchStatusTypes.OnHold,
		text: 'On Hold',
	},
	{
		value: WatchStatusTypes.Dropped,
		text: 'Dropped',
	},
];
