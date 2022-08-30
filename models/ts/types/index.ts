import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen';

export type THorizontalScrollerData =
	| NexusGenObjects['MoviesRes']['results']
	| NexusGenObjects['ShowsRes']['results'];

export type THorizontalScrollerTimeWindow = 'day' | 'week';
