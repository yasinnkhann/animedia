import Image from 'next/image';

import { CommonMethods } from '../../utils/CommonMethods';
import { useState, useEffect } from 'react';
import type { Show } from '@prisma/client';
import Link from 'next/link';
import { deleteShow } from '@/app/actions/media';
import { getShowDetailsAction } from '@/lib/actions/tmdbActions';
import { useUserMedia } from '@/components/UserMediaProvider';

import { IoMdClose } from 'react-icons/io';

interface Props {
  myShow: Show;
}

const MyShowEntry = ({ myShow }: Props) => {
  const [showData, setShowData] = useState<any>({
    poster_path: myShow.image ?? null,
    first_air_date: myShow.release_date ?? null,
    number_of_episodes: myShow.total_episodes ?? null,
  });
  const { mutateUserMediaCache, getUserMediaCache } = useUserMedia();

  useEffect(() => {
    if (!myShow.image || !myShow.release_date || !myShow.total_episodes) {
      getShowDetailsAction(myShow.id).then(data => {
        if (data) setShowData(data);
      });
    }
  }, [myShow.id, myShow.image, myShow.release_date, myShow.total_episodes]);

  return (
    <div className='group relative flex flex-col gap-2'>
      <div className='relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-transform duration-300 group-hover:-translate-y-2 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/20'>
        {/* Rating Badge */}
        {myShow.rating && (
          <div className='absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-yellow-400 shadow-sm backdrop-blur-md'>
            ★ {myShow.rating}
          </div>
        )}

        {/* Progress Badge */}
        <div className='absolute bottom-2 right-2 z-10 rounded bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md'>
          Ep {myShow.status === 'PLAN_TO_WATCH' ? 0 : myShow.current_episode}
          {showData?.number_of_episodes ? ` / ${showData.number_of_episodes}` : ''}
        </div>

        {/* Remove Button Overlay */}
        <form
          className='absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100'
          action={async () => {
            const previousData = getUserMediaCache();
            mutateUserMediaCache((old: any) => {
              if (!old) return old;
              return {
                ...old,
                userShows: old.userShows.filter((s: Show) => s.id !== myShow.id),
              };
            });
            try {
              await deleteShow(myShow.id);
            } catch (err) {
              mutateUserMediaCache(() => previousData);
            }
          }}
        >
          <button
            type='submit'
            className='rounded-full bg-black/60 p-1.5 text-white shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:bg-red-500/80'
            title='Remove from library'
          >
            <IoMdClose size={16} />
          </button>
        </form>

        <Link
          href={CommonMethods.getDetailsPageRoute('show', myShow.id, myShow.name)}
          className='block h-full w-full'
        >
          <Image
            className='object-cover'
            src={CommonMethods.getTheMovieDbImage(showData?.poster_path)}
            alt={showData?.name ?? ''}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw'
            {...((myShow as any).blurDataUrl && {
              placeholder: 'blur',
              blurDataURL: (myShow as any).blurDataUrl,
            })}
          />
        </Link>
      </div>

      <Link
        href={CommonMethods.getDetailsPageRoute('show', myShow.id, myShow.name)}
        className='text-inherit no-underline'
      >
        <h3 className='line-clamp-2 text-sm font-semibold transition-colors hover:text-primary'>
          {myShow.name}
        </h3>
        <p className='mt-1 text-xs text-muted-foreground'>
          {showData?.first_air_date
            ? CommonMethods.formatDate(showData?.first_air_date)
            : 'First Air Date Not Available'}
        </p>
      </Link>
    </div>
  );
};

export default MyShowEntry;
