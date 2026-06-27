'use client';

import GamePreviewCard from './GamePreviewCard';
import { IGamePreview } from '@ts/interfaces';
import { BaseHorizontalScroller } from '../BaseHorizontalScroller';

interface Props {
  items: IGamePreview[];
}

const GamePreviewHorizontalScroller = ({ items }: Props) => {
  return (
    <BaseHorizontalScroller
      items={items}
      keyExtractor={item => item.id}
      scrollContainerClassName='py-4 !overflow-y-hidden !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl'
      renderItem={(item, _idx, dragging) => (
        <GamePreviewCard itemId={item.id} item={item} dragging={dragging} />
      )}
    />
  );
};

export default GamePreviewHorizontalScroller;
