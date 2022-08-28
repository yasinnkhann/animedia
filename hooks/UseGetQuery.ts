// import * as Queries from '../graphql/queries';
// import { useQuery } from '@apollo/client';

// // const list = ['popular movies', 'popular anime movies'] as const;
// // type NeededUnionType = typeof list[number];

// const allQueries = { ...Queries } as const;

// type NeededUnionType = keyof typeof allQueries;

// const UseGetQuery = (queryStr: NeededUnionType) => {
// 	const gqlQueryName = 'QUERY_' + queryStr.toUpperCase().split(' ').join('_');

// 	// @ts-ignore
// 	const { data, loading, refetch, error } = useQuery(Queries[gqlQueryName]);

// 	let dataKey = queryStr.split(' ')[0];

// 	const wordsToCap = queryStr.split(' ').slice(1);

// 	for (let word of wordsToCap) {
// 		dataKey += word[0].toUpperCase() + word.slice(1).toLowerCase();
// 	}

// 	return { data: data?.[dataKey], loading, error, refetch };
// };

// export default UseGetQuery;
//!
import { DocumentNode, useQuery } from '@apollo/client';

const UseGetQuery = (gqlQueryName: DocumentNode) => {
	const { data, loading, refetch, error } = useQuery(gqlQueryName);

	return { data: data?.[Object.keys(data)[0]], loading, error, refetch };
};

export default UseGetQuery;
