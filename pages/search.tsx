import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGetQuery } from '../hooks/useGetQuery';
import * as Queries from '../graphql/queries';
import SearchBar from '../components/SearchBar';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../graphql/generated/nexus-typegen';
import SearchResult from '../components/SearchResult';
import { IUseGetQuery } from '@ts/interfaces';
import { ESearchResultsType, ESearchType } from '@ts/enums';

const Search: NextPage = () => {
	const router = useRouter();

	const [searchResultsType, setSearchResultsType] =
		useState<ESearchResultsType>(ESearchResultsType.MOVIES);

	const {
		data: searchedMovies,
		loading: searchedMoviesLoading,
		error: searchedMoviesError,
		refetch: refetchSearchedMovies,
	}: IUseGetQuery<NexusGenObjects['MoviesRes']> = useGetQuery<
		NexusGenArgTypes['Query']['searchedMovies']
	>(Queries.QUERY_SEARCHED_MOVIES, {
		q: (router.query.q as string) ?? '',
	});

	const {
		data: searchedShows,
		loading: searchedShowsLoading,
		error: searchedShowsError,
		refetch: refetchSearchedShows,
	}: IUseGetQuery<NexusGenObjects['ShowsRes']> = useGetQuery<
		NexusGenArgTypes['Query']['searchedShows']
	>(Queries.QUERY_SEARCHED_SHOWS, {
		q: (router.query.q as string) ?? '',
	});

	const {
		data: searchedPeople,
		loading: searchedPeopleLoading,
		error: searchedPeopleError,
		refetch: refetchSearchedPeople,
	}: IUseGetQuery<NexusGenObjects['PeopleRes']> = useGetQuery<
		NexusGenArgTypes['Query']['searchedPeople']
	>(Queries.QUERY_SEARCHED_PEOPLE, {
		q: (router.query.q as string) ?? '',
	});

	const getSearchedTypeData = () => {
		if (searchResultsType === ESearchResultsType.MOVIES) {
			return searchedMovies;
		}

		if (searchResultsType === ESearchResultsType.SHOWS) {
			return searchedShows;
		}

		if (searchResultsType === ESearchResultsType.PEOPLE) {
			return searchedPeople;
		}
	};

	const getSearchResultType = () => {
		if (searchResultsType === ESearchResultsType.MOVIES) {
			return ESearchType.MOVIE;
		} else if (searchResultsType === ESearchResultsType.SHOWS) {
			return ESearchType.SHOW;
		} else {
			return ESearchType.PERSON;
		}
	};

	useEffect(() => {
		if (searchedMovies && searchedShows && searchedPeople) {
			if (!searchedMovies.results.length && searchedShows.results.length) {
				setSearchResultsType(ESearchResultsType.SHOWS);
			} else if (
				!searchedMovies.results.length &&
				!searchedShows.results.length &&
				searchedPeople.results.length
			) {
				setSearchResultsType(ESearchResultsType.PEOPLE);
			}
		}
	}, [searchedMovies, searchedShows, searchedPeople]);

	useEffect(() => {
		if (!router.query.q?.length) {
			router.replace('/');
		}
	}, [router]);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{searchedMovies && searchedShows && searchedPeople && (
				<>
					<SearchBar />
					<section className='border border-black'>
						<div>
							<h3>Search Results</h3>
						</div>
						<ul>
							<li className='flex items-center w-[15%] justify-between'>
								<h4
									className='cursor-pointer'
									onClick={() =>
										setSearchResultsType(ESearchResultsType.MOVIES)
									}
									style={{
										borderBottom:
											searchResultsType === ESearchResultsType.MOVIES
												? '1px solid black'
												: undefined,
									}}
								>
									Movies
								</h4>
								<p>{searchedMovies.total_results}</p>
							</li>
							<li className='flex items-center w-[15%] justify-between'>
								<h4
									className='cursor-pointer'
									onClick={() => setSearchResultsType(ESearchResultsType.SHOWS)}
									style={{
										borderBottom:
											searchResultsType === ESearchResultsType.SHOWS
												? '1px solid black'
												: undefined,
									}}
								>
									Shows
								</h4>
								<p>{searchedShows.total_results}</p>
							</li>
							<li className='flex items-center w-[15%] justify-between'>
								<h4
									className='cursor-pointer'
									onClick={() =>
										setSearchResultsType(ESearchResultsType.PEOPLE)
									}
									style={{
										borderBottom:
											searchResultsType === ESearchResultsType.PEOPLE
												? '1px solid black'
												: undefined,
									}}
								>
									People
								</h4>
								<p>{searchedPeople.total_results}</p>
							</li>
						</ul>
					</section>
					<section>
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
					</section>
				</>
			)}
		</div>
	);
};

export default Search;
