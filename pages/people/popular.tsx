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
import { RESULTS_PER_PAGE } from 'utils/resultsPerPage';

const PopularPeople = () => {
	const [_currPeopleItems, setCurrPeopleItems] = useState<
		NexusGenObjects['PeopleRes']['results']
	>([]);
	const [currPage, setCurrPage] = useState(1);
	const [peopleItemsPerPage] = useState(RESULTS_PER_PAGE);

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

	useEffect(() => {
		if (popularPeopleData) {
			const endIdx = currPage * peopleItemsPerPage;
			const startIdx = endIdx - peopleItemsPerPage;
			const peopleItemsCopy = [...popularPeopleData.results];
			setCurrPeopleItems(peopleItemsCopy.slice(startIdx, endIdx));
		}
	}, [currPage, popularPeopleData, peopleItemsPerPage]);

	const goToNextPage = () => {
		setCurrPage(currPage => currPage + 1);
	};

	const goToPrevPage = () => {
		setCurrPage(currPage => currPage - 1);
	};

	const getPaginationGroup = () => {
		let start =
			Math.floor((currPage - 1) / peopleItemsPerPage) * peopleItemsPerPage;
		return new Array(peopleItemsPerPage)
			.fill(null)
			.map((_, idx) => start + idx + 1);
	};

	console.log(popularPeopleData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			popular people
			{popularPeopleData && (
				<>
					<PeopleList peopleData={popularPeopleData} pageNum={currPage} />
					<Pagination
						itemsPerPage={peopleItemsPerPage}
						totalItems={popularPeopleData.total_results}
						currPage={currPage}
						pageNums={getPaginationGroup()}
						paginate={pageNum => setCurrPage(pageNum)}
						goToPrevPage={goToPrevPage}
						goToNextPage={goToNextPage}
					/>
				</>
			)}
		</section>
	);
};

export default PopularPeople;
