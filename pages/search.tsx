import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGQLQuery } from '../hooks/useGQL';
import * as Queries from '../graphql/queries';
import SearchBar from '../components/UI/SearchUI/SearchBar';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../graphql/generated/nexus-typegen';
import SearchResult from '../components/UI/SearchUI/SearchResult';
import { IUseGQLQuery } from '@ts/interfaces';
import { ESearchResultsType, ESearchType } from '@ts/enums';
import Pagination from 'components/Pagination';
import { RESULTS_PER_PAGE } from '../utils/specificNums';

const Search: NextPage = () => {
	const router = useRouter();

	const [currPage, setCurrPage] = useState(1);

	const [searchResultsType, setSearchResultsType] =
		useState<ESearchResultsType>(ESearchResultsType.MOVIES);

	const {
		data: searchedMovies,
		loading: searchedMoviesLoading,
		error: searchedMoviesError,
		refetch: refetchSearchedMovies,
	}: IUseGQLQuery<
		NexusGenObjects['MoviesRes'],
		NexusGenArgTypes['Query']['searchedMovies']
	> = useGQLQuery<NexusGenArgTypes['Query']['searchedMovies']>(
		Queries.QUERY_SEARCHED_MOVIES,
		{
			variables: {
				q: (router.query.q as string) ?? '',
				page: currPage,
			},
		}
	);

	const {
		data: searchedShows,
		loading: searchedShowsLoading,
		error: searchedShowsError,
		refetch: refetchSearchedShows,
	}: IUseGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['searchedShows']
	> = useGQLQuery<NexusGenArgTypes['Query']['searchedShows']>(
		Queries.QUERY_SEARCHED_SHOWS,
		{
			variables: {
				q: (router.query.q as string) ?? '',
				page: currPage,
			},
		}
	);

	const {
		data: searchedPeople,
		loading: searchedPeopleLoading,
		error: searchedPeopleError,
		refetch: refetchSearchedPeople,
	}: IUseGQLQuery<
		NexusGenObjects['PeopleRes'],
		NexusGenArgTypes['Query']['searchedPeople']
	> = useGQLQuery<NexusGenArgTypes['Query']['searchedPeople']>(
		Queries.QUERY_SEARCHED_PEOPLE,
		{
			variables: {
				q: (router.query.q as string) ?? '',
				page: currPage,
			},
		}
	);

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

	const scrollToTop = () => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToTop();
	}, [currPage]);

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

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{searchedMovies && searchedShows && searchedPeople && (
				<>
					<SearchBar />
					<section className='grid grid-cols-[20%_80%]'>
						<section className='m-4 border rounded-lg flex flex-col items-center px-8'>
							<div className='w-full mb-4'>
								<h3>Search Results</h3>
							</div>
							<ul className='w-full'>
								<li className='flex items-center w-full justify-between'>
									<h4
										className='cursor-pointer text-left'
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
									<p className='text-right'>{searchedMovies.total_results}</p>
								</li>
								<li className='flex items-center w-full justify-between'>
									<h4
										className='cursor-pointer text-left'
										onClick={() =>
											setSearchResultsType(ESearchResultsType.SHOWS)
										}
										style={{
											borderBottom:
												searchResultsType === ESearchResultsType.SHOWS
													? '1px solid black'
													: undefined,
										}}
									>
										Shows
									</h4>
									<p className='text-right'>{searchedShows.total_results}</p>
								</li>
								<li className='flex items-center w-full justify-between'>
									<h4
										className='cursor-pointer text-left'
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
									<p className='text-right'>{searchedPeople.total_results}</p>
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
					</section>

					<Pagination
						currPage={currPage}
						totalItems={
							searchResultsType === ESearchResultsType.MOVIES
								? searchedMovies.total_results
								: searchResultsType === ESearchResultsType.SHOWS
								? searchedShows.total_results
								: searchedPeople.total_results
						}
						itemsPerPage={RESULTS_PER_PAGE}
						paginate={(pageNum: number) => setCurrPage(pageNum)}
						siblingCount={1}
						maxPageNum={500}
					/>
				</>
			)}
		</div>
	);
};

export default Search;
