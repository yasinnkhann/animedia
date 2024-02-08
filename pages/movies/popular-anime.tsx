import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Pagination from 'components/Pagination';
import MediaList from 'components/MediaPerson/MediaList';
import * as Queries from '../../graphql/queries';
import { RESULTS_PER_PAGE } from 'utils/constants';
import { Circles } from 'react-loading-icons';
import { useQuery } from '@apollo/client';

const PopularAnimeMovies = () => {
	const router = useRouter();
	const [currPage, setCurrPage] = useState(1);

	const { data: popularAnimeMoviesData } = useQuery(
		Queries.POPULAR_ANIME_MOVIES,
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
				<title>Popular Anime Movies</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				{popularAnimeMoviesData ? (
					<section className='flex flex-col items-center'>
						<MediaList
							mediaData={popularAnimeMoviesData.popularAnimeMovies}
							pageNum={currPage}
							title='Popular Anime Movies'
						/>
						<Pagination
							currPage={currPage}
							totalItems={
								popularAnimeMoviesData.popularAnimeMovies.total_results
							}
							itemsPerPage={RESULTS_PER_PAGE}
							paginate={(pageNum: number) =>
								router.push(`${router.pathname}?page=${pageNum}`)
							}
							siblingCount={1}
							maxPageNum={500}
						/>
					</section>
				) : (
					<section className='flex h-[calc(100vh-var(--header-height-mobile))] items-center justify-center'>
						<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
					</section>
				)}
			</main>
		</>
	);
};

export default PopularAnimeMovies;
