'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Avatar from '@/components/ui/Avatar';
import StatsDashboard from '@/app/stats/StatsDashboard';
import ActivityFeed from '@/components/Profile/ActivityFeed';
import MediaCard from '@/components/MediaCard/MediaCard';
import { getMovieDetailsAction, getShowDetailsAction } from '@/lib/actions/tmdbActions';
import { getGameDetailsAction } from '@/lib/actions/igdbActions';

const ProfileMediaCardWrapper = ({ item, mediaType, index }: any) => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (!item.image || !item.release_date) {
      if (mediaType === 'MOVIE') {
        getMovieDetailsAction(item.id).then((d: any) => {
          if (d) setData({ poster_path: d.poster_path, release_date: d.release_date });
        });
      } else if (mediaType === 'SHOW') {
        getShowDetailsAction(item.id).then((d: any) => {
          if (d) setData({ poster_path: d.poster_path, first_air_date: d.first_air_date });
        });
      } else if (mediaType === 'GAME') {
        getGameDetailsAction(item.id).then((d: any) => {
          if (d) setData({ coverUrl: d.coverUrl, first_release_date: d.first_release_date });
        });
      }
    }
  }, [item.id, item.image, item.release_date, mediaType]);

  return (
    <MediaCard
      item={{ ...item, ...data }}
      mediaType={mediaType}
      variant='responsive'
      index={index}
    />
  );
};

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/user/${userId}/profile`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setIsFollowing(data.isFollowing);
        } else {
          router.push('/404');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, status, router]);

  const toggleFollow = async () => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    setFollowLoading(true);
    try {
      const res = await fetch(`/api/user/${userId}/follow`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
        // Optimistically update the followers count
        setProfile((prev: any) => ({
          ...prev,
          user: {
            ...prev.user,
            _count: {
              ...prev.user._count,
              followers: prev.user._count.followers + (data.isFollowing ? 1 : -1),
            },
          },
        }));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className='mt-[var(--header-height-mobile)] flex justify-center py-20'>
        Loading profile...
      </div>
    );
  }

  if (!profile || !profile.user) return null;

  const { user, media, activities } = profile;
  const isSelf = session?.user?.id === user.id;

  const allMedia = [
    ...(media?.userMovies || []),
    ...(media?.userShows || []),
    ...(media?.userGames || []),
  ];
  const topRated = allMedia
    .filter(m => typeof m.rating === 'number' && m.rating >= 9)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  return (
    <main className='flex min-h-screen flex-col px-4 pb-10 pt-[calc(var(--header-height-mobile)+2.5rem)] sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24'>
      <div className='mx-auto flex w-full max-w-7xl flex-1 flex-col pt-4'>
        {/* Profile Header */}
        <div className='relative mb-12 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg sm:flex-row'>
          {/* Decorative Gradient Background for Header */}
          <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50' />

          <div className='relative z-10 flex flex-col items-center gap-6 sm:flex-row'>
            <div className='rounded-full border-4 border-background shadow-xl'>
              <Avatar
                src={user.image}
                size={110}
                initials={user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                backgroundColor='hsl(var(--primary))'
              />
            </div>
            <div className='text-center sm:text-left'>
              <h1 className='text-4xl font-extrabold tracking-tight'>
                {user.name || 'Anonymous User'}
              </h1>
              <p className='mt-1 text-sm font-medium text-muted-foreground'>
                Joined {new Date(user.created_at).toLocaleDateString()}
              </p>
              <div className='mt-4 flex justify-center gap-6 sm:justify-start'>
                <div className='flex flex-col items-center sm:items-start'>
                  <span className='text-xl font-bold text-primary'>
                    {user._count?.followers || 0}
                  </span>
                  <span className='text-xs uppercase tracking-wider text-muted-foreground'>
                    Followers
                  </span>
                </div>
                <div className='flex flex-col items-center sm:items-start'>
                  <span className='text-xl font-bold text-primary'>
                    {user._count?.following || 0}
                  </span>
                  <span className='text-xs uppercase tracking-wider text-muted-foreground'>
                    Following
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!isSelf && (
            <button
              onClick={toggleFollow}
              disabled={followLoading}
              className={`relative z-10 min-w-[130px] rounded-full px-6 py-3 font-bold transition-all duration-300 ${
                isFollowing
                  ? 'border border-border bg-card/80 text-foreground shadow-sm backdrop-blur-md hover:bg-muted'
                  : 'bg-primary text-white shadow-lg hover:scale-105 hover:bg-primary/90'
              }`}
            >
              {followLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        {/* Top Rated Showcase */}
        {topRated.length > 0 && (
          <div className='mb-12'>
            <h2 className='mb-6 text-2xl font-bold'>Favorites Showcase</h2>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
              {topRated.map((item: any, idx: number) => {
                let mediaType: 'MOVIE' | 'SHOW' | 'GAME' = 'MOVIE';
                if ('wishlist' in item || 'playtime' in item) mediaType = 'GAME';
                else if ('total_episodes' in item || 'current_episode' in item) mediaType = 'SHOW';

                return (
                  <ProfileMediaCardWrapper
                    key={`${mediaType}-${item.id}`}
                    item={item}
                    mediaType={mediaType}
                    index={idx}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_400px]'>
          {/* Stats Dashboard */}
          <div className='flex flex-col'>
            <h2 className='mb-6 text-2xl font-bold'>{user.name?.split(' ')[0]}&apos;s Stats</h2>
            <div className='flex flex-1 flex-col rounded-2xl border border-border bg-card/50 p-4 shadow-lg backdrop-blur-md sm:p-8'>
              <StatsDashboard
                userMovies={media.userMovies}
                userShows={media.userShows}
                userGames={media.userGames}
                userName={user.name || 'This user'}
              />
            </div>
          </div>

          {/* Activity Feed */}
          <div className='flex flex-col'>
            <h2 className='mb-6 text-2xl font-bold'>Recent Activity</h2>
            <ActivityFeed activities={activities || []} userName={user.name || 'User'} />
          </div>
        </div>
      </div>
    </main>
  );
}
