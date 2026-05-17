'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination';
import PeopleList from '@/components/MediaPerson/PeopleList';
import * as Queries from '@/graphql/queries';
import { RESULTS_PER_PAGE } from '@/utils/constants';
import { Circles } from 'react-loading-icons';
import { useQuery } from '@apollo/client/react';
const PopularPeople = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const page = searchParams.get('page') ?? '1';
	const currPage = Math.max(1, Number.parseInt(page, 10) || 1);

	const { data: popularPeopleData } = useQuery(Queries.POPULAR_PEOPLE, {
		variables: {
			page: parseInt(page, 10),
		},
	});

	const scrollToTop = () => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToTop();
	}, [page]);

	return (
		<main className='mt-[calc(var(--header-height-mobile)+1rem)] px-48'>
			{popularPeopleData ? (
				<>
					<h3 className='mb-4'>Popular People</h3>
					<PeopleList peopleData={popularPeopleData.popularPeople} pageNum={currPage} />
					<Pagination
						currPage={currPage}
						totalItems={popularPeopleData.popularPeople.total_results}
						itemsPerPage={RESULTS_PER_PAGE}
						paginate={(pageNum: number) => router.push(`/people/popular?page=${pageNum}`)}
						siblingCount={1}
						maxPageNum={500}
					/>
				</>
			) : (
				<section className='flex h-[calc(100vh-var(--header-height-mobile))] items-center justify-center'>
					<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
				</section>
			)}
		</main>
	);
};

export default PopularPeople;
