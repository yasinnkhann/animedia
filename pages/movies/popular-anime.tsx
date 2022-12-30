import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Pagination from 'components/Pagination';
import MediaList from 'components/UI/MediaPersonUI/MediaList';
import * as Queries from '../../graphql/queries';
import { useGQLQuery } from '../../hooks/useGQL';
import { RESULTS_PER_PAGE } from 'utils/specificVals';
import { Circles } from 'react-loading-icons';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';

const PopularAnimeMovies = () => {
	const router = useRouter();
	const [currPage, setCurrPage] = useState(1);

	const { data: popularAnimeMoviesData } = useGQLQuery<
		NexusGenObjects['MoviesRes'],
		NexusGenArgTypes['Query']['popularAnimeMovies']
	>(Queries.QUERY_POPULAR_ANIME_MOVIES, {
		variables: {
			page: currPage,
		},
	});

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
				<title>Popular Anime Movies</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				{popularAnimeMoviesData ? (
					<section className='flex flex-col items-center'>
						<MediaList
							mediaData={popularAnimeMoviesData}
							pageNum={currPage}
							title='Popular Anime Movies'
						/>
						<Pagination
							currPage={currPage}
							totalItems={popularAnimeMoviesData.total_results}
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

export default PopularAnimeMovies;
