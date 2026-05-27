export const MovieGenreTypes = {
  Action: 'Action',
  Adventure: 'Adventure',
  Animation: 'Animation',
  Comedy: 'Comedy',
  Crime: 'Crime',
  Documentary: 'Documentary',
  Drama: 'Drama',
  Family: 'Family',
  Fantasy: 'Fantasy',
  History: 'History',
  Horror: 'Horror',
  Music: 'Music',
  Mystery: 'Mystery',
  Romance: 'Romance',
  Science_Fiction: 'Science_Fiction',
  TV_Movie: 'TV_Movie',
  Thriller: 'Thriller',
  War: 'War',
  Western: 'Western',
} as const;

export type MovieGenreTypes = typeof MovieGenreTypes[keyof typeof MovieGenreTypes];

export const ShowGenreTypes = {
  ActionAmpersandAdventure: 'Action_AMPERSAND_Adventure',
  Animation: 'Animation',
  Comedy: 'Comedy',
  Crime: 'Crime',
  Documentary: 'Documentary',
  Drama: 'Drama',
  Family: 'Family',
  Kids: 'Kids',
  Mystery: 'Mystery',
  News: 'News',
  Reality: 'Reality',
  SciDASHFiAmpersandFantasy: 'SciDASHFi_AMPERSAND_Fantasy',
  Soap: 'Soap',
  Talk: 'Talk',
  WarAmpersandPolitics: 'War_AMPERSAND_Politics',
  Western: 'Western',
} as const;

export type ShowGenreTypes = typeof ShowGenreTypes[keyof typeof ShowGenreTypes];

export const TimeWindowTypes = {
  Day: 'day',
  Week: 'week',
} as const;

export type TimeWindowTypes = typeof TimeWindowTypes[keyof typeof TimeWindowTypes];

export const WatchStatusTypes = {
  Completed: 'COMPLETED',
  Dropped: 'DROPPED',
  NotWatching: 'NOT_WATCHING',
  OnHold: 'ON_HOLD',
  PlanToWatch: 'PLAN_TO_WATCH',
  Watching: 'WATCHING',
} as const;

export type WatchStatusTypes = typeof WatchStatusTypes[keyof typeof WatchStatusTypes];
