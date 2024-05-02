import { enumType } from 'nexus';

export const timeWindowTypes = enumType({
	name: 'TimeWindowTypes',
	members: ['day', 'week'],
});

export const WatchStatusTypes = enumType({
	name: 'WatchStatusTypes',
	members: [
		'NOT_WATCHING',
		'WATCHING',
		'PLAN_TO_WATCH',
		'COMPLETED',
		'ON_HOLD',
		'DROPPED',
	],
});

export const MovieGenreTypes = enumType({
	name: 'MovieGenreTypes',
	members: [
		'Action',
		'Adventure',
		'Animation',
		'Comedy',
		'Crime',
		'Documentary',
		'Drama',
		'Family',
		'Fantasy',
		'History',
		'Horror',
		'Music',
		'Mystery',
		'Romance',
		'Science_Fiction',
		'TV_Movie',
		'Thriller',
		'War',
		'Western',
	],
});

export const ShowGenreTypes = enumType({
	name: 'ShowGenreTypes',
	members: [
		'Action_AMPERSAND_Adventure',
		'Animation',
		'Comedy',
		'Crime',
		'Documentary',
		'Drama',
		'Family',
		'Kids',
		'Mystery',
		'News',
		'Reality',
		'SciDASHFi_AMPERSAND_Fantasy',
		'Soap',
		'Talk',
		'War_AMPERSAND_Politics',
		'Western',
	],
});
