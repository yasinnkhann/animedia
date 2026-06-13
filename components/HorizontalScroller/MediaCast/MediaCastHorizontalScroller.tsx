import MediaCastCard from './MediaCastCard';
import MotionItem from '../MotionItem';
import { useHorizontalScroller } from '@hooks/useHorizontalScroller';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from '../Arrows';
import { ICast } from '@ts/interfaces';

interface Props {
  items: ICast[];
}

const MediaCastHorizontalScroller = ({ items }: Props) => {
  const { dragging, handleDrag, handleMouseDown, handleMouseUp, handleWheel } =
    useHorizontalScroller();

  const heightClass = items[0].type === 'GameCharacter' ? '!h-[20rem]' : '!h-[22rem]';

  return (
    <ScrollMenu
      LeftArrow={LeftArrow}
      RightArrow={RightArrow}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleDrag}
      scrollContainerClassName={`${heightClass} !overflow-y-hidden !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl`}
    >
      {items.map((item, idx) => (
        <MotionItem
          key={item.id}
          itemId={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.05 }}
        >
          <MediaCastCard itemId={item.id} item={item} dragging={dragging} />
        </MotionItem>
      ))}
    </ScrollMenu>
  );
};

export default MediaCastHorizontalScroller;
