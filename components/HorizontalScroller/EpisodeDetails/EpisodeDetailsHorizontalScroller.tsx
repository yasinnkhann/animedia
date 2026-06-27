'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import EpisodeDetailsCard from './EpisodeDetailsCard';
import { IEPDetails } from '@ts/interfaces';
import { RESULTS_PER_EPISODES_SLIDER } from '@utils/constants';
import { BaseHorizontalScroller } from '../BaseHorizontalScroller';
import { getSeasonDetailsAction } from '@/lib/actions/tmdbActions';

interface Props {
  seasons: any[];
  showId: string;
}

const EpisodeDetailsHorizontalScroller = ({ seasons, showId }: Props) => {
  const [episodesToShow, setEpisodesToShow] = useState<number>(RESULTS_PER_EPISODES_SLIDER);

  const fetchedSeasonsRef = useRef<Set<number>>(new Set());
  const [seasonData, setSeasonData] = useState<Record<number, any>>({});
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const allEpisodes = useMemo(() => {
    // Filter out Season 0 (TMDB uses it for Specials/Extras/Trailers)
    const mainSeasons = seasons.filter(s => s.season_number !== 0);
    const groupedArr: IEPDetails[] = [];
    Array.from({ length: mainSeasons.length }, (_, idx) =>
      new Array(mainSeasons[idx]?.episode_count || 0).fill(0)
    ).forEach((season, seasonNum) =>
      season.forEach((_, idx) =>
        groupedArr.unshift({
          season: mainSeasons[seasonNum].season_number,
          episode: idx + 1,
          showId,
        })
      )
    );
    return groupedArr;
  }, [seasons, showId]);

  const visibleItems = useMemo(
    () => allEpisodes.slice(0, episodesToShow),
    [allEpisodes, episodesToShow]
  );

  const fetchSeasonsForItems = useCallback(
    (items: IEPDetails[]) => {
      const uniqueSeasons = new Set(items.map(item => item.season));
      uniqueSeasons.forEach(seasonNum => {
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
              setSeasonData(prev => ({ ...prev, [seasonNum]: {} }));
            }
          });
        }
      });
    },
    [showId]
  );

  useEffect(() => {
    fetchSeasonsForItems(allEpisodes.slice(0, episodesToShow));

    const nextBatch = allEpisodes.slice(
      episodesToShow,
      episodesToShow + RESULTS_PER_EPISODES_SLIDER
    );
    if (nextBatch.length > 0) {
      fetchSeasonsForItems(nextBatch);
    }
  }, [allEpisodes, episodesToShow, fetchSeasonsForItems]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      const scrollContainer = e.currentTarget;

      timeoutIdRef.current = setTimeout(() => {
        const { scrollLeft, clientWidth, scrollWidth } = scrollContainer;
        if ((scrollLeft + clientWidth) / scrollWidth > 0.8) {
          setEpisodesToShow(prev =>
            Math.min(prev + RESULTS_PER_EPISODES_SLIDER, allEpisodes.length)
          );
        }
      }, 150);
    },
    [allEpisodes.length]
  );

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return (
    <BaseHorizontalScroller
      items={visibleItems}
      keyExtractor={item => `${item.season}-${item.episode}`}
      onScroll={handleScroll}
      scrollContainerClassName='py-4 !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl'
      renderItem={item => {
        const epData = seasonData[item.season]?.[item.episode];
        const isLoading = seasonData[item.season] === undefined;
        return <EpisodeDetailsCard epDetailsCardData={epData} isLoading={isLoading} />;
      }}
    />
  );
};

export default EpisodeDetailsHorizontalScroller;
