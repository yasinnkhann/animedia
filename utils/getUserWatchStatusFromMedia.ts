import {
	UserShow,
	UserMovie,
	WatchStatusTypes,
} from 'graphql/generated/code-gen/graphql';

export const getUserWatchStatusFromMedia = (
	userMatchedMedias: UserShow[] | UserMovie[],
	item: {
		id: number;
		[key: string]: any;
	}
) => {
	//@ts-ignore
	const dataFound = userMatchedMedias.find(
		(data: UserShow | UserMovie) => parseInt(data.id!) === item.id
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
