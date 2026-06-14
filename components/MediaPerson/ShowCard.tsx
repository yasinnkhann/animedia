'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CommonMethods } from '../../utils/CommonMethods';
import { useSession } from 'next-auth/react';
import { useUserMedia } from '@/components/UserMediaProvider';

interface Props {
  show: any;
  rank: number;
}

const ShowCard = ({ show, rank }: Props) => {
  const { data: session } = useSession();

  const { userShows } = useUserMedia();
  const usersShow = userShows?.find(userShow => userShow.id === show.id);

  return (
    <tr className='group border-b border-border transition-colors hover:bg-muted/50'>
      <td className='text-center align-middle'>
        <p className='text-lg'>{rank}</p>
      </td>

      <td className='grid grid-cols-[5rem_calc(100%-5rem)] grid-rows-[100%] break-words p-4'>
        <Link
          href={CommonMethods.getDetailsPageRoute('show', show.id, show.name)}
          className='text-inherit no-underline'
        >
          <section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer overflow-hidden rounded-lg'>
            <Image
              className='rounded-lg object-cover transition-transform duration-300 group-hover:scale-105'
              src={CommonMethods.getTheMovieDbImage(show.poster_path)}
              alt={show.name ?? ''}
              fill
              sizes='(max-width: 768px) 15vw, 10vw'
            />
          </section>
        </Link>

        <section className='col-start-2 pl-4'>
          <Link
            href={CommonMethods.getDetailsPageRoute('show', show.id, show.name)}
            className='text-inherit no-underline transition-colors hover:text-primary'
          >
            <h3 className='cursor-pointer'>{show.name}</h3>
          </Link>
          <p className='text-muted-foreground'>
            {show.first_air_date
              ? CommonMethods.formatDate(show.first_air_date)
              : 'First Air Date Not Available'}
          </p>
        </section>
      </td>

      <td className='text-center align-middle'>
        <p className='text-base'>{(show.vote_average ?? 0).toFixed(1)}</p>
      </td>

      {session && (
        <>
          <td className='text-center align-middle'>
            <p>{usersShow?.rating ? usersShow.rating : 'N/A'}</p>
          </td>
          <td className='px-4 text-center align-middle'>
            <p>
              {usersShow?.status ? CommonMethods.renderTableStatus(usersShow.status as any) : 'N/A'}
            </p>
          </td>
        </>
      )}
    </tr>
  );
};

export default ShowCard;
