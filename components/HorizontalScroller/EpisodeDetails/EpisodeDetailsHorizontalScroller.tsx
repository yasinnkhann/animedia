'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import EpisodeDetailsCard from './EpisodeDetailsCard';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import { IEPDetails } from '@ts/interfaces';
import { RESULTS_PER_EPISODES_SLIDER } from '@utils/constants';
import { BaseHorizontalScroller } from '../BaseHorizontalScroller';
import { getSeasonDetailsAction } from '@/lib/actions/tmdbActions';

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

  const fetchedSeasonsRef = useRef<Set<number>>(new Set());
  const [seasonData, setSeasonData] = useState<Record<number, any>>({});

  const allEpisodes = useMemo(() => {
    const groupedArr: IEPDetails[] = [];
    Array.from({ length: seasons.length }, (_, idx) =>
      new Array(seasons[idx]?.episode_count || 0).fill(0)
    ).forEach((season, seasonNum) =>
      season.forEach((_, idx) =>
        groupedArr.unshift({ season: seasons[seasonNum].season_number, episode: idx + 1, showId })
      )
    );
    return groupedArr;
  }, [seasons, showId]);

  const visibleItems = useMemo(() => {
    return allEpisodes.slice(0, episodesToShow);
  }, [allEpisodes, episodesToShow]);

  useEffect(() => {
    const visibleSeasons = new Set(visibleItems.map(item => item.season));
    visibleSeasons.forEach(seasonNum => {
      if (!fetchedSeasonsRef.current.has(seasonNum)) {
        fetchedSeasonsRef.current.add(seasonNum);
        getSeasonDetailsAction(showId, seasonNum).then(data => {
          if (data && data.episodes) {
            const episodesMap = data.episodes.reduce((acc: any, ep: any, index: number) => {
              acc[index + 1] = ep;
              return acc;
            }, {});
            setSeasonData(prev => ({ ...prev, [seasonNum]: episodesMap }));
          } else {
            // Mark as empty object to prevent infinite skeleton if season fetch fails or has no episodes
            setSeasonData(prev => ({ ...prev, [seasonNum]: {} }));
          }
        });
      }
    });
  }, [visibleItems, showId]);

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
      items={visibleItems}
      keyExtractor={item => `${item.season}-${item.episode}`}
      apiRef={scrollContainerRef}
      scrollContainerClassName='!h-[14rem] !overflow-y-hidden !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl'
      renderItem={item => {
        const epData = seasonData[item.season]?.[item.episode];
        const isLoading = seasonData[item.season] === undefined;
        return <EpisodeDetailsCard epDetailsCardData={epData} isLoading={isLoading} />;
      }}
    />
  );
};

export default EpisodeDetailsHorizontalScroller;
