import React from 'react';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';

interface Props {
	result: NexusGenObjects['MovieResult'];
}

const SearchResult = (props: Props) => {
	return <div>{props.result.title}</div>;
};

export default SearchResult;
