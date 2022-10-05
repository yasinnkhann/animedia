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
import { RESULTS_PER_PAGE } from '../../utils/specificNums';
import { Circles } from 'react-loading-icons';

const PopularAnimeShows = () => {
	const [currPage, setCurrPage] = useState(1);

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
						currPage={currPage}
						totalItems={popularAnimeShowsData.total_results}
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

export default PopularAnimeShows;
