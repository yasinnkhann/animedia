import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { Circles } from 'react-loading-icons';
import Pagination from 'components/Pagination';
import SearchBar from '../components/Search/SearchBar';
import SearchResult from '../components/Search/SearchResult';
import * as Queries from '../graphql/queries';
import { useRouter } from 'next/router';
import { EContent } from '@ts/enums';
import { RESULTS_PER_PAGE } from '../utils/constants';
import type { NextPage } from 'next';
import { useQuery } from '@apollo/client';
import { UserMovie, UserShow } from 'graphql/generated/code-gen/graphql';
import _ from 'lodash';

const Search: NextPage = () => {
	const router = useRouter();

	const [currPage, setCurrPage] = useState(1);

	const searchBarRef = useRef<HTMLInputElement>(null);

	const [searchResultsType, setSearchResultsType] = useState<EContent>(
		EContent.MOVIES
	);

	const [userMatchedMedias, setUserMatchedMedias] = useState<
		UserShow[] | UserMovie[]
	>([]);

	const { data: searchedMoviesData, loading: searchedMoviesLoading } = useQuery(
		Queries.SEARCHED_MOVIES,
		{
			variables: {
				q: (router.query.q as string) ?? '',
				page: currPage,
			},
		}
	);

	const { data: searchedShowsData, loading: searchedShowsLoading } = useQuery(
		Queries.SEARCHED_SHOWS,
		{
			variables: {
				q: (router.query.q as string) ?? '',
				page: currPage,
			},
		}
	);

	const { data: searchedPeopleData, loading: searchedPeopleLoading } = useQuery(
		Queries.SEARCHED_PEOPLE,
		{
			variables: {
				q: (router.query.q as string) ?? '',
				page: currPage,
			},
		}
	);

	const { data: usersShowsData, loading: usersShowsLoading } = useQuery(
		Queries.GET_USERS_SHOWS,
		{
			skip: searchResultsType !== EContent.SHOWS,
			fetchPolicy: 'network-only',
		}
	);

	const { data: usersMoviesData, loading: usersMoviesLoading } = useQuery(
		Queries.GET_USERS_MOVIES,
		{
			skip: searchResultsType !== EContent.MOVIES,
			fetchPolicy: 'network-only',
		}
	);

	const getSearchedTypeData = useCallback(() => {
		if (searchResultsType === EContent.MOVIES) {
			return searchedMoviesData?.searchedMovies;
		}

		if (searchResultsType === EContent.SHOWS) {
			return searchedShowsData?.searchedShows;
		}

		if (searchResultsType === EContent.PEOPLE) {
			return searchedPeopleData?.searchedPeople;
		}
	}, [
		searchResultsType,
		searchedMoviesData?.searchedMovies,
		searchedPeopleData?.searchedPeople,
		searchedShowsData?.searchedShows,
	]);

	const getSearchResultType = () => {
		if (searchResultsType === EContent.MOVIES) {
			return EContent.MOVIE;
		} else if (searchResultsType === EContent.SHOWS) {
			return EContent.SHOW;
		} else {
			return EContent.PERSON;
		}
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToTop();
	}, [currPage]);

	useEffect(() => {
		if (router.query.page) {
			setCurrPage(+(router.query.page as string));
		}
	}, [router]);

	useEffect(() => {
		if (
			searchedMoviesData?.searchedMovies &&
			searchedShowsData?.searchedShows &&
			searchedPeopleData?.searchedPeople
		) {
			if (
				_.isEmpty(searchedMoviesData.searchedMovies.results) &&
				!_.isEmpty(searchedShowsData.searchedShows.results)
			) {
				setSearchResultsType(EContent.SHOWS);
			} else if (
				_.isEmpty(searchedMoviesData.searchedMovies.results) &&
				_.isEmpty(searchedShowsData.searchedShows.results) &&
				!_.isEmpty(searchedPeopleData.searchedPeople.results)
			) {
				setSearchResultsType(EContent.PEOPLE);
			}

			if (searchBarRef.current) {
				searchBarRef.current.value = router.query.q as string;
			}
		}
	}, [
		router.query.q,
		router.query.page,
		searchedMoviesData?.searchedMovies,
		searchedShowsData?.searchedShows,
		searchedPeopleData?.searchedPeople,
	]);

	useEffect(() => {
		const matchedMedias: UserShow[] | UserMovie[] = [];

		const usersMediaMap: Map<string, UserShow | UserMovie> = new Map();

		const userDataArr =
			searchResultsType === EContent.MOVIES
				? usersMoviesData?.usersMovies
				: searchResultsType === EContent.SHOWS
				? usersShowsData?.usersShows
				: null;

		if (!userDataArr || !getSearchedTypeData()?.results) return;

		for (const userDataObj of userDataArr) {
			if (userDataObj?.id) {
				usersMediaMap.set(userDataObj.id, userDataObj);
			}
		}
		for (const item of getSearchedTypeData()!.results) {
			if (usersMediaMap.has(String(item.id))) {
				matchedMedias.push(usersMediaMap.get(String(item.id)) as any);
			}
		}

		setUserMatchedMedias(matchedMedias);
	}, [
		usersShowsData?.usersShows,
		usersMoviesData?.usersMovies,
		searchResultsType,
		getSearchedTypeData,
	]);
	if (searchedMoviesLoading || searchedShowsLoading || searchedPeopleLoading) {
		return (
			<section className='flex h-screen items-center justify-center'>
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
				{searchedMoviesData?.searchedMovies &&
					searchedShowsData?.searchedShows &&
					searchedPeopleData?.searchedPeople && (
						<>
							<SearchBar ref={searchBarRef} />
							<section className='grid grid-cols-[20%_80%]'>
								<section className='m-4 flex flex-col items-center rounded-lg border px-8'>
									<div className='mb-4 w-full'>
										<h3>Search Results</h3>
									</div>
									<ul className='w-full'>
										<li className='flex w-full items-center justify-between'>
											<h4
												className='cursor-pointer text-left'
												onClick={() => setSearchResultsType(EContent.MOVIES)}
												style={{
													borderBottom:
														searchResultsType === EContent.MOVIES
															? '1px solid black'
															: undefined,
												}}
											>
												Movies
											</h4>
											<p className='text-right'>
												{searchedMoviesData.searchedMovies.total_results}
											</p>
										</li>
										<li className='flex w-full items-center justify-between'>
											<h4
												className='cursor-pointer text-left'
												onClick={() => setSearchResultsType(EContent.SHOWS)}
												style={{
													borderBottom:
														searchResultsType === EContent.SHOWS
															? '1px solid black'
															: undefined,
												}}
											>
												Shows
											</h4>
											<p className='text-right'>
												{searchedShowsData.searchedShows.total_results}
											</p>
										</li>
										<li className='flex w-full items-center justify-between'>
											<h4
												className='cursor-pointer text-left'
												onClick={() => setSearchResultsType(EContent.PEOPLE)}
												style={{
													borderBottom:
														searchResultsType === EContent.PEOPLE
															? '1px solid black'
															: undefined,
												}}
											>
												People
											</h4>
											<p className='text-right'>
												{searchedPeopleData.searchedPeople.total_results}
											</p>
										</li>
									</ul>
								</section>
								<section>
									{!_.isEmpty(getSearchedTypeData()?.results) ? (
										getSearchedTypeData()?.results.map(result => (
											<SearchResult
												key={result.id}
												result={result}
												searchedResultType={getSearchResultType()}
												userMatchedMedias={userMatchedMedias}
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
									searchResultsType === EContent.MOVIES
										? searchedMoviesData.searchedMovies.total_results
										: searchResultsType === EContent.SHOWS
										? searchedShowsData.searchedShows.total_results
										: searchedPeopleData.searchedPeople.total_results
								}
								itemsPerPage={RESULTS_PER_PAGE}
								paginate={(pageNum: number) =>
									router.push(
										`${router.pathname}?q=${router.query.q}&page=${pageNum}`
									)
								}
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
