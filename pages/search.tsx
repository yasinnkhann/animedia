import type { NextPage } from 'next';
import React from 'react';
import { useRouter } from 'next/router';
import { useGetQuery } from '../hooks/useGetQuery';
import * as Queries from '../graphql/queries';
import SearchBar from '../components/SearchBar';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { ApolloError } from '@apollo/client/errors';
import { ApolloQueryResult } from '@apollo/client/core';
import SearchResult from '../components/SearchResult';

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

	const {
		data: searchedShows,
		loading: searchedShowsLoading,
		error: searchedShowsError,
		refetch: refetchSearchedShows,
	}: IUseGetQuery<NexusGenObjects['ShowsRes']> = useGetQuery(
		Queries.QUERY_SEARCHED_SHOWS,
		{
			q: router.query.q ?? '',
		}
	);

	console.log('movies: ', searchedMovies);
	console.log('shows: ', searchedShows);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{searchedMovies && searchedShows && (
				<>
					<SearchBar />
					<div className='border border-black'>
						<div>
							<h3>Search Results</h3>
						</div>
						<ul>
							<li className='flex items-center'>
								<h4>Movies</h4>
								<p>{searchedMovies.total_results}</p>
							</li>
							<li className='flex items-center'>
								<h4>Shows</h4>
								<p>{searchedShows.total_results}</p>
							</li>
							<li className='flex items-center'>
								<h4>People</h4>
							</li>
						</ul>
					</div>
					<div>
						{searchedMovies.results.map(result => (
							<SearchResult key={result.id} result={result} />
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default Search;
