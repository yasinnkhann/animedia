import React from 'react';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';

interface Props {
	person: NexusGenObjects['PersonResult'];
}

const PersonCard = ({ person }: Props) => {
	return <div>{person.name}</div>;
};

export default PersonCard;
