import React from 'react';
import EpisodeDetailsCard from './EpisodeDetailsCard';
import useDrag from './UseDrag';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from './Arrows';
import { IEPDetails } from '@ts/interfaces';
import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen/index';
type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface Props {
	seasons: NexusGenObjects['ShowDetailsRes']['seasons'];
	showId: number;
}

const EpisodeDetailsHorizontalScroller = ({ seasons, showId }: Props) => {
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

	const groupSeasonsAndEps = () => {
		const groupedArr: IEPDetails[] = [];

		Array.from({ length: seasons.length }, (_, idx) =>
			new Array(seasons[idx]?.episode_count).fill(0)
		).map((season, seasonNum) =>
			season.map((_, idx) =>
				groupedArr.unshift({ season: seasonNum + 1, episode: idx + 1, showId })
			)
		);

		return groupedArr;
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
			{groupSeasonsAndEps().map((item: any, idx) => (
				<EpisodeDetailsCard item={item} key={idx} />
			))}
		</ScrollMenu>
	);
};

export default EpisodeDetailsHorizontalScroller;
