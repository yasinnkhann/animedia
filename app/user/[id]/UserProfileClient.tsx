'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/ui/Avatar';
import {
  BiMoviePlay,
  BiTv,
  BiJoystick,
  BiCollection,
  BiRightArrowAlt,
  BiShareAlt,
} from 'react-icons/bi';
import Link from 'next/link';
import StatsDashboard from '@/app/stats/StatsDashboard';
import ActivityFeed from '@/components/Profile/ActivityFeed';
import MediaCard from '@/components/MediaCard/MediaCard';
import ShareModal from '@/components/Media/ShareModal';

const ProfileMediaCardWrapper = ({ item, mediaType, index }: any) => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (!item.image || !item.release_date) {
      fetch(
        `/api/media/details?type=${encodeURIComponent(mediaType)}&id=${encodeURIComponent(item.id)}`
      )
        .then(res => (res.ok ? res.json() : null))
        .then((d: any) => {
          if (!d) return;
          if (mediaType === 'MOVIE') {
            setData({ poster_path: d.poster_path, release_date: d.release_date });
          } else if (mediaType === 'SHOW') {
            setData({ poster_path: d.poster_path, first_air_date: d.first_air_date });
          } else if (mediaType === 'GAME') {
            setData({ coverUrl: d.coverUrl, first_release_date: d.first_release_date });
          }
        })
        .catch(() => {});
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

export default function UserProfileClient({ userId }: { userId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  const user = profile?.user;
  const media = profile?.media;
  const activities = profile?.activities;

  const ogImageUrl = useMemo(() => {
    if (!user) return '/api/og';
    const params = new URLSearchParams({
      type: 'PROFILE',
      title: user.name || 'User',
      movies: String(media?.userMovies?.length || 0),
      shows: String(media?.userShows?.length || 0),
      games: String(media?.userGames?.length || 0),
    });
    if (user.image) params.set('avatar', user.image);
    return `/api/og?${params.toString()}`;
  }, [user, media]);

  if (loading || status === 'loading') {
    return (
      <div className='mt-[var(--header-height-mobile)] flex justify-center py-20'>
        Loading profile...
      </div>
    );
  }

  if (!profile || !profile.user) return null;

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

          <div className='relative z-10 flex flex-wrap items-center gap-3'>
            {/* Share Profile Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className='flex items-center gap-2 rounded-full border border-border bg-card/80 px-5 py-3 font-bold text-foreground shadow-sm backdrop-blur-md transition-all hover:bg-muted active:scale-95'
              title='Share Profile Card'
            >
              <BiShareAlt size={18} />
              <span>Share Profile</span>
            </button>

            {!isSelf && (
              <>
                <Link
                  href={`/watch-together?friendId=${user.id}`}
                  className='flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-5 py-3 font-bold text-primary shadow-sm backdrop-blur-md transition-all hover:bg-primary hover:text-white active:scale-95'
                  title={`Watch Together with ${user.name || 'user'}`}
                >
                  <span>🍿 Watch Together</span>
                </Link>

                <button
                  onClick={toggleFollow}
                  disabled={followLoading}
                  className={`min-w-[130px] rounded-full px-6 py-3 font-bold transition-all duration-300 ${
                    isFollowing
                      ? 'border border-border bg-card/80 text-foreground shadow-sm backdrop-blur-md hover:bg-muted'
                      : 'bg-primary text-white shadow-lg hover:scale-105 hover:bg-primary/90'
                  }`}
                >
                  {followLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* My Library Quick Links (Only visible to the owner) */}
        {isSelf && (
          <div className='mb-12'>
            <h2 className='mb-6 text-2xl font-bold'>My Library</h2>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
              <Link
                href='/my-shows/watching'
                className='group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md'
              >
                <div className='mb-4 flex items-center justify-between text-primary'>
                  <div className='rounded-full bg-primary/10 p-3'>
                    <BiTv size={28} />
                  </div>
                  <BiRightArrowAlt
                    size={24}
                    className='opacity-0 transition-opacity group-hover:opacity-100'
                  />
                </div>
                <h3 className='text-lg font-bold'>My Shows</h3>
              </Link>

              <Link
                href='/my-movies/watching'
                className='group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md'
              >
                <div className='mb-4 flex items-center justify-between text-primary'>
                  <div className='rounded-full bg-primary/10 p-3'>
                    <BiMoviePlay size={28} />
                  </div>
                  <BiRightArrowAlt
                    size={24}
                    className='opacity-0 transition-opacity group-hover:opacity-100'
                  />
                </div>
                <h3 className='text-lg font-bold'>My Movies</h3>
              </Link>

              <Link
                href='/my-games/playing'
                className='group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md'
              >
                <div className='mb-4 flex items-center justify-between text-primary'>
                  <div className='rounded-full bg-primary/10 p-3'>
                    <BiJoystick size={28} />
                  </div>
                  <BiRightArrowAlt
                    size={24}
                    className='opacity-0 transition-opacity group-hover:opacity-100'
                  />
                </div>
                <h3 className='text-lg font-bold'>My Games</h3>
              </Link>

              <Link
                href='/collections'
                className='group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md'
              >
                <div className='mb-4 flex items-center justify-between text-primary'>
                  <div className='rounded-full bg-primary/10 p-3'>
                    <BiCollection size={28} />
                  </div>
                  <BiRightArrowAlt
                    size={24}
                    className='opacity-0 transition-opacity group-hover:opacity-100'
                  />
                </div>
                <h3 className='text-lg font-bold'>Collections</h3>
              </Link>
            </div>
          </div>
        )}

        {/* Top Rated Showcase */}
        {topRated.length > 0 && (
          <div className='mb-12'>
            <h2 className='mb-6 text-2xl font-bold'>Favorites Showcase</h2>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
              {topRated.map((item: any, idx: number) => {
                const mediaType: 'MOVIE' | 'SHOW' | 'GAME' = item.mediaType || 'MOVIE';

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
                userMovies={media?.userMovies || []}
                userShows={media?.userShows || []}
                userGames={media?.userGames || []}
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

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={user.name || 'AniMedia User'}
        type='PROFILE'
        ogImageUrl={ogImageUrl}
      />
    </main>
  );
}
