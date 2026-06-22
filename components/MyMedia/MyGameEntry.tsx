import Image from 'next/image';

import { CommonMethods } from '../../utils/CommonMethods';
import { useState, useEffect } from 'react';
import type { Game } from '@prisma/client';
import Link from 'next/link';
import { deleteGame } from '@/app/actions/media';
import { getGameDetailsAction } from '@/lib/actions/igdbActions';
import { useUserMedia } from '@/components/UserMediaProvider';

import { IoMdClose } from 'react-icons/io';

interface Props {
  myGame: Game;
}

const MyGameEntry = ({ myGame }: Props) => {
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
    <div className='group relative flex flex-col gap-2'>
      <div className='relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-transform duration-300 group-hover:-translate-y-2 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/20'>
        {/* Rating Badge */}
        {myGame.rating && (
          <div className='absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-yellow-400 shadow-sm backdrop-blur-md'>
            ★ {myGame.rating}
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
            className='rounded-full bg-black/60 p-1.5 text-white shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:bg-red-500/80'
            title='Remove from library'
          >
            <IoMdClose size={16} />
          </button>
        </form>

        <Link
          href={CommonMethods.getDetailsPageRoute('game', myGame.id, myGame.name)}
          className='block h-full w-full'
        >
          <Image
            className='object-cover'
            src={CommonMethods.getIgdbImage(gameData?.coverUrl)}
            alt={gameData?.name ?? ''}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw'
            {...((myGame as any).blurDataUrl && {
              placeholder: 'blur',
              blurDataURL: (myGame as any).blurDataUrl,
            })}
          />
        </Link>
      </div>

      <Link
        href={CommonMethods.getDetailsPageRoute('game', myGame.id, myGame.name)}
        className='text-inherit no-underline'
      >
        <h3 className='line-clamp-2 text-sm font-semibold transition-colors hover:text-primary'>
          {myGame.name}
        </h3>
        <p className='mt-1 text-xs text-muted-foreground'>
          {gameData?.release_date
            ? CommonMethods.formatDate(gameData.release_date)
            : gameData?.first_release_date
              ? CommonMethods.formatDate(new Date(gameData.first_release_date * 1000).toISOString())
              : 'Release Date Not Available'}
        </p>
      </Link>
    </div>
  );
};

export default MyGameEntry;
