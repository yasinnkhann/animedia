import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { Circles } from 'react-loading-icons';
import Pagination from 'components/Pagination';
import SearchBar from '../components/Search/SearchBar';
import SearchResult from '../components/Search/SearchResult';
import * as Queries from '../graphql/queries';
import { useRouter } from 'next/router';
import { ExtractStrict, TContent } from '@ts/types';
import { RESULTS_PER_PAGE } from '../utils/constants';
import type { NextPage } from 'next';
import { useQuery } from '@apollo/client';
import { UserMovie, UserShow } from 'graphql/generated/code-gen/graphql';
import _ from 'lodash';

const Search: NextPage = () => {
	const router = useRouter();

	const [currPage, setCurrPage] = useState(1);

	const searchBarRef = useRef<HTMLInputElement>(null);

	const [searchResultsType, setSearchResultsType] =
		useState<ExtractStrict<TContent, 'movies' | 'shows' | 'people' | 'games'>>(
			'movies'
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

	const { data: searchedGamesData, loading: searchedGamesLoading } = useQuery(
		Queries.SEARCHED_GAMES,
		{
			variables: {
				q: (router.query.q as string) ?? '',
				limit: RESULTS_PER_PAGE,
				page: currPage,
			},
		}
	);

	const { data: usersShowsData } = useQuery(Queries.USERS_SHOWS, {
		skip: searchResultsType !== 'shows',
		fetchPolicy: 'network-only',
	});

	const { data: usersMoviesData } = useQuery(Queries.USERS_MOVIES, {
		skip: searchResultsType !== 'movies',
		fetchPolicy: 'network-only',
	});

	// const { data: usersGamesData } = useQuery(Queries.USERS_GAMES, {
	// 	skip: searchResultsType !== 'games',
	// 	fetchPolicy: 'network-only',
	// });

	const getSearchedTypeData = useCallback(() => {
		if (searchResultsType === 'movies' && searchedMoviesData?.searchedMovies) {
			return searchedMoviesData.searchedMovies;
		}

		if (searchResultsType === 'shows' && searchedShowsData?.searchedShows) {
			return searchedShowsData.searchedShows;
		}

		if (searchResultsType === 'people' && searchedPeopleData?.searchedPeople) {
			return searchedPeopleData.searchedPeople;
		}

		if (searchResultsType === 'games' && searchedGamesData?.searchedGames) {
			return searchedGamesData.searchedGames;
		}
	}, [
		searchResultsType,
		searchedGamesData?.searchedGames,
		searchedMoviesData?.searchedMovies,
		searchedPeopleData?.searchedPeople,
		searchedShowsData?.searchedShows,
	]);

	const getSearchResultType = () => {
		if (searchResultsType === 'movies') {
			return 'movie';
		}
		if (searchResultsType === 'shows') {
			return 'show';
		}

		if (searchResultsType === 'games') {
			return 'game';
		}

		return 'person';
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
			searchedGamesData?.searchedGames &&
			searchedPeopleData?.searchedPeople
		) {
			if (
				_.isEmpty(searchedMoviesData.searchedMovies.results) &&
				!_.isEmpty(searchedShowsData.searchedShows.results)
			) {
				setSearchResultsType('shows');
			} else if (
				_.isEmpty(searchedMoviesData.searchedMovies.results) &&
				_.isEmpty(searchedShowsData.searchedShows.results) &&
				!_.isEmpty(searchedGamesData.searchedGames.results)
			) {
				setSearchResultsType('games');
			} else if (
				_.isEmpty(searchedMoviesData.searchedMovies.results) &&
				_.isEmpty(searchedShowsData.searchedShows.results) &&
				_.isEmpty(searchedGamesData.searchedGames.results) &&
				!_.isEmpty(searchedPeopleData.searchedPeople.results)
			) {
				setSearchResultsType('people');
			}

			if (searchBarRef.current) {
				searchBarRef.current.value = router.query.q as string;
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		router.query.q,
		router.query.page,
		searchedMoviesData?.searchedMovies,
		searchedShowsData?.searchedShows,
		searchedGamesData?.searchedGames,
		searchedPeopleData?.searchedPeople,
		searchBarRef.current,
	]);

	useEffect(() => {
		const matchedMedias: UserShow[] | UserMovie[] = [];

		const usersMediaMap: Map<string, UserShow | UserMovie> = new Map();

		let userDataArr;

		if (searchResultsType === 'movies' && usersMoviesData?.usersMovies) {
			userDataArr = usersMoviesData.usersMovies;
		} else if (searchResultsType === 'shows' && usersShowsData?.usersShows) {
			userDataArr = usersShowsData.usersShows;
		}

		userDataArr = userDataArr ?? [];

		if (!getSearchedTypeData()) return;

		for (const userDataObj of userDataArr) {
			if (userDataObj?.id) {
				usersMediaMap.set(userDataObj.id, userDataObj);
			}
		}

		for (const item of getSearchedTypeData()!.results) {
			if (usersMediaMap.has(item.id)) {
				matchedMedias.push(usersMediaMap.get(item.id) as any);
			}
		}

		setUserMatchedMedias(matchedMedias);
	}, [
		usersMoviesData?.usersMovies,
		usersShowsData?.usersShows,
		// usersGamesData?.usersGames,
		searchResultsType,
		getSearchedTypeData,
	]);
	if (
		searchedMoviesLoading ||
		searchedShowsLoading ||
		searchedPeopleLoading ||
		searchedGamesLoading
	) {
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
												onClick={() => setSearchResultsType('movies')}
												style={{
													borderBottom:
														searchResultsType === 'movies'
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
												onClick={() => setSearchResultsType('shows')}
												style={{
													borderBottom:
														searchResultsType === 'shows'
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
												onClick={() => setSearchResultsType('games')}
												style={{
													borderBottom:
														searchResultsType === 'games'
															? '1px solid black'
															: undefined,
												}}
											>
												Games
											</h4>
											<p className='text-right'>
												{searchedGamesData?.searchedGames.total_results ?? 0}
											</p>
										</li>
										<li className='flex w-full items-center justify-between'>
											<h4
												className='cursor-pointer text-left'
												onClick={() => setSearchResultsType('people')}
												style={{
													borderBottom:
														searchResultsType === 'people'
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
									searchResultsType === 'movies'
										? searchedMoviesData.searchedMovies.total_results
										: searchResultsType === 'shows'
											? searchedShowsData.searchedShows.total_results
											: searchResultsType === 'people'
												? searchedPeopleData.searchedPeople.total_results
												: searchedGamesData?.searchedGames.total_results!
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
