import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from '../Arrows';
import { useHorizontalScroller } from 'hooks/useHorizontalScroller';
import GamePreviewCard from './GamePreviewCard';
import { IGamePreview } from '@ts/interfaces';

interface Props {
  items: IGamePreview[];
}

const GamePreviewHorizontalScroller = ({ items }: Props) => {
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
      scrollContainerClassName='!h-[22rem] !overflow-y-hidden !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl'
    >
      {items.map(item => (
        <GamePreviewCard key={item.id} itemId={item.id} item={item} dragging={dragging} />
      ))}
    </ScrollMenu>
  );
};

export default GamePreviewHorizontalScroller;
