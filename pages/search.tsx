import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGetQuery } from '../hooks/useGetQuery';
import * as Queries from '../graphql/queries';
import SearchBar from '../components/SearchBar';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import SearchResult from '../components/SearchResult';
import { IUseGetQuery } from '../models/ts/interfaces';
import { ESearchResultsType } from '../models/ts/enums';

const Search: NextPage = () => {
	const router = useRouter();

	const [searchResultsType, setSearchResultsType] =
		useState<ESearchResultsType>(ESearchResultsType.MOVIES);

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

	const getSearchedTypeData = () => {
		if (searchResultsType === ESearchResultsType.MOVIES) {
			return searchedMovies;
		}

		if (searchResultsType === ESearchResultsType.SHOWS) {
			return searchedShows;
		}
	};

	const getSearchResultType = () => {
		if (searchResultsType === ESearchResultsType.MOVIES) {
			return 'movie';
		} else if (searchResultsType === ESearchResultsType.SHOWS) {
			return 'show';
		} else {
			return 'person';
		}
	};

	useEffect(() => {
		if (searchedMovies && searchedShows) {
			if (!searchedMovies.results.length && searchedShows.results.length) {
				setSearchResultsType(ESearchResultsType.SHOWS);
			}
		}
	}, [searchedMovies, searchedShows]);

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
								<h4
									onClick={() =>
										setSearchResultsType(ESearchResultsType.MOVIES)
									}
								>
									Movies
								</h4>
								<p>{searchedMovies.total_results}</p>
							</li>
							<li className='flex items-center'>
								<h4
									onClick={() => setSearchResultsType(ESearchResultsType.SHOWS)}
								>
									Shows
								</h4>
								<p>{searchedShows.total_results}</p>
							</li>
							<li className='flex items-center'>
								<h4
									onClick={() =>
										setSearchResultsType(ESearchResultsType.PEOPLE)
									}
								>
									People
								</h4>
							</li>
						</ul>
					</div>
					<div>
						{getSearchedTypeData()?.results.length ? (
							getSearchedTypeData()?.results.map(result => (
								<SearchResult
									key={result.id}
									result={result}
									searchedResultType={getSearchResultType()}
								/>
							))
						) : (
							<div>No results</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default Search;
