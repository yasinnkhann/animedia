import React, { useState } from 'react';
import { IUseGetQuery } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';
import { useGetQuery } from '../../hooks/useGetQuery';
import * as Queries from '../../graphql/queries';
import MediaList from 'components/MediaList';

const PopularShows = () => {
	const [pageNum, setPageNum] = useState(1);
	const { data: popularShowsData }: IUseGetQuery<NexusGenObjects['ShowsRes']> =
		useGetQuery<NexusGenArgTypes['Query']['popularShows']>(
			Queries.QUERY_POPULAR_SHOWS,
			{
				page: pageNum,
			}
		);

	console.log(popularShowsData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			popular shows
			{popularShowsData && <MediaList mediaData={popularShowsData} />}
		</section>
	);
};

export default PopularShows;
