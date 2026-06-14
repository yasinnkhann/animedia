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
          <section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer overflow-hidden rounded-lg'>
            <Image
              className='rounded-lg object-cover transition-transform duration-300 group-hover:scale-105'
              src={CommonMethods.getIgdbImage(game.coverUrl)}
              alt={game.name}
              fill
              sizes='(max-width: 768px) 15vw, 10vw'
            />
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
