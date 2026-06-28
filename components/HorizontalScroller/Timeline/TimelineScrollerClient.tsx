'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BaseHorizontalScroller } from '@/components/HorizontalScroller/BaseHorizontalScroller';
import { CommonMethods } from '@/utils/CommonMethods';
import { BiCheckCircle } from 'react-icons/bi';

interface Props {
  parts: any[];
  completedMovieIds: string[];
  currentMovieId: number | string;
  mediaType: 'movie' | 'game';
}

export default function TimelineScrollerClient({
  parts,
  completedMovieIds,
  currentMovieId,
  mediaType,
}: Props) {
  return (
    <BaseHorizontalScroller
      items={parts}
      keyExtractor={part => part.id.toString()}
      scrollContainerClassName='py-4 !overflow-y-hidden !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl'
      renderItem={(part: any, index: number, dragging: boolean) => {
        const isCompleted = completedMovieIds.includes(part.id.toString());
        const isCurrent = part.id === currentMovieId;
        const posterUrl =
          mediaType === 'game'
            ? CommonMethods.getIgdbImage(part.coverUrl)
            : CommonMethods.getTheMovieDbImage(part.poster_path);

        return (
          <Link
            key={part.id}
            href={`/${mediaType}/${part.id}`}
            onClick={e => {
              if (dragging) e.preventDefault();
            }}
            className='group relative mx-3 flex w-[9rem] shrink-0 select-none flex-col gap-2 text-inherit no-underline transition-transform active:scale-95 sm:mx-4 sm:w-[10rem]'
          >
            <div className='relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted shadow-md transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/20'>
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={part.title}
                  fill
                  sizes='(max-width: 640px) 128px, 160px'
                  className='object-cover transition-all duration-300 group-hover:scale-105'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center p-4 text-center text-xs text-muted-foreground'>
                  {part.title}
                </div>
              )}

              {/* Overlays */}
              {isCurrent && (
                <div className='absolute inset-0 z-10 rounded-xl border-4 border-primary ring-2 ring-background' />
              )}
              {isCompleted && (
                <div className='absolute right-2 top-2 rounded-full bg-green-500 text-white shadow-md'>
                  <BiCheckCircle size={24} />
                </div>
              )}
            </div>

            <div className='relative flex w-full flex-wrap content-start whitespace-normal pt-2'>
              <h2 className='m-0 w-full break-words text-base font-bold transition-colors group-hover:text-primary'>
                {part.title || part.name}
              </h2>
              <p className='m-0 w-full break-words p-0 text-sm text-muted-foreground'>
                {part.release_date
                  ? part.release_date.substring(0, 4)
                  : part.first_release_date
                    ? new Date(part.first_release_date * 1000).getFullYear()
                    : 'TBD'}
              </p>
            </div>
          </Link>
        );
      }}
    />
  );
}
