import { ApolloError } from '@apollo/client/errors';
import { ApolloQueryResult } from '@apollo/client/core';
import { LazyQueryExecFunction } from '@apollo/client/react/types/types';
import { ESearchType } from '../enums/index';
import {
	MutationFunctionOptions,
	DefaultContext,
	ApolloCache,
	FetchResult,
} from '@apollo/client';

export interface IUseGQLQuery<TData, TVars = undefined> {
	data: TData | undefined;
	loading: boolean;
	error: ApolloError | undefined;
	refetch: (
		variables?: Partial<TVars> | undefined
	) => Promise<ApolloQueryResult<any>>;
	fetchData: LazyQueryExecFunction<any, TVars>;
	lazyData: TData | undefined;
	lazyLoading: boolean;
	lazyError: ApolloError | undefined;
}

export interface IUseGQLMutation<TData, TVars = undefined> {
	mutateFunction: (
		options?:
			| MutationFunctionOptions<any, TVars, DefaultContext, ApolloCache<any>>
			| undefined
	) => Promise<FetchResult<any>>;

	mutateData: TData | undefined;
	mutateLoading: boolean;
	mutateError: ApolloError | undefined;
}

export interface IHorizontalScrollerItemClickInfo {
	mediaType: ESearchType.MOVIE | ESearchType.SHOW | ESearchType.PERSON;
	id: number;
	title: string;
}

export interface IKnownForMedia {
	id: number;
	poster_path: string | undefined | null;
	title?: string;
	name?: string;
	popularity: number;
}

export interface ICast {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
}

export interface IEPDetails {
	showId: number;
	season: number;
	episode: number;
}

export interface INodeMailerInfo {
	recipientEmail: string;
	subject: string;
	text: string;
	html: string;
}
