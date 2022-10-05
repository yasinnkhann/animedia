import React, { useState, useEffect } from 'react';
import { IUseGQLQuery } from '@ts/interfaces';
import { useGQLQuery } from '../../hooks/useGQL';
import * as Queries from '../../graphql/queries';
import MediaList from 'components/MediaList';
import Pagination from 'components/Pagination';
import { RESULTS_PER_PAGE } from '../../utils/specificNums';
import { Circles } from 'react-loading-icons';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';

const PopularMovies = () => {
	const [_currMediaItems, setCurrMediaItems] = useState<
		NexusGenObjects['MoviesRes']['results']
	>([]);
	const [currPage, setCurrPage] = useState(1);
	const [mediaItemsPerPage] = useState(RESULTS_PER_PAGE);

	const {
		data: popularMoviesData,
	}: IUseGQLQuery<
		NexusGenObjects['MoviesRes'],
		NexusGenArgTypes['Query']['popularMovies']
	> = useGQLQuery<NexusGenArgTypes['Query']['popularMovies']>(
		Queries.QUERY_POPULAR_MOVIES,
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

	useEffect(() => {
		if (popularMoviesData) {
			const endIdx = currPage * mediaItemsPerPage;
			const startIdx = endIdx - mediaItemsPerPage;
			const mediaItemsCopy = [...popularMoviesData.results];

			setCurrMediaItems(mediaItemsCopy.slice(startIdx, endIdx));
		}
	}, [currPage, popularMoviesData, mediaItemsPerPage]);

	const goToNextPage = () => {
		setCurrPage(currPage => currPage + 1);
	};

	const goToPrevPage = () => {
		setCurrPage(currPage => currPage - 1);
	};

	const getPaginationGroup = () => {
		let start =
			Math.floor((currPage - 1) / mediaItemsPerPage) * mediaItemsPerPage;
		return new Array(mediaItemsPerPage)
			.fill(null)
			.map((_, idx) => start + idx + 1);
	};

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{popularMoviesData ? (
				<section className='flex flex-col items-center'>
					<MediaList
						mediaData={popularMoviesData}
						pageNum={currPage}
						title='Popular Movies'
					/>
					<Pagination
						itemsPerPage={mediaItemsPerPage}
						totalItems={popularMoviesData.total_results}
						currPage={currPage}
						pageNums={getPaginationGroup()}
						paginate={pageNum => setCurrPage(pageNum)}
						goToPrevPage={goToPrevPage}
						goToNextPage={goToNextPage}
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

export default PopularMovies;
