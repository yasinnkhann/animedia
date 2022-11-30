import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Pagination from 'components/Pagination';
import MediaList from 'components/UI/MediaPersonUI/MediaList';
import * as Queries from '../../graphql/queries';
import { IUseGQLQuery } from '@ts/interfaces';
import { useGQLQuery } from '../../hooks/useGQL';
import { RESULTS_PER_PAGE } from '../../utils/specificVals';
import { Circles } from 'react-loading-icons';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';

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
		<>
			<Head>
				<title>Popular Anime Shows</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
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
					<section className='h-[calc(100vh-var(--header-height-mobile))] flex justify-center items-center'>
						<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
					</section>
				)}
			</main>
		</>
	);
};

export default PopularAnimeShows;
