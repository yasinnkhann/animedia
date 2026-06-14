'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CommonMethods } from '../../utils/CommonMethods';
import { useSession } from 'next-auth/react';
import { useUserMedia } from '@/components/UserMediaProvider';

interface Props {
  movie: any;
  rank: number;
}

const MovieCard = ({ movie, rank }: Props) => {
  const { data: session } = useSession();

  const { userMovies } = useUserMedia();
  const usersMovie = userMovies?.find(userMovie => userMovie.id === movie.id);

  return (
    <tr className='border-2'>
      <td className='border-x-2 border-gray-200 text-center align-middle'>
        <p className='text-lg'>{rank}</p>
      </td>
      <td className='grid grid-cols-[5rem_calc(100%-5rem)] grid-rows-[100%] break-words p-4'>
        <Link
          href={CommonMethods.getDetailsPageRoute('movie', movie.id, movie.title)}
          className='text-inherit no-underline'
        >
          <section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer'>
            <Image
              className='rounded-lg'
              src={CommonMethods.getTheMovieDbImage(movie.poster_path)}
              alt={movie.title}
              fill
            />
          </section>
        </Link>
        <section className='col-start-2 pl-4'>
          <Link
            href={CommonMethods.getDetailsPageRoute('movie', movie.id, movie.title)}
            className='text-inherit no-underline'
          >
            <h3 className='cursor-pointer'>{movie.title}</h3>
          </Link>
          <p>
            {movie.release_date
              ? CommonMethods.formatDate(movie.release_date)
              : 'Release Date Not Available'}
          </p>
        </section>
      </td>

      <td className='border-x-2 border-gray-200 text-center align-middle'>
        <p className='text-base'>{(movie.vote_average ?? 0).toFixed(1)}</p>
      </td>

      {session && (
        <>
          <td className='border-x-2 border-gray-200 text-center align-middle'>
            <p>{usersMovie?.rating ? usersMovie.rating : 'N/A'}</p>
          </td>

          <td className='border-x-2 border-gray-200 px-4 text-center align-middle'>
            <p>
              {usersMovie?.status
                ? CommonMethods.renderTableStatus(usersMovie.status as any)
                : 'N/A'}
            </p>
          </td>
        </>
      )}
    </tr>
  );
};

export default MovieCard;
