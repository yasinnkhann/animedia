import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen';

export type THorizontalScrollerData =
	| NexusGenObjects['MoviesRes']['results']
	| NexusGenObjects['ShowsRes']['results'];

export type TStatusParam =
	| 'watching'
	| 'completed'
	| 'on-hold'
	| 'dropped'
	| 'plan-to-watch';
