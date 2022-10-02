import React from 'react';
import HomeCard from './HomeCard';
import useDrag from './UseDrag';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from './Arrows';
import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen/index';
import { useRouter } from 'next/router';
import { getDetailsPageRoute } from '../../../utils/getDetailsPageRoute';
import { IHorizontalScrollerItemClickInfo } from '@ts/interfaces';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface Props {
	items:
		| NexusGenObjects['MoviesRes']['results']
		| NexusGenObjects['ShowsRes']['results'];
}

const HomeHorizontalScroller = ({ items }: Props) => {
	const router = useRouter();

	const { dragStart, dragStop, dragMove, dragging } = useDrag();

	const handleDrag =
		({ scrollContainer }: scrollVisibilityApiType) =>
		(e: React.MouseEvent) =>
			dragMove(e, posDiff => {
				if (scrollContainer.current) {
					scrollContainer.current.scrollLeft += posDiff;
				}
			});

	const handleItemClick = (itemInfo: IHorizontalScrollerItemClickInfo) => {
		if (dragging) {
			return false;
		}

		router.replace(
			getDetailsPageRoute(itemInfo.mediaType, itemInfo.id, itemInfo.title)
		);
	};

	const onWheel = (
		apiObj: scrollVisibilityApiType,
		e: React.WheelEvent
	): void => {
		const isTouchpad = Math.abs(e.deltaX) !== 0 || Math.abs(e.deltaY) < 15;

		if (isTouchpad) {
			e.stopPropagation();
			return;
		}

		if (e.deltaY < 0) {
			apiObj.scrollNext();
		} else if (e.deltaY > 0) {
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
		>
			{items.map(item => (
				<HomeCard key={item.id} item={item} handleItemClick={handleItemClick} />
			))}
		</ScrollMenu>
	);
};

export default HomeHorizontalScroller;