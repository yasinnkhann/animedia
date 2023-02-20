import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Pagination from 'components/Pagination';
import PeopleList from 'components/UI/MediaPersonUI/PeopleList';
import * as Queries from '../../graphql/queries';
import { RESULTS_PER_PAGE } from 'utils/specificVals';
import { Circles } from 'react-loading-icons';
import { useQuery } from '@apollo/client';

const PopularPeople = () => {
	const router = useRouter();
	const [currPage, setCurrPage] = useState(1);

	const { data: popularPeopleData } = useQuery(Queries.POPULAR_PEOPLE, {
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
				<title>Popular People</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)] px-48'>
				{popularPeopleData ? (
					<>
						<h3 className='mb-4'>Popular People</h3>
						<PeopleList
							peopleData={popularPeopleData.popularPeople}
							pageNum={currPage}
						/>
						<Pagination
							currPage={currPage}
							totalItems={popularPeopleData.popularPeople.total_results}
							itemsPerPage={RESULTS_PER_PAGE}
							paginate={(pageNum: number) =>
								router.push(`${router.pathname}?page=${pageNum}`)
							}
							siblingCount={1}
							maxPageNum={500}
						/>
					</>
				) : (
					<section className='h-[calc(100vh-var(--header-height-mobile))] flex justify-center items-center'>
						<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
					</section>
				)}
			</main>
		</>
	);
};

export default PopularPeople;
