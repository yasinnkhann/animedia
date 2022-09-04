import React, { useState } from 'react';
import { IUseGetQuery } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';
import { useGetQuery } from '../../hooks/useGetQuery';
import * as Queries from '../../graphql/queries';
import MediaList from 'components/MediaList';

const PopularMovies = () => {
	const [pageNum, setPageNum] = useState(1);
	const {
		data: popularMoviesData,
	}: IUseGetQuery<NexusGenObjects['MoviesRes']> = useGetQuery<
		NexusGenArgTypes['Query']['popularMovies']
	>(Queries.QUERY_POPULAR_MOVIES, {
		page: pageNum,
	});

	console.log(popularMoviesData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			popular movies
			{popularMoviesData && <MediaList mediaData={popularMoviesData} />}
		</section>
	);
};

export default PopularMovies;
