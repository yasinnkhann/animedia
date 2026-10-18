import MediaCard from '../MediaCard/MediaCard';
import { useState, useEffect } from 'react';
import type { Show } from '@prisma/client';
import { deleteShow, updateShow } from '@/app/actions/media';
import { getShowDetailsAction } from '@/lib/actions/tmdbActions';
import { useUserMedia } from '@/components/UserMediaProvider';
import { CommonMethods } from '@/utils/CommonMethods';

import { IoMdClose } from 'react-icons/io';

interface Props {
  myShow: Show;
  index: number;
}

const MyShowEntry = ({ myShow, index }: Props) => {
  const [showData, setShowData] = useState<any>({
    poster_path: myShow.image ?? null,
    first_air_date: myShow.release_date ?? null,
    number_of_episodes: myShow.total_episodes ?? null,
  });
  const { mutateUserMediaCache, getUserMediaCache } = useUserMedia();

  useEffect(() => {
    if (
      !myShow.image ||
      !myShow.release_date ||
      !myShow.total_episodes ||
      myShow.status === 'COMPLETED'
    ) {
      getShowDetailsAction(myShow.id).then(data => {
        if (!data) return;

        const airedEpisodes = CommonMethods.getAiredEpisodeCount(data) ?? data.number_of_episodes;
        setShowData({
          ...data,
          number_of_episodes: airedEpisodes,
        });

        if (
          myShow.status === 'COMPLETED' &&
          typeof airedEpisodes === 'number' &&
          airedEpisodes > (myShow.current_episode ?? 0)
        ) {
          mutateUserMediaCache((old: any) => {
            if (!old) return old;
            return {
              ...old,
              userShows: old.userShows.map((s: Show) =>
                s.id === myShow.id ? { ...s, status: 'WATCHING', total_episodes: airedEpisodes } : s
              ),
            };
          });

          updateShow(
            myShow.id,
            'WATCHING',
            myShow.rating ?? undefined,
            myShow.current_episode ?? 0
          ).catch(err => console.error('Failed to auto-update show status:', err));
        }
      });
    }
  }, [
    myShow.id,
    myShow.image,
    myShow.release_date,
    myShow.total_episodes,
    myShow.status,
    myShow.current_episode,
    myShow.rating,
    mutateUserMediaCache,
  ]);

  return (
    <div className='relative'>
      <MediaCard
        item={{ ...myShow, ...showData }}
        mediaType='SHOW'
        userRating={myShow.rating}
        index={index}
        onRemove={async () => {
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
      />
      {/* Progress Badge */}
      <div className='pointer-events-none absolute bottom-[3.5rem] right-2 z-10 rounded bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md'>
        Ep {myShow.status === 'PLAN_TO_WATCH' ? 0 : myShow.current_episode}
        {showData?.number_of_episodes ? ` / ${showData.number_of_episodes}` : ''}
      </div>
    </div>
  );
};

export default MyShowEntry;
