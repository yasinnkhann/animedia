import React from 'react';
import MotionItem from './MotionItem';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from './Arrows';
import { useHorizontalScroller } from '@hooks/useHorizontalScroller';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface BaseHorizontalScrollerProps<T> {
  items: T[];
  renderItem: (item: T, index: number, dragging: boolean) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  scrollContainerClassName?: string;
  apiRef?: React.RefObject<scrollVisibilityApiType | null>;
}

export function BaseHorizontalScroller<T>({
  items,
  renderItem,
  keyExtractor,
  scrollContainerClassName = '!h-[26rem] !overflow-y-hidden !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl',
  apiRef,
}: BaseHorizontalScrollerProps<T>) {
  const { dragging, handleDrag, handleMouseDown, handleMouseUp, handleWheel } =
    useHorizontalScroller();

  return (
    <ScrollMenu
      LeftArrow={LeftArrow}
      RightArrow={RightArrow}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleDrag}
      scrollContainerClassName={scrollContainerClassName}
      apiRef={apiRef as any}
    >
      {items.map((item, idx) => {
        const id = keyExtractor(item, idx);
        return (
          <MotionItem
            key={id}
            itemId={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
          >
            {renderItem(item, idx, dragging)}
          </MotionItem>
        );
      })}
    </ScrollMenu>
  );
}
