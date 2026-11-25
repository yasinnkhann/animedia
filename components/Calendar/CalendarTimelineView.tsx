'use client';

import { CalendarReleaseItem } from './types';
import { groupReleasesByTimeline } from './calendarUtils';
import ReleaseCard from './ReleaseCard';
import { motion } from 'framer-motion';
import { BsCalendarX } from 'react-icons/bs';

interface Props {
  items: CalendarReleaseItem[];
  scope: 'my' | 'all';
  onExploreClick?: () => void;
}

export default function CalendarTimelineView({ items, scope, onExploreClick }: Props) {
  const groups = groupReleasesByTimeline(items);

  if (items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground'>
          <BsCalendarX size={32} />
        </div>
        <h3 className='text-lg font-bold text-foreground'>No Upcoming Releases</h3>
        <p className='mt-1 max-w-md text-sm text-muted-foreground'>
          {scope === 'my'
            ? "You don't have any upcoming movies, shows, or games in your Plan to Watch or Plan to Play list."
            : 'No upcoming releases match your current filters.'}
        </p>

        {scope === 'my' && onExploreClick && (
          <button
            onClick={onExploreClick}
            className='text-primary-foreground mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold shadow-lg transition-all hover:bg-primary/90'
          >
            Explore Global Releases
          </button>
        )}
      </div>
    );
  }

  return (
    <div className='space-y-10'>
      {groups.map((group, groupIdx) => (
        <motion.section
          key={group.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: groupIdx * 0.05 }}
          className='space-y-4'
        >
          {/* Section Header */}
          <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3'>
            <div>
              <div className='flex items-center gap-2.5'>
                <h2 className='text-xl font-bold tracking-tight text-foreground'>{group.title}</h2>
                <span className='rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary'>
                  {group.items.length}
                </span>
              </div>
              <p className='mt-0.5 text-xs text-muted-foreground'>{group.subtitle}</p>
            </div>

            {group.badge && (
              <span className='hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-foreground/80 sm:inline-flex'>
                {group.badge}
              </span>
            )}
          </div>

          {/* Cards Grid */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {group.items.map(item => (
              <ReleaseCard key={`${item.mediaType}-${item.id}`} item={item} />
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
