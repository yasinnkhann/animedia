import Image from 'next/image';
import { BsFillTrashFill } from 'react-icons/bs';

import { CommonMethods } from '../../utils/CommonMethods';
import { useState, useEffect } from 'react';
import type { Game } from '@prisma/client';
import Link from 'next/link';
import { deleteGame } from '@/app/actions/media';
import { getGameDetailsAction } from '@/lib/actions/igdbActions';
import { useUserMedia } from '@/components/UserMediaProvider';

interface Props {
  myGame: Game;
  count: number;
}

const MyGameEntry = ({ myGame, count }: Props) => {
  const [gameData, setGameData] = useState<any>({
    coverUrl: myGame.image ?? null,
    release_date: myGame.release_date ?? null,
  });
  const { mutateUserMediaCache, getUserMediaCache } = useUserMedia();

  useEffect(() => {
    if (!myGame.image || !myGame.release_date) {
      getGameDetailsAction(myGame.id).then(data => {
        if (data) setGameData(data);
      });
    }
  }, [myGame.id, myGame.image, myGame.release_date]);

  return (
    <tr className='hover:bg-muted/30'>
      <td className='text-center align-middle'>
        <p className='text-lg'>{count}</p>
      </td>

      <td className='grid grid-cols-[5rem_calc(100%-5rem)] grid-rows-[100%] break-words p-4'>
        <Link
          href={CommonMethods.getDetailsPageRoute('game', myGame.id, myGame.name)}
          className='text-inherit no-underline'
        >
          <section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer'>
            <Image
              className='rounded-lg'
              src={CommonMethods.getIgdbImage(gameData?.coverUrl)}
              priority
              alt={gameData?.name ?? ''}
              fill
              sizes='(max-width: 768px) 15vw, 10vw'
            />
          </section>
        </Link>
        <section className='col-start-2 pl-4'>
          <Link
            href={CommonMethods.getDetailsPageRoute('game', myGame.id, myGame.name)}
            className='text-inherit no-underline'
          >
            <h3 className='cursor-pointer'>{myGame.name}</h3>
          </Link>
          <p>
            {gameData?.release_date
              ? CommonMethods.formatDate(gameData.release_date)
              : gameData?.first_release_date
                ? CommonMethods.formatDate(
                    new Date(gameData.first_release_date * 1000).toISOString()
                  )
                : 'Release Date Not Available'}
          </p>
        </section>
      </td>

      <td className='text-center align-middle'>
        <p className='text-lg'>{myGame.rating ?? 'N/A'}</p>
      </td>

      <td className='text-center align-middle'>
        <p className='text-lg'>{myGame.wishlist ? 'Yes' : 'No'}</p>
      </td>

      <td className='text-center align-middle'>
        <form
          action={async () => {
            const previousData = getUserMediaCache();
            mutateUserMediaCache((old: any) => {
              if (!old) return old;
              return {
                ...old,
                userGames: old.userGames.filter((g: Game) => g.id !== myGame.id),
              };
            });
            try {
              await deleteGame(myGame.id);
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

export default MyGameEntry;
