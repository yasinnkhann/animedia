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

	const [_currSearchItems, setCurrSearchItems] = useState<any[]>([]);
	const [currPage, setCurrPage] = useState(1);
	const [searchItemsPerPage] = useState(RESULTS_PER_PAGE);

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
		// return components here
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

	const goToNextPage = () => {
		setCurrPage(currPage => currPage + 1);
	};

	const goToPrevPage = () => {
		setCurrPage(currPage => currPage - 1);
	};

	const getPaginationGroup = () => {
		let start =
			Math.floor((currPage - 1) / searchItemsPerPage) * searchItemsPerPage;
		return new Array(searchItemsPerPage)
			.fill(null)
			.map((_, idx) => start + idx + 1);
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
					<Pagination
						itemsPerPage={searchItemsPerPage}
						totalItems={
							searchResultsType === ESearchResultsType.MOVIES
								? searchedMovies.total_results
								: searchResultsType === ESearchResultsType.SHOWS
								? searchedShows.total_results
								: searchedPeople.total_results
						}
						currPage={currPage}
						pageNums={getPaginationGroup()}
						paginate={pageNum => setCurrPage(pageNum)}
						goToPrevPage={goToPrevPage}
						goToNextPage={goToNextPage}
					/>
				</>
			)}
		</div>
	);
};

export default Search;
