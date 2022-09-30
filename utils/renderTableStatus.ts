import { NexusGenEnums } from '../graphql/generated/nexus-typegen';

export const renderTableStatus = (
	status: NexusGenEnums['WatchStatusTypes']
) => {
	if (status === 'WATCHING') {
		return 'Watching';
	} else if (status === 'COMPLETED') {
		return 'Completed';
	} else if (status === 'PLAN_TO_WATCH') {
		return 'Plan to Watch';
	} else if (status === 'ON_HOLD') {
		return 'On Hold';
	} else {
		return 'Dropped';
	}
};
