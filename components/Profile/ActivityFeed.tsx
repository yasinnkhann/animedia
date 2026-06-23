'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CommonMethods } from '@/utils/CommonMethods';
import { FaStar, FaPlus, FaCheck } from 'react-icons/fa';

interface Activity {
  id: string;
  type: 'ADDED' | 'RATED' | 'STATUS_CHANGED';
  mediaType: 'MOVIE' | 'SHOW' | 'GAME';
  mediaId: string;
  mediaTitle: string;
  mediaImage: string | null;
  metadata: any;
  createdAt: string;
  likes?: { userId: string }[];
  _count?: { comments: number };
}

import ActivityInteractions from '../Social/ActivityInteractions';

interface Props {
  activities: Activity[];
  userName: string;
}

const ActivityFeed = ({ activities, userName }: Props) => {
  if (!activities || activities.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center rounded-xl border border-border bg-card/50 p-8 text-center backdrop-blur-sm'>
        <p className='text-muted-foreground'>No recent activity found for {userName}.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {activities.map(activity => {
        const date = new Date(activity.createdAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        const getRoute = () => {
          switch (activity.mediaType) {
            case 'MOVIE':
              return `/movie/${activity.mediaId}-${activity.mediaTitle.replace(/\s+/g, '-').toLowerCase()}`;
            case 'SHOW':
              return `/show/${activity.mediaId}-${activity.mediaTitle.replace(/\s+/g, '-').toLowerCase()}`;
            case 'GAME':
              return `/game/${activity.mediaId}-${activity.mediaTitle.replace(/\s+/g, '-').toLowerCase()}`;
            default:
              return '#';
          }
        };

        const imageSrc =
          activity.mediaType === 'GAME'
            ? activity.mediaImage
            : CommonMethods.getTheMovieDbImage(activity.mediaImage);

        let icon = <FaPlus className='text-primary' />;
        let actionText = 'added';
        let detailText = null;

        if (activity.type === 'RATED') {
          icon = <FaStar className='text-yellow-500' />;
          actionText = 'rated';
          detailText = activity.metadata?.rating ? (
            <span className='ml-2 font-bold text-yellow-500'>{activity.metadata.rating}/10</span>
          ) : null;
        } else if (activity.type === 'STATUS_CHANGED') {
          icon = <FaCheck className='text-green-500' />;
          actionText = 'changed status of';
          detailText = activity.metadata?.status ? (
            <span className='ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-foreground'>
              {activity.metadata.status.replace(/_/g, ' ')}
            </span>
          ) : null;
        }

        return (
          <div
            key={activity.id}
            className='flex items-start gap-4 rounded-xl border border-border bg-card/50 p-4 shadow-sm backdrop-blur-sm transition-colors hover:bg-muted/50'
          >
            <Link
              href={getRoute()}
              className='relative h-20 w-14 shrink-0 overflow-hidden rounded-md shadow-md'
            >
              <Image
                src={imageSrc || '/placeholder.png'}
                alt={activity.mediaTitle}
                fill
                className='object-cover'
              />
            </Link>
            <div className='flex flex-1 flex-col justify-center'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                {icon}
                <span>
                  <span className='font-semibold text-foreground'>{userName}</span>{' '}
                  {actionText}{' '}
                </span>
                <span className='ml-auto text-xs opacity-70'>{date}</span>
              </div>
              <Link
                href={getRoute()}
                className='mt-1 text-lg font-bold transition-colors hover:text-primary'
              >
                {activity.mediaTitle}
              </Link>
              {detailText && <div className='mt-1'>{detailText}</div>}

              <ActivityInteractions
                activityId={activity.id}
                initialLikes={activity.likes || []}
                initialCommentCount={activity._count?.comments || 0}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
