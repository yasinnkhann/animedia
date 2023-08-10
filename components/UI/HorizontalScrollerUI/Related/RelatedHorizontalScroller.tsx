import React, { useState, useEffect } from 'react';
import RelatedCard from './RelatedCard';
import { useDrag } from '../../../../hooks/useDrag';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from '../Arrows';
import { IRelatedMedia } from '@ts/interfaces';
import { useQuery } from '@apollo/client';
import * as Queries from '../../../../graphql/queries';
import _ from 'lodash';
import { Maybe, UserMovie, UserShow } from 'graphql/generated/code-gen/graphql';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface Props {
	items: IRelatedMedia[];
}

const RelatedHorizontalScroller = ({ items }: Props) => {
	const [userMatchedMedia, setUserMatchedMedia] = useState<
		UserShow[] | UserMovie[]
	>([]);

	const { data: usersShowsData, loading: usersShowsLoading } = useQuery(
		Queries.GET_USERS_SHOWS,
		{
			fetchPolicy: 'network-only',
		}
	);

	const { data: usersMoviesData, loading: usersMoviesLoading } = useQuery(
		Queries.GET_USERS_MOVIES,
		{
			fetchPolicy: 'network-only',
		}
	);

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
		const matchedMedia: UserShow[] | UserMovie[] = [];
		const userDataMap = new Map<number, UserShow | UserMovie>();
		// @ts-ignore
		const mediaData: UserShow[] | UserMovie[] =
			'title' in items[0]
				? usersMoviesData?.usersMovies
				: usersShowsData?.usersShows;

		if (_.isEmpty(mediaData)) return;

		for (const userData of mediaData) {
			userDataMap.set(parseInt(userData!.id!), userData);
		}

		for (const item of items) {
			const userData = userDataMap.get(item.id);
			if (userData) {
				matchedMedia.push(userData as any);
			}
		}

		setUserMatchedMedia(matchedMedia);
	}, [usersShowsData?.usersShows, items, usersMoviesData?.usersMovies]);

	return (
		<ScrollMenu
			LeftArrow={LeftArrow}
			RightArrow={RightArrow}
			onWheel={onWheel}
			onMouseDown={() => dragStart}
			onMouseUp={() => dragStop}
			onMouseMove={handleDrag}
			scrollContainerClassName='!h-[23rem] !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl'
		>
			{items.map(item => (
				<RelatedCard
					key={item.id}
					item={item}
					dragging={dragging}
					userMatchedMedia={userMatchedMedia}
				/>
			))}
		</ScrollMenu>
	);
};

export default RelatedHorizontalScroller;
