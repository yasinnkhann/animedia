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
	LazyQueryHookOptions,
	ApolloCache,
} from '@apollo/client';

export function useGQLQuery<TData = any, TVars = OperationVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVars>,
	options?: QueryHookOptions<TData, TVars>
) {
	const { data, loading, error, refetch } = useQuery<TData, TVars>(
		query,
		options
	);

	return {
		data: data?.[Object.keys(data)[0] as keyof TData] as TData,
		loading,
		error,
		refetch,
	};
}

export function useGQLLazyQuery<TData = any, TVars = OperationVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVars>,
	options?: LazyQueryHookOptions<TData, TVars>
) {
	const [
		fetchData,
		{ data: lazyData, loading: lazyLoading, error: lazyError },
	] = useLazyQuery(query, options);

	return {
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
	options?: MutationHookOptions<TData, TVars, TContext, ApolloCache<any>>
) {
	const [
		mutateFunction,
		{ data: mutateData, loading: mutateLoading, error: mutateError },
	] = useMutation<TData, TVars, TContext, ApolloCache<any>>(mutation, options);

	function extractData(res: { data: TData }): TData {
		return res.data[Object.keys(res.data as any)[0] as keyof TData] as TData;
	}

	return {
		mutateFunction,
		mutateData: mutateData?.[
			Object.keys(mutateData)[0] as keyof TData
		] as TData,
		mutateLoading,
		mutateError,
		extractData,
	};
}
