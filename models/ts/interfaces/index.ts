import { ApolloError } from '@apollo/client/errors';
import { ApolloQueryResult } from '@apollo/client/core';
import { ESearchType } from '../enums/index';

export interface IUseGetQuery<T> {
	data: T;
	loading: boolean;
	error: ApolloError | undefined;
	refetch: (
		variables?: Partial<any> | undefined
	) => Promise<ApolloQueryResult<any>>;
}

export interface IHorizontalScrollerItemClickInfo {
	mediaType: ESearchType.MOVIE | ESearchType.SHOW;
	id: number;
	title: string;
}
