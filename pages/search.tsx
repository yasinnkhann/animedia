import type { NextPage } from 'next';
import React from 'react';
import { useRouter } from 'next/router';
import { useGetQuery } from '../hooks/useGetQuery';
import * as Queries from '../graphql/queries';
import SearchBar from '../components/SearchBar';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { ApolloError } from '@apollo/client/errors';
import { ApolloQueryResult } from '@apollo/client/core';
interface IUseGetQuery<T> {
	data: T;
	loading: boolean;
	error: ApolloError | undefined;
	refetch: (
		variables?: Partial<any> | undefined
	) => Promise<ApolloQueryResult<any>>;
}

const Search: NextPage = () => {
	const router = useRouter();

	const {
		data: searchedMovies,
		loading: searchedMoviesLoading,
		error: searchedMoviesError,
		refetch: refetchSearchedMovies,
	}: IUseGetQuery<NexusGenObjects['MoviesRes']> = useGetQuery(
		Queries.QUERY_SEARCHED_MOVIES,
		{
			q: router.query.q ?? '',
		}
	);

	console.log(searchedMovies?.results[0]);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{searchedMovies && (
				<div>
					<SearchBar />
					<div className='border border-black'>
						<div>
							<h3>Search Results</h3>
						</div>
						<ul>
							<li className='flex'>
								<h4>Movies</h4>
								<p>hi</p>
							</li>
							<li>
								<h4>Shows</h4>
							</li>
							<li>
								<h4>People</h4>
							</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};

export default Search;
