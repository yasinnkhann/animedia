import * as Queries from '../graphql/queries';
import { useQuery } from '@apollo/client';

const UseGetQuery = (queryStr: string) => {
	const gqlQueryName = 'QUERY_' + queryStr.toUpperCase().split(' ').join('_');

	// @ts-ignore
	const { data, loading, refetch } = useQuery(Queries[gqlQueryName]);

	let dataKey = queryStr.split(' ')[0];

	const wordsToCap = queryStr.split(' ').slice(1);

	for (let word of wordsToCap) {
		dataKey += word[0].toUpperCase() + word.slice(1).toLowerCase();
	}

	return { data: data?.[dataKey], loading, refetch };
};

export default UseGetQuery;

// DocumentNode | TypedDocumentNode<any, OperationVariables>
