import React from 'react';
import { useRouter } from 'next/router';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { getDetailsPageRoute } from '../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';

interface Props {
	result: NexusGenObjects['MovieResult'] | NexusGenObjects['ShowResult'];
	searchedResultType: ESearchType;
}

const SearchResult = ({ result, searchedResultType }: Props) => {
	const router = useRouter();
	const mediaTitle = 'title' in result ? result.title : result.name;

	const directToDetailsPage = () => {
		router.push(getDetailsPageRoute(searchedResultType, result.id, mediaTitle));
	};

	return (
		<div>
			<h1 onClick={directToDetailsPage}>{mediaTitle}</h1>
		</div>
	);
};

export default SearchResult;
