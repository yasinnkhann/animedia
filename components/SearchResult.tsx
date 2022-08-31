import React from 'react';
import { useRouter } from 'next/router';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';

interface Props {
	result: NexusGenObjects['MovieResult'] | NexusGenObjects['ShowResult'];
	searchedResultType: string;
}

const SearchResult = ({ result, searchedResultType }: Props) => {
	const router = useRouter();
	const mediaTitle = 'title' in result ? result.title : result.name;

	const directToDetailsPage = () => {
		router.push(
			`${searchedResultType}/${result.id}-${mediaTitle.split(' ').join('-')}`
		);
	};
	return (
		<div>
			<h1 onClick={directToDetailsPage}>{mediaTitle}</h1>
		</div>
	);
};

export default SearchResult;
