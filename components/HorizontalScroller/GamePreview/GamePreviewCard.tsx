import Image from 'next/image';
import { IGamePreview } from '@ts/interfaces';

const GamePreviewCard = ({ item }: { item: IGamePreview; dragging: boolean; itemId: string }) => {
  return (
    <section className='relative mx-4 h-[20rem] w-[35rem] select-none'>
      <div className='relative h-full w-full'>
        {item.video_id && (
          <iframe
            src={`https://www.youtube.com/embed/${item.video_id}`}
            allowFullScreen
            className='h-full w-full'
          ></iframe>
        )}
        {item.url && <Image className='rounded-lg' src={item.url} alt='' fill />}
      </div>
    </section>
  );
};

export default GamePreviewCard;
