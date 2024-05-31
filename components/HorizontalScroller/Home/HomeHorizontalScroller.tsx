import { useEffect, useState } from 'react';
import HomeCard from './HomeCard';
import { useDrag } from '../../../hooks/useDrag';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from '../Arrows';
import {
	MovieResult,
	ShowResult,
	UserMovie,
	UserShow,
} from '../../../graphql/generated/code-gen/graphql';
import { useQuery } from '@apollo/client';
import * as Queries from '../../../graphql/queries';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface Props {
	items: MovieResult[] | ShowResult[];
}

const HomeHorizontalScroller = ({ items }: Props) => {
	const [userMatchedMedias, setUserMatchedMedias] = useState<
		UserShow[] | UserMovie[]
	>([]);

	const { data: usersShowsData } = useQuery(Queries.GET_USERS_SHOWS, {
		skip: 'title' in items[0],
		fetchPolicy: 'network-only',
	});

	const { data: usersMoviesData } = useQuery(Queries.GET_USERS_MOVIES, {
		skip: 'name' in items[0],
		fetchPolicy: 'network-only',
	});

	const { dragStart, dragStop, dragMove, dragging } = useDrag();

	const handleDrag =
		({ scrollContainer }: scrollVisibilityApiType) =>
		(e: React.MouseEvent) =>
			dragMove(e, posDiff => {
				if (scrollContainer.current) {
					scrollContainer.current.scrollLeft += posDiff;
				}
			});

	const onWheel = (
		apiObj: scrollVisibilityApiType,
		e: React.WheelEvent
	): void => {
		const isTouchPad = Math.abs(e.deltaX) !== 0 || Math.abs(e.deltaY) < 15;

		if (isTouchPad) {
			e.stopPropagation();
			return;
		}

		if (e.deltaX < 0) {
			apiObj.scrollNext();
		} else if (e.deltaX > 0) {
			apiObj.scrollPrev();
		}
	};

	useEffect(() => {
		const matchedMedias: UserShow[] | UserMovie[] = [];

		const usersMediaDict: Map<string, UserShow | UserMovie> = new Map();

		const userDataArr =
			'title' in items[0]
				? usersMoviesData?.usersMovies
				: usersShowsData?.usersShows;

		if (!userDataArr) return;

		for (const userDataObj of userDataArr) {
			if (userDataObj?.id) {
				usersMediaDict.set(userDataObj.id, userDataObj);
			}
		}
		for (const item of items) {
			if (usersMediaDict.has(item.id)) {
				matchedMedias.push(usersMediaDict.get(item.id) as any);
			}
		}

		setUserMatchedMedias(matchedMedias);
	}, [usersShowsData?.usersShows, usersMoviesData?.usersMovies, items]);

	return (
		<ScrollMenu
			LeftArrow={LeftArrow}
			RightArrow={RightArrow}
			onWheel={onWheel}
			onMouseDown={() => dragStart}
			onMouseUp={() => dragStop}
			onMouseMove={handleDrag}
			scrollContainerClassName='!h-[26rem] !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl'
		>
			{items.map(item => (
				<HomeCard
					key={item.id}
					item={item}
					dragging={dragging}
					userMatchedMedias={userMatchedMedias}
				/>
			))}
		</ScrollMenu>
	);
};

export default HomeHorizontalScroller;
