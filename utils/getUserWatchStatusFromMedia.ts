import {
	Movie,
	Show,
	WatchStatusTypes,
} from 'graphql/generated/code-gen/graphql';

export const getUserWatchStatusFromMedia = (
	userMatchedMedias: Movie[] | Show[],
	item: {
		id: string;
		[key: string]: any;
	}
) => {
	//@ts-ignore
	const dataFound = userMatchedMedias.find(
		(data: Movie | Show) => data.id! === item.id
	);
	if (dataFound?.status) {
		switch (dataFound.status) {
			case WatchStatusTypes.Watching:
				return 'W';
			case WatchStatusTypes.Completed:
				return 'C';
			case WatchStatusTypes.PlanToWatch:
				return 'PW';
			case WatchStatusTypes.OnHold:
				return 'OH';
			default:
				return 'D';
		}
	}
};
