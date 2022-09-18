import { NexusGenEnums } from '../graphql/generated/nexus-typegen';

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
