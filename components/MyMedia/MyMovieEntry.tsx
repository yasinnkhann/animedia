import Image from 'next/image';
import Link from 'next/link';
import { BsFillTrashFill } from 'react-icons/bs';

import { CommonMethods } from '../../utils/CommonMethods';
import { useState, useEffect } from 'react';
import type { Movie } from '@prisma/client';
import { deleteMovie } from '@/app/actions/media';
import { getMovieDetailsAction } from '@/lib/actions/tmdbActions';
import { useUserMedia } from '@/components/UserMediaProvider';

interface Props {
  myMovie: Movie;
  count: number;
}

const MyMovieEntry = ({ myMovie, count }: Props) => {
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
    <tr className='flex flex-col rounded-lg border border-border bg-card p-4 shadow-sm hover:bg-muted/30 sm:table-row sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none'>
      <td className='hidden text-center align-middle sm:table-cell'>
        <p className='text-lg'>{count}</p>
      </td>

      <td className='mb-4 flex break-words p-0 sm:mb-0 sm:table-cell sm:grid sm:grid-cols-[5rem_calc(100%-5rem)] sm:grid-rows-[100%] sm:p-4'>
        <Link
          href={CommonMethods.getDetailsPageRoute('movie', myMovie.id, myMovie.name)}
          className='shrink-0 text-inherit no-underline'
        >
          <section className='relative h-[7rem] w-[5rem] cursor-pointer sm:row-start-1'>
            <Image
              className='rounded-lg object-cover'
              src={CommonMethods.getTheMovieDbImage(movieData?.poster_path)}
              priority
              alt={movieData?.title ?? ''}
              fill
              sizes='(max-width: 768px) 15vw, 10vw'
            />
          </section>
        </Link>

        <section className='flex flex-col justify-center pl-4 sm:col-start-2'>
          <Link
            href={CommonMethods.getDetailsPageRoute('movie', myMovie.id, myMovie.name)}
            className='text-inherit no-underline'
          >
            <h3 className='cursor-pointer text-lg font-semibold sm:text-base sm:font-normal'>
              {myMovie.name}
            </h3>
          </Link>
          <p className='mt-1 text-sm text-muted-foreground sm:mt-0'>
            {movieData?.release_date
              ? CommonMethods.formatDate(movieData?.release_date)
              : 'Release Date Not Available'}
          </p>
        </section>
      </td>

      <td className='flex items-center justify-between border-t border-border py-2 text-center align-middle sm:table-cell sm:border-0 sm:py-0'>
        <span className='font-medium text-muted-foreground sm:hidden'>My Rating</span>
        <p className='text-lg'>{myMovie.rating ?? 'N/A'}</p>
      </td>

      <td className='flex items-center justify-between border-t border-border py-2 text-center align-middle sm:table-cell sm:border-0 sm:py-0'>
        <span className='font-medium text-muted-foreground sm:hidden'>Remove</span>
        <form
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
            className='m-0 flex w-full items-center justify-center border-0 bg-transparent p-0 focus:outline-none'
          >
            <BsFillTrashFill
              size={20}
              className='cursor-pointer text-red-500 transition-colors hover:text-red-600'
            />
          </button>
        </form>
      </td>
    </tr>
  );
};

export default MyMovieEntry;
