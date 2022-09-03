import React from 'react';
import { IUseGetQuery } from '@ts/interfaces';
import { NexusGenObjects } from '../../graphql/generated/nexus-typegen';
import { useGetQuery } from '../../hooks/useGetQuery';
import * as Queries from '../../graphql/queries';

const PopularMovies = () => {
	const { data: whatsPopularData }: IUseGetQuery<NexusGenObjects['MoviesRes']> =
		useGetQuery(Queries.QUERY_POPULAR_MOVIES);

	console.log(whatsPopularData);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			popular movies
		</div>
	);
};

export default PopularMovies;
