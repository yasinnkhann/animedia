import { ApolloError } from '@apollo/client/errors';
import { ApolloQueryResult } from '@apollo/client/core';

export interface IUseGetQuery<T> {
	data: T;
	loading: boolean;
	error: ApolloError | undefined;
	refetch: (
		variables?: Partial<any> | undefined
	) => Promise<ApolloQueryResult<any>>;
}
