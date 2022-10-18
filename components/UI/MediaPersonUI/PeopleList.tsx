import React from 'react';
import PersonCard from './PersonCard';
import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen';
import { RESULTS_PER_PAGE } from '../../../utils/specificNums';

interface Props {
	peopleData: NexusGenObjects['PeopleRes'];
	pageNum: number;
}

const MediaList = ({ peopleData, pageNum }: Props) => {
	return (
		<section className='grid grid-cols-4 gap-8 mb-8'>
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
