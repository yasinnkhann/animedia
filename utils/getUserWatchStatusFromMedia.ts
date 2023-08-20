import {
	UsersMovie,
	UsersShow,
	WatchStatusTypes,
} from 'graphql/generated/code-gen/graphql';

export const getUserWatchStatusFromMedia = (
	userMatchedMedias: UsersMovie[] | UsersShow[],
	item: {
		id: string;
		[key: string]: any;
	}
) => {
	//@ts-ignore
	const dataFound = userMatchedMedias.find(
		(data: UsersMovie | UsersShow) => data.id! === item.id
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
