import React from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import Card from './Card';
import { LeftArrow, RightArrow } from './Arrows';
import useDrag from './UseDrag';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface Props {
	items: any[];
}

const HorizontalScroller = (props: Props) => {
	const { dragStart, dragStop, dragMove, dragging } = useDrag();
	const handleDrag =
		({ scrollContainer }: scrollVisibilityApiType) =>
		(ev: React.MouseEvent) =>
			dragMove(ev, posDiff => {
				if (scrollContainer.current) {
					scrollContainer.current.scrollLeft += posDiff;
				}
			});

	const [selected, setSelected] = React.useState<string>('');

	const handleItemClick = (itemId: string) => () => {
		if (dragging) {
			return false;
		}
		setSelected(selected !== itemId ? itemId : '');
	};

	const onWheel = (
		apiObj: scrollVisibilityApiType,
		ev: React.WheelEvent
	): void => {
		const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

		if (isThouchpad) {
			ev.stopPropagation();
			return;
		}

		if (ev.deltaY < 0) {
			apiObj.scrollNext();
		} else if (ev.deltaY > 0) {
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
			{props.items.map(({ id, title }) => (
				<Card
					key={id}
					id={id}
					title={title}
					onClick={handleItemClick(id)}
					selected={id === selected}
				/>
			))}
		</ScrollMenu>
	);
};

export default HorizontalScroller;
