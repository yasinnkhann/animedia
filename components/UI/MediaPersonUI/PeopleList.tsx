import React from 'react';
import PersonCard from './PersonCard';
import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen';
import { RESULTS_PER_PAGE } from '../../../utils/constants';

interface Props {
	peopleData: NexusGenObjects['PeopleRes'];
	pageNum: number;
}

const MediaList = ({ peopleData, pageNum }: Props) => {
	return (
		<section className='mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
			{peopleData.results.map((person, idx) => (
				<section key={person.id}>
					<PersonCard
						person={person}
						rank={pageNum * RESULTS_PER_PAGE - (RESULTS_PER_PAGE - idx) + 1}
					/>
				</section>
			))}
		</section>
	);
};

export default MediaList;
