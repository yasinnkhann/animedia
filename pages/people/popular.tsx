import React, { useState } from 'react';
import { IUseGetQuery } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';
import { useGetQuery } from '../../hooks/useGetQuery';
import * as Queries from '../../graphql/queries';
import PeopleList from 'components/PeopleList';

const PopularPeople = () => {
	const [pageNum, setPageNum] = useState(1);
	const {
		data: popularPeopleData,
	}: IUseGetQuery<NexusGenObjects['PeopleRes']> = useGetQuery<
		NexusGenArgTypes['Query']['popularPeople']
	>(Queries.QUERY_POPULAR_PEOPLE, {
		page: pageNum,
	});

	console.log(popularPeopleData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			popular people
			{popularPeopleData && <PeopleList peopleData={popularPeopleData} />}
		</section>
	);
};

export default PopularPeople;
