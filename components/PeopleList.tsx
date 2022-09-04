import React from 'react';
import PersonCard from './PersonCard';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
interface Props {
	peopleData: NexusGenObjects['PeopleRes'];
}

const MediaList = ({ peopleData }: Props) => {
	return (
		<div>
			{peopleData.results.map(person => (
				<div key={person.id}>
					<PersonCard person={person} />
				</div>
			))}
		</div>
	);
};

export default MediaList;
