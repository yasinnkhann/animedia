import MediaCard from '../MediaCard/MediaCard';
import { useState, useEffect } from 'react';
import type { Show } from '@prisma/client';
import { deleteShow, updateShow } from '@/app/actions/media';
import { useUserMedia } from '@/components/UserMediaProvider';
import { CommonMethods } from '@/utils/CommonMethods';

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
      fetch(`/api/media/details?type=SHOW&id=${encodeURIComponent(myShow.id)}`)
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
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
                  s.id === myShow.id
                    ? { ...s, status: 'WATCHING', total_episodes: airedEpisodes }
                    : s
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
        })
        .catch(() => {});
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
          } catch (_err) {
            mutateUserMediaCache(() => previousData);
          }
        }}
      />
      {/* Progress Badge */}
      <div
        className={`pointer-events-none absolute bottom-[3.5rem] right-2 z-10 flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold shadow-sm backdrop-blur-md ${
          myShow.status === 'WATCHING' && (myShow.rewatch_count ?? 0) > 0
            ? 'border border-purple-500/40 bg-purple-950/85 text-purple-200'
            : 'bg-black/70 text-white'
        }`}
      >
        {myShow.status === 'WATCHING' && (myShow.rewatch_count ?? 0) > 0 && (
          <span className='text-[10px]'>🔁</span>
        )}
        <span>
          {myShow.status === 'WATCHING' && (myShow.rewatch_count ?? 0) > 0 ? 'Rewatching ' : ''}
          Ep {myShow.status === 'PLAN_TO_WATCH' ? 0 : myShow.current_episode}
          {showData?.number_of_episodes ? ` / ${showData.number_of_episodes}` : ''}
        </span>
      </div>
    </div>
  );
};

export default MyShowEntry;
