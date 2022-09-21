import {
	DocumentNode,
	useQuery,
	useLazyQuery,
	useMutation,
	QueryHookOptions,
	MutationHookOptions,
	DefaultContext,
} from '@apollo/client';

export function useGQLQuery<TVars>(
	query: DocumentNode,
	options?: QueryHookOptions<any, TVars>
) {
	const { data, loading, error, refetch } = useQuery(query, options);

	const [
		fetchData,
		{ data: lazyData, loading: lazyLoading, error: lazyError },
	] = useLazyQuery(query, options);

	return {
		data: data?.[Object.keys(data)[0]],
		loading,
		error,
		refetch,
		fetchData,
		lazyData: lazyData?.[Object.keys(lazyData)[0]],
		lazyLoading,
		lazyError,
	};
}

export function useGQLMutation<TVars>(
	mutation: DocumentNode,
	options?: MutationHookOptions<any, TVars>
) {
	const [
		mutateFunction,
		{ data: mutateData, loading: mutateLoading, error: mutateError },
	] = useMutation(mutation, options);

	return {
		mutateFunction,
		mutateData: mutateData?.[Object.keys(mutateData)[0]],
		mutateLoading,
		mutateError,
	};
}
