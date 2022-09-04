import React, { useState } from 'react';
import { IUseGetQuery } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';
import { useGetQuery } from '../../hooks/useGetQuery';
import * as Queries from '../../graphql/queries';
import MediaList from 'components/MediaList';

const TopRatedMovies = () => {
	const [pageNum, setPageNum] = useState(1);
	const {
		data: topRatedMoviesData,
	}: IUseGetQuery<NexusGenObjects['MoviesRes']> = useGetQuery<
		NexusGenArgTypes['Query']['topRatedMovies']
	>(Queries.QUERY_TOP_RATED_MOVIES, {
		page: pageNum,
	});

	console.log(topRatedMoviesData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			top rated movies
			{topRatedMoviesData && <MediaList mediaData={topRatedMoviesData} />}
		</section>
	);
};

export default TopRatedMovies;
