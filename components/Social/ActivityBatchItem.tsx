'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ActivityType, MediaType } from '@prisma/client';
import Avatar from '@/components/ui/Avatar';
import { CommonMethods } from '@/utils/CommonMethods';
import { BiMovie, BiTv, BiJoystick, BiChevronDown } from 'react-icons/bi';

export interface Activity {
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
  likes?: { userId: string }[];
  _count?: { comments: number };
}

export interface BatchedActivity {
  id: string;
  user: Activity['user'];
  activities: Activity[];
}

export const getActionText = (activity: Activity) => {
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

export const getStatusText = (status: string) => {
  return status.replace(/_/g, ' ').toLowerCase();
};

import ActivityInteractions from './ActivityInteractions';

export function SingleActivityRow({
  activity,
  compact = false,
}: {
  activity: Activity;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 transition-all sm:gap-5 ${compact ? '' : 'rounded-2xl border border-border bg-card p-4 hover:shadow-md sm:p-5'}`}
    >
      {!compact && (
        <Link href={`/user/${activity.user.id}`} className='shrink-0'>
          <Avatar
            src={activity.user.image}
            size={50}
            initials={activity.user.name?.[0]?.toUpperCase()}
            backgroundColor='hsl(var(--primary))'
          />
        </Link>
      )}

      <div className='flex flex-1 flex-col gap-1'>
        <div className='flex flex-wrap items-baseline gap-x-1.5'>
          {!compact && (
            <Link
              href={`/user/${activity.user.id}`}
              className='text-[15px] font-bold transition-colors hover:text-primary'
            >
              {activity.user.name?.split(' ')[0]}
            </Link>
          )}
          <span className={`text-sm ${compact ? 'text-foreground' : 'text-muted-foreground'}`}>
            {compact
              ? getActionText(activity).charAt(0).toUpperCase() + getActionText(activity).slice(1)
              : getActionText(activity)}
          </span>
          <span className='text-[10px] font-bold uppercase tracking-wider text-primary'>
            {activity.mediaType === 'MOVIE'
              ? 'Movie'
              : activity.mediaType === 'SHOW'
                ? 'Show'
                : 'Game'}
          </span>
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
            className='text-[15px] font-bold transition-colors hover:text-primary'
          >
            {activity.mediaTitle}
          </Link>
        </div>

        <div className='mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
          <span>
            {new Date(activity.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </span>

          {activity.metadata && (
            <>
              {activity.metadata.rating && (
                <>
                  <span className='text-muted-foreground/50'>•</span>
                  <span className='inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 font-bold text-primary'>
                    ⭐ {activity.metadata.rating}/10
                  </span>
                </>
              )}
              {activity.metadata.status && activity.type !== 'STATUS_CHANGED' && (
                <>
                  <span className='text-muted-foreground/50'>•</span>
                  <span className='inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground'>
                    {getStatusText(activity.metadata.status)}
                  </span>
                </>
              )}
              {activity.metadata.wishlist !== undefined && (
                <>
                  <span className='text-muted-foreground/50'>•</span>
                  <span className='inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground'>
                    {activity.metadata.wishlist ? 'Added to Wishlist' : 'Removed from Wishlist'}
                  </span>
                </>
              )}
            </>
          )}
        </div>

        {!compact && (
          <ActivityInteractions
            activityId={activity.id}
            initialLikes={activity.likes || []}
            initialCommentCount={activity._count?.comments || 0}
          />
        )}
      </div>

      <div className='shrink-0 pl-2 sm:pl-4'>
        {activity.mediaImage ? (
          <div
            className={`relative shrink-0 overflow-hidden rounded-md shadow-sm ${compact ? 'h-12 w-8 sm:h-16 sm:w-12' : 'h-[4.5rem] w-12 sm:h-24 sm:w-16'}`}
          >
            <Image
              src={
                activity.mediaImage.startsWith('//')
                  ? `https:${activity.mediaImage}`
                  : activity.mediaImage
              }
              alt={activity.mediaTitle}
              fill
              className='object-cover'
              sizes='(max-width: 640px) 48px, 64px'
            />
          </div>
        ) : (
          <div
            className={`flex shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground ${compact ? 'h-12 w-8 text-xl sm:h-16 sm:w-12' : 'h-[4.5rem] w-12 text-2xl sm:h-24 sm:w-16 sm:text-3xl'}`}
          >
            {activity.mediaType === 'MOVIE' ? (
              <BiMovie />
            ) : activity.mediaType === 'SHOW' ? (
              <BiTv />
            ) : (
              <BiJoystick />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ActivityBatchItem({ batch }: { batch: BatchedActivity }) {
  const [expanded, setExpanded] = useState(false);
  const primaryActivity = batch.activities[0];

  if (batch.activities.length === 1) {
    return <SingleActivityRow activity={primaryActivity} />;
  }

  return (
    <div className='flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md sm:gap-5 sm:p-5'>
      <div
        className='flex cursor-pointer items-center gap-3 sm:gap-5'
        onClick={() => setExpanded(!expanded)}
      >
        <Link
          href={`/user/${batch.user.id}`}
          className='shrink-0'
          onClick={e => e.stopPropagation()}
        >
          <Avatar
            src={batch.user.image}
            size={50}
            initials={batch.user.name?.[0]?.toUpperCase()}
            backgroundColor='hsl(var(--primary))'
          />
        </Link>
        <div className='flex flex-1 flex-col gap-1'>
          <div className='flex flex-wrap items-baseline gap-x-1.5'>
            <Link
              href={`/user/${batch.user.id}`}
              className='text-[15px] font-bold transition-colors hover:text-primary'
              onClick={e => e.stopPropagation()}
            >
              {batch.user.name?.split(' ')[0]}
            </Link>
            <span className='text-sm text-muted-foreground'>
              interacted with {batch.activities.length} items
            </span>
          </div>
          <div className='mt-1 text-xs text-muted-foreground'>
            {new Date(primaryActivity.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </div>
        </div>
        <div className='shrink-0 pl-2 text-muted-foreground sm:pl-4'>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <BiChevronDown size={24} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className='overflow-hidden'
          >
            <div className='mt-2 flex flex-col gap-4 border-t border-border pl-2 pt-4 sm:pl-16'>
              {batch.activities.map(act => (
                <SingleActivityRow key={act.id} activity={act} compact />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
