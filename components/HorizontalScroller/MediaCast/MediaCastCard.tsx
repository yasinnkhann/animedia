'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ICast } from '@ts/interfaces';
import { CommonMethods } from '@utils/CommonMethods';

const MediaCastCard = ({ item, dragging }: { item: ICast; dragging: boolean; itemId: string }) => {
  const body = (
    <section className='relative mx-4 h-[15rem] w-[10rem] select-none'>
      <div className='relative h-full w-full overflow-hidden rounded-lg shadow-md transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/20'>
        <Image
          className='rounded-lg object-cover transition-transform duration-500 ease-out group-hover:scale-110'
          src={
            item.type === 'GameCharacter'
              ? CommonMethods.getIgdbImage(item.profile_path)
              : CommonMethods.getTheMovieDbImage(item.profile_path)
          }
          alt={item.name}
          fill
          sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
        />

        <div className='absolute inset-0 flex flex-col items-center justify-end rounded-lg bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          <div className='mb-4 translate-y-4 rounded-full bg-primary/90 px-4 py-1 text-sm font-semibold text-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
            {item.type !== 'GameCharacter' ? 'View Profile' : 'Game Character'}
          </div>
        </div>
      </div>

      <div className='relative flex w-full flex-wrap content-start whitespace-normal pt-2'>
        <h2 className='m-0 w-full break-words text-center text-base'>
          <p className='font-bold transition-colors group-hover:text-primary'>{item.name}</p>
          {item.character && (
            <p className='break-words text-sm text-muted-foreground'>{item.character}</p>
          )}
        </h2>
      </div>
    </section>
  );
  return (
    <>
      {item.type !== 'GameCharacter' ? (
        <Link
          href={CommonMethods.getDetailsPageRoute('person', item.id, item.name)}
          className='group block text-inherit no-underline transition-all duration-300 active:scale-95'
          onClick={e => dragging && e.preventDefault()}
        >
          {body}
        </Link>
      ) : (
        <div className='group block text-inherit no-underline transition-all duration-300'>
          {body}
        </div>
      )}
    </>
  );
};

export default MediaCastCard;
