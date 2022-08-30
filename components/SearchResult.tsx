import React from 'react';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';

interface Props {
	result: NexusGenObjects['MovieResult'] | NexusGenObjects['ShowResult'];
}

const SearchResult = ({ result }: Props) => {
	return (
		<div>
			<h1>{'title' in result ? result.title : result.name}</h1>
		</div>
	);
};

export default SearchResult;
