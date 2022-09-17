import {
	DocumentNode,
	useQuery,
	useLazyQuery,
	useMutation,
} from '@apollo/client';

export function useGQLQuery<T>(gqlQueryName: DocumentNode, variables?: T) {
	const { data, loading, error, refetch } = useQuery(gqlQueryName, {
		variables,
	});

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
}

export function useGQLMutation<T>(gqlQueryName: DocumentNode, variables?: T) {
	const [
		mutateFunction,
		{ data: mutateData, loading: mutateLoading, error: mutateError },
	] = useMutation(gqlQueryName, {
		variables,
	});

	return {
		mutateFunction,
		mutateData,
		mutateLoading,
		mutateError,
	};
}
