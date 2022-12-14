import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

const TopRatedShows = () => {
	const router = useRouter();
	const [currPage, setCurrPage] = useState(1);

	const {
		data: topRatedShowsData,
	}: IUseGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['topRatedShows']
	> = useGQLQuery<NexusGenArgTypes['Query']['topRatedShows']>(
		Queries.QUERY_TOP_RATED_SHOWS,
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
		if (router.query.page) {
			setCurrPage(+(router.query.page as string));
		}
	}, [router]);

	return (
		<>
			<Head>
				<title>Top-Rated Shows</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				{topRatedShowsData ? (
					<section className='flex flex-col items-center'>
						<MediaList
							mediaData={topRatedShowsData}
							pageNum={currPage}
							title='Top-Rated Shows'
						/>
						<Pagination
							currPage={currPage}
							totalItems={topRatedShowsData.total_results}
							itemsPerPage={RESULTS_PER_PAGE}
							paginate={(pageNum: number) =>
								router.push(`${router.pathname}?page=${pageNum}`)
							}
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

export default TopRatedShows;
