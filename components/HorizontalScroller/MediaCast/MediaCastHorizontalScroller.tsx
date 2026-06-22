'use client';

import MediaCard from '../../MediaCard/MediaCard';
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
        <MediaCard item={item} mediaType='PERSON' dragging={dragging} variant='fixed' />
      )}
    />
  );
};

export default MediaCastHorizontalScroller;
