import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Circles } from 'react-loading-icons';
import Pagination from 'components/Pagination';
import SearchBar from '../components/UI/SearchUI/SearchBar';
import SearchResult from '../components/UI/SearchUI/SearchResult';
import * as Queries from '../graphql/queries';
import { useRouter } from 'next/router';
import { useGQLQuery } from '../hooks/useGQL';
import { IUseGQLQuery } from '@ts/interfaces';
import { ESearchResultsType, ESearchType } from '@ts/enums';
import { RESULTS_PER_PAGE } from '../utils/specificVals';
import type { NextPage } from 'next';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../graphql/generated/nexus-typegen';

const Search: NextPage = () => {
	const router = useRouter();
	// console.log(router);

	const [currPage, setCurrPage] = useState(1);

	const searchBarRef = useRef<HTMLInputElement>(null);

	const [searchResultsType, setSearchResultsType] =
		useState<ESearchResultsType>(ESearchResultsType.MOVIES);

	const {
		data: searchedMovies,
		loading: searchedMoviesLoading,
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

	// useEffect(() => {
	// 	if (router.query.page) {
	// 		setCurrPage(+(router.query.page as string));
	// 	}
	// }, [router]);

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

			if (searchBarRef.current) {
				// if (router.query.page) {
				// 	const endIdx = (router.query.q as string).indexOf('?page=');
				// 	console.log('END IDX: ', endIdx);
				// 	searchBarRef.current.value = (router.query.q as string).slice(
				// 		0,
				// 		endIdx
				// 	);
				// } else {
				searchBarRef.current.value = router.query.q as string;
				// }
			}
		}
	}, [
		searchedMovies,
		searchedShows,
		searchedPeople,
		router.query.q,
		router.query.page,
	]);

	if (searchedMoviesLoading || searchedShowsLoading || searchedPeopleLoading) {
		return (
			<section className='flex justify-center items-center h-screen'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>{`${router.query.q} - Search Results`}</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				{searchedMovies && searchedShows && searchedPeople && (
					<>
						<SearchBar ref={searchBarRef} />
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
							// paginate={(pageNum: number) =>
							// 	router.push(
							// 		`${router.pathname}?q=${router.query.q}?page=${pageNum}`
							// 	)
							// }
							siblingCount={1}
							maxPageNum={500}
						/>
					</>
				)}
			</main>
		</>
	);
};

export default Search;
