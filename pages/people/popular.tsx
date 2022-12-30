import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Pagination from 'components/Pagination';
import PeopleList from 'components/UI/MediaPersonUI/PeopleList';
import * as Queries from '../../graphql/queries';
import { useGQLQuery } from '../../hooks/useGQL';
import { RESULTS_PER_PAGE } from 'utils/specificVals';
import { Circles } from 'react-loading-icons';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';

const PopularPeople = () => {
	const router = useRouter();
	const [currPage, setCurrPage] = useState(1);

	const { data: popularPeopleData } = useGQLQuery<
		NexusGenObjects['PeopleRes'],
		NexusGenArgTypes['Query']['popularPeople']
	>(Queries.QUERY_POPULAR_PEOPLE, {
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
						<PeopleList peopleData={popularPeopleData} pageNum={currPage} />
						<Pagination
							currPage={currPage}
							totalItems={popularPeopleData.total_results}
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
