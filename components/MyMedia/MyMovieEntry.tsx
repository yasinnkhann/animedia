import Image from 'next/image';
import Link from 'next/link';

import { CommonMethods } from '../../utils/CommonMethods';
import { useState, useEffect } from 'react';
import type { Movie } from '@prisma/client';
import { deleteMovie } from '@/app/actions/media';
import { getMovieDetailsAction } from '@/lib/actions/tmdbActions';
import { useUserMedia } from '@/components/UserMediaProvider';

import { IoMdClose } from 'react-icons/io';

interface Props {
  myMovie: Movie;
}

const MyMovieEntry = ({ myMovie }: Props) => {
  const [movieData, setMovieData] = useState<any>({
    poster_path: myMovie.image ?? null,
    release_date: myMovie.release_date ?? null,
  });
  const { mutateUserMediaCache, getUserMediaCache } = useUserMedia();

  useEffect(() => {
    if (!myMovie.image || !myMovie.release_date) {
      getMovieDetailsAction(myMovie.id).then(data => {
        if (data) setMovieData(data);
      });
    }
  }, [myMovie.id, myMovie.image, myMovie.release_date]);

  return (
    <div className='group relative flex flex-col gap-2'>
      <div className='relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-transform duration-300 group-hover:-translate-y-2 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/20'>
        {/* Rating Badge */}
        {myMovie.rating && (
          <div className='absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-yellow-400 shadow-sm backdrop-blur-md'>
            ★ {myMovie.rating}
          </div>
        )}

        {/* Remove Button Overlay */}
        <form
          className='absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100'
          action={async () => {
            const previousData = getUserMediaCache();
            mutateUserMediaCache((old: any) => {
              if (!old) return old;
              return {
                ...old,
                userMovies: old.userMovies.filter((m: Movie) => m.id !== myMovie.id),
              };
            });
            try {
              await deleteMovie(myMovie.id);
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
          href={CommonMethods.getDetailsPageRoute('movie', myMovie.id, myMovie.name)}
          className='block h-full w-full'
        >
          <Image
            className='object-cover'
            src={CommonMethods.getTheMovieDbImage(movieData?.poster_path)}
            alt={movieData?.title ?? ''}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw'
            {...((myMovie as any).blurDataUrl && {
              placeholder: 'blur',
              blurDataURL: (myMovie as any).blurDataUrl,
            })}
          />
        </Link>
      </div>

      <Link
        href={CommonMethods.getDetailsPageRoute('movie', myMovie.id, myMovie.name)}
        className='text-inherit no-underline'
      >
        <h3 className='line-clamp-2 text-sm font-semibold transition-colors hover:text-primary'>
          {myMovie.name}
        </h3>
        <p className='mt-1 text-xs text-muted-foreground'>
          {movieData?.release_date
            ? CommonMethods.formatDate(movieData?.release_date)
            : 'Release Date Not Available'}
        </p>
      </Link>
    </div>
  );
};

export default MyMovieEntry;
