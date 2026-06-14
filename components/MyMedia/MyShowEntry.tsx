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
  const [showData, setShowData] = useState<any>(null);
  const { refetchUserMedia } = useUserMedia();

  useEffect(() => {
    getShowDetailsAction(myShow.id).then(data => {
      setShowData(data);
    });
  }, [myShow.id]);

  return (
    <tr className='border-2'>
      <td className='border-x-2 border-gray-200 text-center align-middle'>
        <p className='text-lg'>{count}</p>
      </td>

      <td className='grid grid-cols-[5rem_calc(100%-5rem)] grid-rows-[100%] break-words p-4'>
        <Link
          href={CommonMethods.getDetailsPageRoute('show', myShow.id, myShow.name)}
          className='text-inherit no-underline'
        >
          <section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer'>
            <Image
              className='rounded-lg'
              src={CommonMethods.getTheMovieDbImage(showData?.poster_path)}
              priority
              alt={showData?.name ?? ''}
              fill
              sizes='(max-width: 768px) 15vw, 10vw'
            />
          </section>
        </Link>
        <section className='col-start-2 pl-4'>
          <Link
            href={CommonMethods.getDetailsPageRoute('show', myShow.id, myShow.name)}
            className='text-inherit no-underline'
          >
            <h3 className='cursor-pointer'>{myShow.name}</h3>
          </Link>
          <p>
            {showData?.first_air_date
              ? CommonMethods.formatDate(showData?.first_air_date)
              : 'First Air Date Not Available'}
          </p>
        </section>
      </td>

      <td className='border-x-2 border-gray-200 text-center align-middle'>
        <p className='text-lg'>{myShow.rating ?? 'N/A'}</p>
      </td>

      <td className='border-x-2 border-gray-200 text-center align-middle'>
        <p className='text-lg'>
          {myShow.status === 'PLAN_TO_WATCH' ? 0 : myShow.current_episode}/
          {myShow.status === 'COMPLETED' ? myShow.current_episode : showData?.number_of_episodes}
        </p>
      </td>

      <td className='border-x-2 border-gray-200 text-center align-middle'>
        <form
          action={async () => {
            await deleteShow(myShow.id);
            await refetchUserMedia();
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

export default MyShowEntry;
