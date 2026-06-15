'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ActivityType, MediaType } from '@prisma/client';
import { Avatar } from 'antd';
import { CommonMethods } from '@/utils/CommonMethods';

interface Activity {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  type: ActivityType;
  mediaType: MediaType;
  mediaId: string;
  mediaTitle: string;
  mediaImage: string | null;
  metadata: any;
  createdAt: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/feed');
        if (res.status === 401) {
          setIsAuthed(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities);
        }
      } catch (err) {
        console.error('Failed to load feed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (!isAuthed) return null;

  if (loading) {
    return (
      <div className='flex h-40 w-full items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-sm'>
        <h3 className='mb-2 text-xl font-bold'>Your feed is quiet...</h3>
        <p className='mb-6 text-muted-foreground'>
          Follow friends to see what they are watching and playing!
        </p>
        <Link
          href='/users'
          className='rounded-full bg-primary px-6 py-2.5 font-semibold text-white transition-all hover:bg-primary/90'
        >
          Find Friends
        </Link>
      </div>
    );
  }

  const getActionText = (activity: Activity) => {
    switch (activity.type) {
      case 'ADDED':
        return 'tracked a new';
      case 'RATED':
        return 'rated';
      case 'STATUS_CHANGED':
        return `changed the status of`;
      default:
        return 'interacted with';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase();
  };

  return (
    <div className='space-y-4'>
      {activities.map(activity => (
        <div
          key={activity.id}
          className='flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md sm:flex-row sm:items-center sm:p-5'
        >
          <div className='flex items-center gap-4 sm:w-1/3'>
            <Link href={`/user/${activity.user.id}`}>
              <Avatar src={activity.user.image} size={48} className='bg-primary text-lg text-white'>
                {activity.user.name?.[0]?.toUpperCase()}
              </Avatar>
            </Link>
            <div>
              <Link
                href={`/user/${activity.user.id}`}
                className='font-bold transition-colors hover:text-primary'
              >
                {activity.user.name?.split(' ')[0]}
              </Link>
              <div className='text-xs text-muted-foreground'>
                {new Date(activity.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </div>
            </div>
          </div>

          <div className='flex flex-1 items-center gap-4 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0'>
            {activity.mediaImage ? (
              <div className='relative h-[4.5rem] w-12 shrink-0 overflow-hidden rounded-md shadow-sm'>
                <Image
                  src={activity.mediaImage}
                  alt={activity.mediaTitle}
                  fill
                  className='object-cover'
                  sizes='48px'
                />
              </div>
            ) : (
              <div className='flex h-[4.5rem] w-12 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground'>
                No Img
              </div>
            )}

            <div className='flex flex-col gap-1'>
              <p className='text-sm'>
                <span className='text-muted-foreground'>{getActionText(activity)} </span>
                <span className='text-xs font-semibold uppercase tracking-wider text-primary'>
                  {activity.mediaType === 'MOVIE'
                    ? 'Movie'
                    : activity.mediaType === 'SHOW'
                      ? 'Show'
                      : 'Game'}
                </span>
              </p>
              <Link
                href={CommonMethods.getDetailsPageRoute(
                  activity.mediaType === 'GAME'
                    ? 'game'
                    : activity.mediaType === 'SHOW'
                      ? 'show'
                      : 'movie',
                  activity.mediaId,
                  activity.mediaTitle
                )}
                className='line-clamp-1 font-bold transition-colors hover:text-primary'
              >
                {activity.mediaTitle}
              </Link>

              {/* Extra Meta Info */}
              {activity.metadata && (
                <div className='mt-1 flex flex-wrap gap-2'>
                  {activity.metadata.rating && (
                    <span className='inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary'>
                      ⭐ {activity.metadata.rating}/10
                    </span>
                  )}
                  {activity.metadata.status && (
                    <span className='inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-foreground'>
                      Status: {getStatusText(activity.metadata.status)}
                    </span>
                  )}
                  {activity.metadata.wishlist !== undefined && (
                    <span className='inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-foreground'>
                      {activity.metadata.wishlist ? 'Added to Wishlist' : 'Removed from Wishlist'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
