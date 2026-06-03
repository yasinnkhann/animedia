export type NullablePartial<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] | null | undefined : T[P];
};

export type ExtractStrict<T, U extends T> = U;

export type TStatusParam = 'watching' | 'completed' | 'on-hold' | 'dropped' | 'plan-to-watch';

const _searchResultsConst = ['movies', 'shows', 'people', 'games'] as const;

export type TSearchResults = (typeof _searchResultsConst)[number];

export type TDropDownSearchResult = NullablePartial<
  {
    id: string;
    titleName: string;
    releaseDate?: string;
    firstAirDate?: string;
    knownForDepartment?: string;
    type: 'movie' | 'show' | 'game' | 'person';
  },
  'titleName' | 'releaseDate' | 'firstAirDate' | 'knownForDepartment' | 'type'
>;

const _contentConst = [
  'movie',
  'movies',
  'show',
  'shows',
  'person',
  'people',
  'game',
  'games',
] as const;

export type TContent = (typeof _contentConst)[number];

const _igdbImageSizesConst = [
  'cover_small',
  'screenshot_med',
  'cover_big',
  'logo_med',
  'screenshot_big',
  'screenshot_huge',
  'thumb',
  'micro',
  '720p',
  '1080p',
] as const;

export type TIGDBImageSizes = (typeof _igdbImageSizesConst)[number];

export type TEpisodeCountDisplay = 'total-episodes' | 'season-episode';

export type TSeasonEpisodeAction = 'increment' | 'decrement';
