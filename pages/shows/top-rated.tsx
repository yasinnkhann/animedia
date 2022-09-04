import React, { useState } from 'react';
import { IUseGetQuery } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';
import { useGetQuery } from '../../hooks/useGetQuery';
import * as Queries from '../../graphql/queries';
import MediaList from 'components/MediaList';

const TopRatedShows = () => {
	const [pageNum, setPageNum] = useState(1);
	const { data: topRatedShowsData }: IUseGetQuery<NexusGenObjects['ShowsRes']> =
		useGetQuery<NexusGenArgTypes['Query']['topRatedShows']>(
			Queries.QUERY_TOP_RATED_SHOWS,
			{
				page: pageNum,
			}
		);

	console.log(topRatedShowsData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			top rated shows
			{topRatedShowsData && <MediaList mediaData={topRatedShowsData} />}
		</section>
	);
};

export default TopRatedShows;
