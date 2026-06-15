'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CommonMethods } from '../../utils/CommonMethods';
import { useSession } from 'next-auth/react';
import { useUserMedia } from '@/components/UserMediaProvider';

interface Props {
  game: any;
  rank: number;
}

const GameCard = ({ game, rank }: Props) => {
  const { data: session } = useSession();

  const { userGames } = useUserMedia();
  const usersGame = userGames?.find(userGame => userGame.id === game.id);

  return (
    <tr className='group border-b border-border transition-colors hover:bg-muted/50'>
      <td className='text-center align-middle'>
        <p className='text-lg'>{rank}</p>
      </td>
      <td className='grid grid-cols-[5rem_calc(100%-5rem)] grid-rows-[100%] break-words p-4'>
        <Link
          href={CommonMethods.getDetailsPageRoute('game', game.id, game.name)}
          className='text-inherit no-underline'
        >
          <section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer overflow-hidden rounded-lg shadow-sm transition-shadow duration-300 group-hover:shadow-md group-hover:shadow-primary/20'>
            <Image
              className='rounded-lg object-cover transition-transform duration-500 ease-out group-hover:scale-110'
              src={CommonMethods.getIgdbImage(game.coverUrl)}
              alt={game.name}
              fill
              sizes='(max-width: 768px) 15vw, 10vw'
            />
            <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              <div className='translate-y-2 rounded-full bg-primary/90 p-1.5 text-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='h-4 w-4'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
          </section>
        </Link>
        <section className='col-start-2 pl-4'>
          <Link
            href={CommonMethods.getDetailsPageRoute('game', game.id, game.name)}
            className='text-inherit no-underline transition-colors hover:text-primary'
          >
            <h3 className='cursor-pointer'>{game.name}</h3>
          </Link>
          <p className='text-muted-foreground'>
            {game.first_release_date
              ? CommonMethods.formatDate(new Date(game.first_release_date * 1000).toISOString())
              : 'Release Date Not Available'}
          </p>
        </section>
      </td>

      <td className='text-center align-middle'>
        <p className='text-base'>{((game.rating ?? 0) / 10).toFixed(1)}</p>
      </td>

      {session && (
        <>
          <td className='text-center align-middle'>
            <p>{usersGame?.rating ?? 'N/A'}</p>
          </td>

          <td className='text-center align-middle'>
            <p>{usersGame?.wishlist ? 'Yes' : 'No'}</p>
          </td>
        </>
      )}
    </tr>
  );
};

export default GameCard;
