import MediaCard from '../MediaCard/MediaCard';
import { useState, useEffect } from 'react';
import type { Game } from '@prisma/client';
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
    <MediaCard
      item={{ ...myGame, ...gameData }}
      mediaType='GAME'
      userRating={myGame.rating}
      onRemove={async () => {
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
    />
  );
};

export default MyGameEntry;
