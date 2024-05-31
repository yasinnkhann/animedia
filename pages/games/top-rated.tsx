import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Pagination from 'components/Pagination';
import MediaList from 'components/MediaPerson/MediaList';
import * as Queries from '../../graphql/queries';
import { RESULTS_PER_PAGE } from '../../utils/constants';
import { Circles } from 'react-loading-icons';
import { useQuery } from '@apollo/client';

const TopRatedGames = () => {
	const router = useRouter();
	const [currPage, setCurrPage] = useState(1);

	const { data: topRatedGamesData, loading: topRatedGamesLoading } = useQuery(
		Queries.TOP_RATED_GAMES,
		{
			variables: {
				limit: RESULTS_PER_PAGE,
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

	if (!topRatedGamesData?.topRatedGames || topRatedGamesLoading) {
		return (
			<section className='flex h-screen items-center justify-center'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>Top-Rated Games</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				{topRatedGamesData ? (
					<section className='flex flex-col items-center'>
						<MediaList
							mediaData={topRatedGamesData.topRatedGames}
							pageNum={currPage}
							title='Top-Rated Games'
						/>
						<Pagination
							currPage={currPage}
							totalItems={topRatedGamesData.topRatedGames.total_results}
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

export default TopRatedGames;
