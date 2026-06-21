'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Activity, BatchedActivity, ActivityBatchItem } from './ActivityBatchItem';

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

  const groupedActivities = useMemo(() => {
    const batches: BatchedActivity[] = [];
    for (const activity of activities) {
      const lastBatch = batches[batches.length - 1];

      // Group if it's the same user and within 24 hours of the most recent activity in that batch
      if (lastBatch && lastBatch.user.id === activity.user.id) {
        const lastActivityTime = new Date(
          lastBatch.activities[lastBatch.activities.length - 1].createdAt
        ).getTime();
        const currentActivityTime = new Date(activity.createdAt).getTime();
        const hoursDiff = Math.abs(lastActivityTime - currentActivityTime) / (1000 * 60 * 60);

        if (hoursDiff <= 24) {
          lastBatch.activities.push(activity);
          continue;
        }
      }

      batches.push({
        id: activity.id,
        user: activity.user,
        activities: [activity],
      });
    }
    return batches;
  }, [activities]);

  if (!isAuthed) return null;

  if (loading) {
    return (
      <div className='flex h-40 w-full items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
      </div>
    );
  }

  if (groupedActivities.length === 0) {
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

  return (
    <div className='space-y-4'>
      {groupedActivities.map(batch => (
        <ActivityBatchItem key={batch.id} batch={batch} />
      ))}
    </div>
  );
}
