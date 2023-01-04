import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen';

export type THomeHorizontalScrollerData =
	| NexusGenObjects['MoviesRes']['results']
	| NexusGenObjects['ShowsRes']['results'];

export type TStatusParam =
	| 'watching'
	| 'completed'
	| 'on-hold'
	| 'dropped'
	| 'plan-to-watch';

export const searchResultsConst = ['movies', 'shows', 'people'] as const;

export type TSearchResults = typeof searchResultsConst[number];
