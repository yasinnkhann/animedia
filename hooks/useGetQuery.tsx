import { DocumentNode, useQuery } from '@apollo/client';

export const useGetQuery = (gqlQueryName: DocumentNode) => {
	const { data, loading, refetch, error } = useQuery(gqlQueryName);

	return { data: data?.[Object.keys(data)[0]], loading, error, refetch };
};
