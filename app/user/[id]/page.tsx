'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Avatar } from 'antd';
import StatsDashboard from '@/app/stats/StatsDashboard';

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

  const { user, media } = profile;
  const isSelf = session?.user?.id === user.id;

  return (
    <main className='min-h-screen px-4 pb-10 pt-[calc(var(--header-height-mobile)+2.5rem)] sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24'>
      <div className='mx-auto max-w-5xl pt-4'>
        {/* Profile Header */}
        <div className='mb-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-border bg-card p-8 shadow-sm sm:flex-row'>
          <div className='flex items-center gap-6'>
            <Avatar src={user.image} size={100} className='bg-primary text-3xl text-white'>
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </Avatar>
            <div className='flex flex-col'>
              <h1 className='text-3xl font-bold'>{user.name || 'Anonymous User'}</h1>
              <p className='text-muted-foreground'>
                Joined {new Date(user.created_at).toLocaleDateString()}
              </p>
              <div className='mt-3 flex gap-4 text-sm font-medium'>
                <div>
                  <span className='text-lg font-bold text-primary'>{user._count.followers}</span>{' '}
                  Followers
                </div>
                <div>
                  <span className='text-lg font-bold text-primary'>{user._count.following}</span>{' '}
                  Following
                </div>
              </div>
            </div>
          </div>

          {!isSelf && (
            <button
              onClick={toggleFollow}
              disabled={followLoading}
              className={`min-w-[120px] rounded-full px-6 py-3 font-semibold transition-all ${
                isFollowing
                  ? 'border-2 border-border bg-transparent text-foreground hover:bg-muted'
                  : 'bg-primary text-white shadow-md hover:bg-primary/90'
              }`}
            >
              {followLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        {/* Stats Dashboard */}
        <h2 className='mb-6 text-2xl font-bold'>{user.name?.split(' ')[0]}&apos;s Stats</h2>
        <div className='rounded-2xl border border-border bg-card p-4 sm:p-8'>
          <StatsDashboard
            userMovies={media.userMovies}
            userShows={media.userShows}
            userGames={media.userGames}
            userName={user.name || 'This user'}
          />
        </div>
      </div>
    </main>
  );
}
