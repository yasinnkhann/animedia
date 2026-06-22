import MediaCard from '../MediaCard/MediaCard';
import { useState, useEffect } from 'react';
import type { Game } from '@prisma/client';
import { deleteGame } from '@/app/actions/media';
import { getGameDetailsAction } from '@/lib/actions/igdbActions';
import { useUserMedia } from '@/components/UserMediaProvider';

import { IoMdClose } from 'react-icons/io';

interface Props {
  game: Game;
  index: number;
}

const MyGameEntry = ({ game, index }: Props) => {
  const [gameData, setGameData] = useState<any>({
    coverUrl: game.image ?? null,
    release_date: game.release_date ?? null,
  });
  const { mutateUserMediaCache, getUserMediaCache } = useUserMedia();

  useEffect(() => {
    if (!game.image || !game.release_date) {
      getGameDetailsAction(game.id).then(data => {
        if (data) setGameData(data);
      });
    }
  }, [game.id, game.image, game.release_date]);

  return (
    <MediaCard
      item={{ ...game, ...gameData }}
      mediaType='GAME'
      variant='responsive'
      userRating={game.rating}
      index={index}
      onRemove={async () => {
        const previousData = getUserMediaCache();
        mutateUserMediaCache((old: any) => {
          if (!old) return old;
          return {
            ...old,
            userGames: old.userGames.filter((g: Game) => g.id !== game.id),
          };
        });
        try {
          await deleteGame(game.id);
        } catch (err) {
          mutateUserMediaCache(() => previousData);
        }
      }}
    />
  );
};

export default MyGameEntry;
