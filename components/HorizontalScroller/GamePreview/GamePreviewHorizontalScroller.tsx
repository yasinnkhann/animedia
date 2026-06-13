import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import MotionItem from '../MotionItem';
import { LeftArrow, RightArrow } from '../Arrows';
import { useHorizontalScroller } from '@hooks/useHorizontalScroller';
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
      {items.map((item, idx) => (
        <MotionItem
          key={item.id}
          itemId={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.05 }}
        >
          <GamePreviewCard itemId={item.id} item={item} dragging={dragging} />
        </MotionItem>
      ))}
    </ScrollMenu>
  );
};

export default GamePreviewHorizontalScroller;
