import { CalendarReleaseItem, ReleaseCountdown } from './types';

export function parseLocalDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  // Handle ISO string or YYYY-MM-DD
  const clean = dateStr.split('T')[0];
  const [year, month, day] = clean.split('-').map(Number);
  if (!year || !month || !day) {
    const fallback = new Date(dateStr);
    return isNaN(fallback.getTime()) ? null : fallback;
  }
  return new Date(Date.UTC(year, month - 1, day));
}

export function getReleaseCountdown(releaseDateStr?: string | null): ReleaseCountdown {
  if (!releaseDateStr) {
    return {
      days: 9999,
      label: 'TBA',
      category: 'future',
      badgeColor: 'bg-muted text-muted-foreground',
    };
  }

  const releaseDate = parseLocalDate(releaseDateStr);
  if (!releaseDate) {
    return {
      days: 9999,
      label: 'TBA',
      category: 'future',
      badgeColor: 'bg-muted text-muted-foreground',
    };
  }

  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const diffTime = releaseDate.getTime() - todayUtc.getTime();
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0) {
    const absDays = Math.abs(days);
    return {
      days,
      label: absDays === 1 ? 'Released yesterday' : `Released ${absDays}d ago`,
      category: 'past',
      badgeColor: 'bg-zinc-800 text-zinc-400',
    };
  }

  if (days === 0) {
    return {
      days: 0,
      label: '🔥 Releasing Today!',
      category: 'today',
      badgeColor: 'bg-red-500 text-white animate-pulse font-bold',
    };
  }

  if (days === 1) {
    return {
      days: 1,
      label: 'Tomorrow',
      category: 'tomorrow',
      badgeColor: 'bg-amber-500 text-black font-semibold',
    };
  }

  if (days <= 7) {
    return {
      days,
      label: `In ${days} days`,
      category: 'this_week',
      badgeColor: 'bg-emerald-500 text-black font-semibold',
    };
  }

  if (days <= 30) {
    const weeks = Math.round(days / 7);
    return {
      days,
      label: weeks <= 1 ? 'In 1 week' : `In ${weeks} weeks`,
      category: 'this_month',
      badgeColor: 'bg-sky-500 text-white font-medium',
    };
  }

  const months = Math.round(days / 30);
  return {
    days,
    label: months <= 1 ? 'In 1 month' : `In ${months} months`,
    category: 'future',
    badgeColor: 'bg-purple-600/80 text-white font-medium',
  };
}

export interface TimelineGroup {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  items: CalendarReleaseItem[];
}

export function groupReleasesByTimeline(items: CalendarReleaseItem[]): TimelineGroup[] {
  const todayItems: CalendarReleaseItem[] = [];
  const thisWeekItems: CalendarReleaseItem[] = [];
  const thisMonthItems: CalendarReleaseItem[] = [];
  const futureItems: CalendarReleaseItem[] = [];
  const pastItems: CalendarReleaseItem[] = [];

  // Sort chronologically ascending
  const sorted = [...items].sort((a, b) => {
    const dateA = parseLocalDate(a.releaseDate)?.getTime() ?? Infinity;
    const dateB = parseLocalDate(b.releaseDate)?.getTime() ?? Infinity;
    return dateA - dateB;
  });

  sorted.forEach(item => {
    const countdown = getReleaseCountdown(item.releaseDate);
    if (countdown.category === 'today') {
      todayItems.push(item);
    } else if (countdown.category === 'tomorrow' || countdown.category === 'this_week') {
      thisWeekItems.push(item);
    } else if (countdown.category === 'this_month') {
      thisMonthItems.push(item);
    } else if (countdown.category === 'future') {
      futureItems.push(item);
    } else {
      pastItems.push(item);
    }
  });

  const groups: TimelineGroup[] = [];

  if (todayItems.length > 0) {
    groups.push({
      id: 'today',
      title: 'Releasing Today',
      subtitle: 'Available right now to watch or play',
      badge: '🔥 Today',
      items: todayItems,
    });
  }

  if (thisWeekItems.length > 0) {
    groups.push({
      id: 'this_week',
      title: 'This Week',
      subtitle: 'Coming out in the next 7 days',
      badge: '⚡ Upcoming',
      items: thisWeekItems,
    });
  }

  if (thisMonthItems.length > 0) {
    groups.push({
      id: 'this_month',
      title: 'Later This Month',
      subtitle: 'Arriving in the next 30 days',
      badge: '📅 This Month',
      items: thisMonthItems,
    });
  }

  if (futureItems.length > 0) {
    groups.push({
      id: 'future',
      title: 'Upcoming & Anticipated',
      subtitle: 'Further on the horizon',
      badge: '🚀 Later',
      items: futureItems,
    });
  }

  if (pastItems.length > 0) {
    groups.push({
      id: 'past',
      title: 'Recently Released',
      subtitle: 'Already out — ready to binge or play',
      badge: '✅ Available',
      // Sort past items newest first
      items: pastItems.reverse(),
    });
  }

  return groups;
}

export function formatFriendlyDate(dateStr?: string | null): string {
  if (!dateStr) return 'TBA';
  const d = parseLocalDate(dateStr);
  if (!d) return dateStr;

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}
