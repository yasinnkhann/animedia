import { DocumentNode, useQuery, useLazyQuery } from '@apollo/client';

export const useGetQuery = (gqlQueryName: DocumentNode) => {
	const { data, loading, error, refetch } = useQuery(gqlQueryName);

	const [fetchData, { data: lazyData, error: lazyError }] =
		useLazyQuery(gqlQueryName);

	return {
		data: data?.[Object.keys(data)[0]],
		loading,
		error,
		refetch,
		fetchData,
		lazyData: lazyData?.[Object.keys(lazyData)[0]],
		lazyError,
	};
};
