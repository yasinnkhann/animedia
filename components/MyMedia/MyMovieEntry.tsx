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
    <tr className='hover:bg-muted/30'>
      <td className='text-center align-middle'>
        <p className='text-lg'>{count}</p>
      </td>

      <td className='grid grid-cols-[5rem_calc(100%-5rem)] grid-rows-[100%] break-words p-4'>
        <Link
          href={CommonMethods.getDetailsPageRoute('movie', myMovie.id, myMovie.name)}
          className='text-inherit no-underline'
        >
          <section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer'>
            <Image
              className='rounded-lg'
              src={CommonMethods.getTheMovieDbImage(movieData?.poster_path)}
              priority
              alt={movieData?.title ?? ''}
              fill
              sizes='(max-width: 768px) 15vw, 10vw'
            />
          </section>
        </Link>

        <section className='col-start-2 pl-4'>
          <Link
            href={CommonMethods.getDetailsPageRoute('movie', myMovie.id, myMovie.name)}
            className='text-inherit no-underline'
          >
            <h3 className='cursor-pointer'>{myMovie.name}</h3>
          </Link>
          <p>
            {movieData?.release_date
              ? CommonMethods.formatDate(movieData?.release_date)
              : 'Release Date Not Available'}
          </p>
        </section>
      </td>

      <td className='text-center align-middle'>
        <p className='text-lg'>{myMovie.rating ?? 'N/A'}</p>
      </td>

      <td className='text-center align-middle'>
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
            <BsFillTrashFill size={20} className='cursor-pointer text-red-500' />
          </button>
        </form>
      </td>
    </tr>
  );
};

export default MyMovieEntry;
