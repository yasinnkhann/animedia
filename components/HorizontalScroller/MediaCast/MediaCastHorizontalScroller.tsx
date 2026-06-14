'use client';

import MediaCastCard from './MediaCastCard';
import { ICast } from '@ts/interfaces';
import { BaseHorizontalScroller } from '../BaseHorizontalScroller';

interface Props {
  items: ICast[];
}

const MediaCastHorizontalScroller = ({ items }: Props) => {
  const heightClass = items[0].type === 'GameCharacter' ? '!h-[20rem]' : '!h-[22rem]';

  return (
    <BaseHorizontalScroller
      items={items}
      keyExtractor={item => item.id}
      scrollContainerClassName={`${heightClass} !overflow-y-hidden !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl`}
      renderItem={(item, _idx, dragging) => (
        <MediaCastCard itemId={item.id} item={item} dragging={dragging} />
      )}
    />
  );
};

export default MediaCastHorizontalScroller;
