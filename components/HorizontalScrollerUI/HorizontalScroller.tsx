import React, { useState } from 'react';
import Card from './Card';
import useDrag from './UseDrag';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from './Arrows';
import { NexusGenObjects } from '../../graphql/generated/nexus-typegen/index';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface Props {
	items: NexusGenObjects['MoviesRes']['results'];
}

const HorizontalScroller = ({ items }: Props) => {
	const { dragStart, dragStop, dragMove, dragging } = useDrag();

	const [selected, setSelected] = useState<string>('');

	const handleDrag =
		({ scrollContainer }: scrollVisibilityApiType) =>
		(e: React.MouseEvent) =>
			dragMove(e, posDiff => {
				if (scrollContainer.current) {
					scrollContainer.current.scrollLeft += posDiff;
				}
			});

	const handleItemClick = (itemId: string) => () => {
		if (dragging) {
			return false;
		}
		setSelected(selected !== itemId ? itemId : '');
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
				<Card
					key={item.id}
					item={item}
					handleItemClick={handleItemClick(String(item.id))}
					selected={String(item.id) === selected}
				/>
			))}
		</ScrollMenu>
	);
};

export default HorizontalScroller;
