'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Pagination from '../../../components/Pagination';
import MediaList from '../../../components/MediaPerson/MediaList';
import * as Queries from '../../../graphql/queries';
import { RESULTS_PER_PAGE } from '../../../utils/constants';
import { Circles } from 'react-loading-icons';
import { useQuery } from '@apollo/client/react';
const PopularMovies = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const page = searchParams.get('page') ?? '1';
	const currPage = Math.max(1, Number.parseInt(page, 10) || 1);

	const { data: popularMoviesData } = useQuery(Queries.POPULAR_MOVIES, {
		variables: {
			page: parseInt(page),
		},
	});

	const scrollToTop = () => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToTop();
	}, [page]);

	return (
		<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{popularMoviesData ? (
				<section className='flex flex-col items-center'>
					<MediaList
						mediaData={popularMoviesData.popularMovies}
						pageNum={currPage}
						title='Popular Movies'
					/>

					<Pagination
						currPage={currPage}
						totalItems={popularMoviesData.popularMovies.total_results}
						itemsPerPage={RESULTS_PER_PAGE}
						paginate={(pageNum: number) => router.push(`/movies/popular?page=${pageNum}`)}
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
	);
};

export default PopularMovies;
