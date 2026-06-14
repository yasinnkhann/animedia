'use client';

import type React from 'react';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import { useDrag } from './useDrag';

type ScrollVisibilityApi = React.ContextType<typeof VisibilityContext>;

export function useHorizontalScroller() {
  const { dragStart, dragStop, dragMove, dragging } = useDrag();

  const handleDrag =
    ({ scrollContainer }: ScrollVisibilityApi) =>
    (e: React.MouseEvent) =>
      dragMove(e, posDiff => {
        if (scrollContainer.current) {
          scrollContainer.current.scrollLeft += posDiff;
        }
      });

  const handleMouseDown = () => (e: React.MouseEvent) => {
    dragStart(e);
  };

  const handleMouseUp = () => () => {
    dragStop();
  };

  const handleWheel = (apiObj: ScrollVisibilityApi, e: React.WheelEvent): void => {
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

  return {
    dragging,
    handleDrag,
    handleMouseDown,
    handleMouseUp,
    handleWheel,
  };
}
