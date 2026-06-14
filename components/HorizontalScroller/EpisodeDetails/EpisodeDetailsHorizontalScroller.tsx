'use client';

import React, { useState, useRef, useEffect } from 'react';
import EpisodeDetailsCard from './EpisodeDetailsCard';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import { IEPDetails } from '@ts/interfaces';
import { RESULTS_PER_EPISODES_SLIDER } from '@utils/constants';
import { BaseHorizontalScroller } from '../BaseHorizontalScroller';
type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface Props {
  seasons: any[];
  showId: string;
}

const EpisodeDetailsHorizontalScroller = ({ seasons, showId }: Props) => {
  const [episodesToShow, setEpisodesToShow] = useState<number>(RESULTS_PER_EPISODES_SLIDER);
  const isLoadingMore = useRef(false);
  const scrollContainerRef = useRef<scrollVisibilityApiType>(
    null
  ) as React.RefObject<scrollVisibilityApiType | null>;

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
        if (isNearEnd(container) && !isLoadingMore.current) {
          isLoadingMore.current = true;
          setEpisodesToShow(prev => prev + RESULTS_PER_EPISODES_SLIDER);
          isLoadingMore.current = false;
        }
      }, 100);
    };

    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <BaseHorizontalScroller
      items={groupSeasonsAndEps().slice(0, episodesToShow)}
      keyExtractor={item => `${item.season}-${item.episode}`}
      apiRef={scrollContainerRef}
      scrollContainerClassName='!h-[14rem] !overflow-y-hidden !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl'
      renderItem={item => (
        <EpisodeDetailsCard item={item} itemId={`${item.season}-${item.episode}`} />
      )}
    />
  );
};

export default EpisodeDetailsHorizontalScroller;
