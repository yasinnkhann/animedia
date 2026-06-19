'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useDrag } from './useDrag';

export function useHorizontalScroller() {
  const { dragStart, dragStop, dragMove, dragging } = useDrag();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isFirstItemVisible, setIsFirstItemVisible] = useState(true);
  const [isLastItemVisible, setIsLastItemVisible] = useState(false);

  const checkVisibility = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsFirstItemVisible(scrollLeft <= 0);
      setIsLastItemVisible(Math.ceil(scrollLeft + clientWidth) >= scrollWidth);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkVisibility);
      window.addEventListener('resize', checkVisibility);
      // Give it a small timeout to let the children render and layout properly before initial check
      const timeoutId = setTimeout(checkVisibility, 100);

      return () => {
        container.removeEventListener('scroll', checkVisibility);
        window.removeEventListener('resize', checkVisibility);
        clearTimeout(timeoutId);
      };
    }
  }, [checkVisibility]);

  const handleDrag = (e: React.MouseEvent) => {
    dragMove(e, posDiff => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft += posDiff;
      }
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStart(e);
  };

  const handleMouseUp = () => {
    dragStop();
  };

  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return {
    scrollContainerRef,
    dragging,
    handleDrag,
    handleMouseDown,
    handleMouseUp,
    scrollPrev,
    scrollNext,
    isFirstItemVisible,
    isLastItemVisible,
  };
}
