import React, { useState, useEffect } from 'react';
import { IUseGQLQuery } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';
import { useGQLQuery } from '../../hooks/useGQL';
import * as Queries from '../../graphql/queries';
import MediaList from 'components/MediaList';
import Pagination from 'components/Pagination';
import { RESULTS_PER_PAGE } from '../../utils/resultsPerPage';
import { Circles } from 'react-loading-icons';

const PopularAnimeShows = () => {
	const [_currMediaItems, setCurrMediaItems] = useState<
		NexusGenObjects['ShowsRes']['results']
	>([]);
	const [currPage, setCurrPage] = useState(1);
	const [mediaItemsPerPage] = useState(RESULTS_PER_PAGE);

	const {
		data: popularAnimeShowsData,
	}: IUseGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['popularAnimeShows']
	> = useGQLQuery<NexusGenArgTypes['Query']['popularAnimeShows']>(
		Queries.QUERY_POPULAR_ANIME_SHOWS,
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
		if (popularAnimeShowsData) {
			const endIdx = currPage * mediaItemsPerPage;
			const startIdx = endIdx - mediaItemsPerPage;
			const mediaItemsCopy = [...popularAnimeShowsData.results];
			setCurrMediaItems(mediaItemsCopy.slice(startIdx, endIdx));
		}
	}, [currPage, popularAnimeShowsData, mediaItemsPerPage]);

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

	console.log(popularAnimeShowsData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{popularAnimeShowsData ? (
				<section className='flex flex-col items-center'>
					<MediaList
						mediaData={popularAnimeShowsData}
						pageNum={currPage}
						title='Popular Anime Shows'
					/>
					<Pagination
						itemsPerPage={mediaItemsPerPage}
						totalItems={popularAnimeShowsData.total_results}
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

export default PopularAnimeShows;
