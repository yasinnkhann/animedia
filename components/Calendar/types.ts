export type MediaType = 'MOVIE' | 'SHOW' | 'GAME';

export interface CalendarReleaseItem {
  id: string;
  name: string;
  releaseDate: string; // YYYY-MM-DD or ISO
  mediaType: MediaType;
  image?: string | null;
  overview?: string;
  rating?: number | null;
  status?: string | null;
  platforms?: string[];
  isTracked?: boolean;
}

export type CalendarScope = 'my' | 'all';
export type CalendarViewMode = 'timeline' | 'month';
export type CalendarMediaFilter = 'ALL' | 'MOVIE' | 'SHOW' | 'GAME';

export interface ReleaseCountdown {
  days: number;
  label: string;
  category: 'today' | 'tomorrow' | 'this_week' | 'this_month' | 'future' | 'past';
  badgeColor: string;
}
