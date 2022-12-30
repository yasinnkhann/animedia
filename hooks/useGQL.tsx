import {
	DocumentNode,
	useQuery,
	useLazyQuery,
	useMutation,
	QueryHookOptions,
	MutationHookOptions,
	OperationVariables,
	TypedDocumentNode,
	DefaultContext,
} from '@apollo/client';

export function useGQLQuery<TData = any, TVars = OperationVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVars>,
	options?: QueryHookOptions<TData, TVars>
) {
	const { data, loading, error, refetch } = useQuery<TData, TVars>(
		query,
		options
	);

	const [
		fetchData,
		{ data: lazyData, loading: lazyLoading, error: lazyError },
	] = useLazyQuery(query, options);

	return {
		data: data?.[Object.keys(data)[0] as keyof TData] as TData,
		loading,
		error,
		refetch,
		fetchData,
		lazyData: lazyData?.[Object.keys(lazyData)[0] as keyof TData] as TData,
		lazyLoading,
		lazyError,
	};
}

export function useGQLMutation<
	TData = any,
	TVars = OperationVariables,
	TContext = DefaultContext
>(
	mutation: DocumentNode | TypedDocumentNode<TData, TVars>,
	options?: MutationHookOptions<TData, TVars, TContext>
) {
	const [
		mutateFunction,
		{ data: mutateData, loading: mutateLoading, error: mutateError },
	] = useMutation(mutation, options);

	return {
		mutateFunction,
		mutateData: mutateData?.[
			Object.keys(mutateData)[0] as keyof TData
		] as TData,
		mutateLoading,
		mutateError,
	};
}
