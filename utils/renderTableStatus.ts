import { NexusGenEnums } from '../graphql/generated/nexus-typegen';

export const renderTableStatus = (
	status: NexusGenEnums['WatchStatusTypes']
) => {
	switch (status) {
		case 'WATCHING':
			return 'Watching';
		case 'COMPLETED':
			return 'Completed';
		case 'PLAN_TO_WATCH':
			return 'Plan to Watch';
		case 'ON_HOLD':
			return 'On Hold';
		default:
			return 'Dropped';
	}
};
