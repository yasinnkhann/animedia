import Image from 'next/image';
import { BsFillTrashFill } from 'react-icons/bs';

import { CommonMethods } from '../../utils/CommonMethods';
import { useState, useEffect } from 'react';
import type { Show } from '@prisma/client';
import Link from 'next/link';
import { deleteShow } from '@/app/actions/media';
import { getShowDetailsAction } from '@/lib/actions/tmdbActions';
import { useUserMedia } from '@/components/UserMediaProvider';

interface Props {
  myShow: Show;
  count: number;
}

const MyShowEntry = ({ myShow, count }: Props) => {
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
    <tr className='flex flex-col rounded-lg border border-border bg-card p-4 shadow-sm hover:bg-muted/30 sm:table-row sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none'>
      <td className='hidden text-center align-middle sm:table-cell'>
        <p className='text-lg'>{count}</p>
      </td>

      <td className='mb-4 flex break-words p-0 sm:mb-0 sm:table-cell sm:grid sm:grid-cols-[5rem_calc(100%-5rem)] sm:grid-rows-[100%] sm:p-4'>
        <Link
          href={CommonMethods.getDetailsPageRoute('show', myShow.id, myShow.name)}
          className='shrink-0 text-inherit no-underline'
        >
          <section className='relative h-[7rem] w-[5rem] cursor-pointer sm:row-start-1'>
            <Image
              className='rounded-lg object-cover'
              src={CommonMethods.getTheMovieDbImage(showData?.poster_path)}
              priority
              alt={showData?.name ?? ''}
              fill
              sizes='(max-width: 768px) 15vw, 10vw'
            />
          </section>
        </Link>
        <section className='flex flex-col justify-center pl-4 sm:col-start-2'>
          <Link
            href={CommonMethods.getDetailsPageRoute('show', myShow.id, myShow.name)}
            className='text-inherit no-underline'
          >
            <h3 className='cursor-pointer text-lg font-semibold sm:text-base sm:font-normal'>
              {myShow.name}
            </h3>
          </Link>
          <p className='mt-1 text-sm text-muted-foreground sm:mt-0'>
            {showData?.first_air_date
              ? CommonMethods.formatDate(showData?.first_air_date)
              : 'First Air Date Not Available'}
          </p>
        </section>
      </td>

      <td className='flex items-center justify-between border-t border-border py-2 text-center align-middle sm:table-cell sm:border-0 sm:py-0'>
        <span className='font-medium text-muted-foreground sm:hidden'>My Rating</span>
        <p className='text-lg'>{myShow.rating ?? 'N/A'}</p>
      </td>

      <td className='flex items-center justify-between border-t border-border py-2 text-center align-middle sm:table-cell sm:border-0 sm:py-0'>
        <span className='font-medium text-muted-foreground sm:hidden'>Current Ep.</span>
        <p className='text-lg'>
          {myShow.status === 'PLAN_TO_WATCH' ? 0 : myShow.current_episode}/
          {myShow.status === 'COMPLETED' ? myShow.current_episode : showData?.number_of_episodes}
        </p>
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

export default MyShowEntry;
