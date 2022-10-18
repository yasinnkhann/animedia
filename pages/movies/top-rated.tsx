import React, { useState, useEffect } from 'react';
import Pagination from 'components/Pagination';
import MediaList from 'components/UI/MediaPersonUI/MediaList';
import * as Queries from '../../graphql/queries';
import { IUseGQLQuery } from '@ts/interfaces';
import { useGQLQuery } from '../../hooks/useGQL';
import { RESULTS_PER_PAGE } from '../../utils/specificNums';
import { Circles } from 'react-loading-icons';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';

const TopRatedMovies = () => {
	const [currPage, setCurrPage] = useState(1);

	const {
		data: topRatedMoviesData,
	}: IUseGQLQuery<
		NexusGenObjects['MoviesRes'],
		NexusGenArgTypes['Query']['topRatedMovies']
	> = useGQLQuery<NexusGenArgTypes['Query']['topRatedMovies']>(
		Queries.QUERY_TOP_RATED_MOVIES,
		{
			variables: {
				page: currPage,
			},
		}
	);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToTop();
	}, [currPage]);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{topRatedMoviesData ? (
				<section className='flex flex-col items-center'>
					<MediaList
						mediaData={topRatedMoviesData}
						pageNum={currPage}
						title='Top-Rated Movies'
					/>
					<Pagination
						currPage={currPage}
						totalItems={topRatedMoviesData.total_results}
						itemsPerPage={RESULTS_PER_PAGE}
						paginate={(pageNum: number) => setCurrPage(pageNum)}
						siblingCount={1}
						maxPageNum={500}
					/>
				</section>
			) : (
				<div className='h-[calc(100vh-var(--header-height-mobile))] flex justify-center items-center'>
					<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
				</div>
			)}
		</section>
	);
};

export default TopRatedMovies;
