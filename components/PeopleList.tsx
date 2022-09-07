import React from 'react';
import PersonCard from './PersonCard';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { RESULTS_PER_PAGE } from '../utils/resultsPerPage';

interface Props {
	peopleData: NexusGenObjects['PeopleRes'];
	pageNum: number;
}

const MediaList = ({ peopleData, pageNum }: Props) => {
	return (
		<section>
			{peopleData.results.map((person, idx) => (
				<div key={person.id}>
					<PersonCard
						person={person}
						rank={pageNum * RESULTS_PER_PAGE - (RESULTS_PER_PAGE - idx) + 1}
					/>
				</div>
			))}
		</section>
	);
};

export default MediaList;
