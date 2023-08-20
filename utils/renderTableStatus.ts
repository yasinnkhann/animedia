import { WatchStatusTypes } from '../graphql/generated/code-gen/graphql';

export const renderTableStatus = (status: WatchStatusTypes) => {
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
