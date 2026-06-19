'use client';

import React from 'react';
import MotionItem from './MotionItem';
import { LeftArrow, RightArrow } from './Arrows';
import { useHorizontalScroller } from '@hooks/useHorizontalScroller';

interface BaseHorizontalScrollerProps<T> {
  items: T[];
  renderItem: (item: T, index: number, dragging: boolean) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  scrollContainerClassName?: string;
  apiRef?: any; // Kept for backward compatibility but unused
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export function BaseHorizontalScroller<T>({
  items,
  renderItem,
  keyExtractor,
  scrollContainerClassName = '!h-[26rem] !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl',
  onScroll,
}: BaseHorizontalScrollerProps<T>) {
  const {
    scrollContainerRef,
    dragging,
    handleDrag,
    handleMouseDown,
    handleMouseUp,
    scrollPrev,
    scrollNext,
    isFirstItemVisible,
    isLastItemVisible,
  } = useHorizontalScroller();

  return (
    <div className='relative flex w-full items-center'>
      <LeftArrow isVisible={!isFirstItemVisible} onClick={scrollPrev} />

      <div
        ref={scrollContainerRef}
        className={`flex w-full snap-x snap-mandatory overflow-x-auto ${scrollContainerClassName}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleDrag}
        onScroll={onScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, idx) => {
          const id = keyExtractor(item, idx);
          return (
            <div key={id} className='flex-shrink-0 snap-start'>
              <MotionItem
                itemId={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                {renderItem(item, idx, dragging)}
              </MotionItem>
            </div>
          );
        })}
      </div>

      <RightArrow isVisible={!isLastItemVisible} onClick={scrollNext} />
    </div>
  );
}
