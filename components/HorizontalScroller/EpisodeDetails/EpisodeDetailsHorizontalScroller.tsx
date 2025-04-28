import React, { useState, useRef, useEffect } from 'react';
import EpisodeDetailsCard from './EpisodeDetailsCard';
import { useDrag } from '../../../hooks/useDrag';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from '../Arrows';
import { IEPDetails } from '@ts/interfaces';
import { ShowDetailsRes } from '../../../graphql/generated/code-gen/graphql';
import { RESULTS_PER_EPISODES_SLIDER } from 'utils/constants';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface Props {
	seasons: ShowDetailsRes['seasons'];
	showId: string;
}

const EpisodeDetailsHorizontalScroller = ({ seasons, showId }: Props) => {
	const { dragStart, dragStop, dragMove } = useDrag();
	const [episodesToShow, setEpisodesToShow] = useState(RESULTS_PER_EPISODES_SLIDER);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const scrollContainerRef = useRef<scrollVisibilityApiType>(
		null
	) as React.MutableRefObject<scrollVisibilityApiType>;

	const handleDrag =
		({ scrollContainer }: scrollVisibilityApiType) =>
		(e: React.MouseEvent) =>
			dragMove(e, posDiff => {
				if (scrollContainer.current) {
					scrollContainer.current.scrollLeft += posDiff;
				}
			});

	const onWheel = (apiObj: scrollVisibilityApiType, e: React.WheelEvent): void => {
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

	useEffect(() => {
		const scrollContainer = scrollContainerRef.current?.scrollContainer?.current;
		if (!scrollContainer) return;

		let timeoutId: NodeJS.Timeout;

		const isNearEnd = (container: HTMLElement) => {
			const scrollLeft = container.scrollLeft;
			const clientWidth = container.clientWidth;
			const scrollWidth = container.scrollWidth;

			const scrollPercent = (scrollLeft + clientWidth) / scrollWidth;
			return scrollPercent > 0.8; // Trigger at 80% scrolled
		};

		const handleScroll = () => {
			if (!scrollContainerRef.current?.scrollContainer?.current) return;
			const container = scrollContainerRef.current.scrollContainer.current;

			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				if (isNearEnd(container) && !isLoadingMore) {
					setIsLoadingMore(true);
					setEpisodesToShow(prev => prev + RESULTS_PER_EPISODES_SLIDER);
				}
			}, 100);
		};

		scrollContainer.addEventListener('scroll', handleScroll);

		return () => {
			scrollContainer.removeEventListener('scroll', handleScroll);
			clearTimeout(timeoutId);
		};
	}, [isLoadingMore]);

	useEffect(() => {
		setIsLoadingMore(false);
	}, [episodesToShow]);

	return (
		<ScrollMenu
			LeftArrow={LeftArrow}
			RightArrow={RightArrow}
			onWheel={onWheel}
			onMouseDown={() => dragStart}
			onMouseUp={() => dragStop}
			onMouseMove={handleDrag}
			scrollContainerClassName='!h-[14rem] !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl'
			apiRef={scrollContainerRef}
		>
			{groupSeasonsAndEps()
				.slice(0, episodesToShow)
				.map((item, idx) => (
					<EpisodeDetailsCard item={item} key={idx} />
				))}
		</ScrollMenu>
	);
};

export default EpisodeDetailsHorizontalScroller;
