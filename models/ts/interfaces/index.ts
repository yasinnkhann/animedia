import { ApolloError } from '@apollo/client/errors';
import { ApolloQueryResult, OperationVariables } from '@apollo/client/core';
import { LazyQueryExecFunction } from '@apollo/client/react/types/types';
import { ESearchType } from '../enums/index';

export interface IUseGetQuery<T> {
	data: T | undefined;
	loading: boolean;
	error: ApolloError | undefined;
	refetch: (
		variables?: Partial<any> | undefined
	) => Promise<ApolloQueryResult<any>>;
	fetchData: LazyQueryExecFunction<any, OperationVariables>;
	lazyData: T | undefined;
	lazyError: ApolloError | undefined;
}

export interface IHorizontalScrollerItemClickInfo {
	mediaType: ESearchType.MOVIE | ESearchType.SHOW;
	id: number;
	title: string;
}
