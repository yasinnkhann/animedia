import React from 'react';
import HomeCard from './HomeCard';
import { useDrag } from '../../../../hooks/useDrag';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from '../Arrows';
import {
	MovieResult,
	ShowResult,
} from '../../../../graphql/generated/code-gen/graphql';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface Props {
	items: MovieResult[] | ShowResult[];
}

const HomeHorizontalScroller = ({ items }: Props) => {
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
				<HomeCard key={item.id} item={item} dragging={dragging} />
			))}
		</ScrollMenu>
	);
};

export default HomeHorizontalScroller;
