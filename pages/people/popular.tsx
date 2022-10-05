import React, { useState, useEffect } from 'react';
import { IUseGQLQuery } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';
import { useGQLQuery } from '../../hooks/useGQL';
import * as Queries from '../../graphql/queries';
import PeopleList from 'components/PeopleList';
import Pagination from 'components/Pagination';
import { RESULTS_PER_PAGE } from 'utils/specificNums';
import { Circles } from 'react-loading-icons';

const PopularPeople = () => {
	const [currPage, setCurrPage] = useState(1);

	const {
		data: popularPeopleData,
	}: IUseGQLQuery<
		NexusGenObjects['PeopleRes'],
		NexusGenArgTypes['Query']['popularPeople']
	> = useGQLQuery<NexusGenArgTypes['Query']['popularPeople']>(
		Queries.QUERY_POPULAR_PEOPLE,
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

	console.log(popularPeopleData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)] px-32'>
			{popularPeopleData ? (
				<>
					<h3 className='mb-4'>Popular People</h3>
					<PeopleList peopleData={popularPeopleData} pageNum={currPage} />
					<Pagination
						currPage={currPage}
						totalItems={popularPeopleData.total_results}
						itemsPerPage={RESULTS_PER_PAGE}
						paginate={(pageNum: number) => setCurrPage(pageNum)}
						siblingCount={1}
						maxPageNum={500}
					/>
				</>
			) : (
				<div className='h-[calc(100vh-var(--header-height-mobile))] flex justify-center items-center'>
					<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
				</div>
			)}
		</section>
	);
};

export default PopularPeople;
