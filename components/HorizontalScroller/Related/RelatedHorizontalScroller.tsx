import { useState, useEffect } from 'react';
import RelatedCard from './RelatedCard';
import { useDrag } from '../../../hooks/useDrag';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from '../Arrows';
import { IRelatedMedia } from '@ts/interfaces';
import { useQuery } from '@apollo/client';
import * as Queries from '../../../graphql/queries';
import { UserShow, UserMovie } from 'graphql/generated/code-gen/graphql';
import { TContent } from '@ts/types';
import { ExtractStrict } from '@ts/types';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface Props {
	items: IRelatedMedia[];
	mediaType?: ExtractStrict<TContent, 'movies' | 'shows'>;
}

const RelatedHorizontalScroller = ({ items, mediaType }: Props) => {
	const [userMatchedMedias, setUserMatchedMedias] = useState<
		UserShow[] | UserMovie[]
	>([]);

	const { data: usersShowsData } = useQuery(Queries.GET_USERS_SHOWS, {
		skip: mediaType === 'movies',
		fetchPolicy: 'network-only',
	});

	const { data: usersMoviesData } = useQuery(Queries.GET_USERS_MOVIES, {
		skip: mediaType === 'shows',
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

		if (mediaType) {
			const usersMediaDict: Map<string, UserShow | UserMovie> = new Map();
			const userDataArr =
				mediaType === 'movies'
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
		} else {
			for (const item of items) {
				const userDataArr =
					'title' in item
						? usersMoviesData?.usersMovies
						: usersShowsData?.usersShows;

				if (!userDataArr) return;

				for (const userDataObj of userDataArr) {
					if (userDataObj?.id && item.id === userDataObj.id) {
						matchedMedias.push(userDataObj as any);
					}
				}
			}
		}

		setUserMatchedMedias(matchedMedias);
	}, [
		usersShowsData?.usersShows,
		usersMoviesData?.usersMovies,
		items,
		mediaType,
	]);

	return (
		<ScrollMenu
			LeftArrow={LeftArrow}
			RightArrow={RightArrow}
			onWheel={onWheel}
			onMouseDown={() => dragStart}
			onMouseUp={() => dragStop}
			onMouseMove={handleDrag}
			scrollContainerClassName='!h-[22rem] !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl'
		>
			{items.map(item => (
				<RelatedCard
					key={item.id}
					item={item}
					dragging={dragging}
					userMatchedMedias={userMatchedMedias}
				/>
			))}
		</ScrollMenu>
	);
};

export default RelatedHorizontalScroller;
