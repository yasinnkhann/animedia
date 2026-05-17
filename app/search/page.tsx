'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { Circles } from 'react-loading-icons';
import Pagination from 'components/Pagination';
import SearchBar from '@/components/Search/SearchBar';
import SearchResult from '@/components/Search/SearchResult';
import * as Queries from '@/graphql/queries';
import { useRouter, useSearchParams } from 'next/navigation';
import { TSearchResults } from '@ts/types';
import { RESULTS_PER_PAGE } from '@/utils/constants';
import { useQuery } from '@apollo/client/react';
import { UserGame, UserMovie, UserShow } from 'graphql/generated/code-gen/graphql';
import _ from 'lodash';

export default function Search() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const searchBarRef = useRef<HTMLInputElement>(null);

	const q = searchParams.get('q') ?? '';
	const page = searchParams.get('page') ?? '1';
	const currPage = Math.max(1, Number.parseInt(page, 10) || 1);

	const paginateSearch = (pageNum: number) => {
		router.push(`/search?q=${encodeURIComponent(q)}&page=${pageNum}`);
	};

	const { data: searchedMoviesData, loading: searchedMoviesLoading } = useQuery(
		Queries.SEARCHED_MOVIES,
		{
			variables: {
				q,
				page: parseInt(page),
			},
		}
	);

	const { data: searchedShowsData, loading: searchedShowsLoading } = useQuery(
		Queries.SEARCHED_SHOWS,
		{
			variables: {
				q,
				page: parseInt(page),
			},
		}
	);

	const { data: searchedPeopleData, loading: searchedPeopleLoading } = useQuery(
		Queries.SEARCHED_PEOPLE,
		{
			variables: {
				q,
				page: parseInt(page),
			},
		}
	);

	const { data: searchedGamesData, loading: searchedGamesLoading } = useQuery(
		Queries.SEARCHED_GAMES,
		{
			variables: {
				q,
				limit: RESULTS_PER_PAGE,
				page: parseInt(page),
			},
		}
	);

	const [manualCategory, setManualCategory] = useState<{
		q: string;
		page: string;
		category: TSearchResults | null;
	}>({ q, page, category: null });

	if (manualCategory.q !== q || manualCategory.page !== page) {
		setManualCategory({ q, page, category: null });
	}

	const activeCategory = useMemo<TSearchResults>(() => {
		if (manualCategory.category) return manualCategory.category;

		if (
			searchedMoviesData?.searchedMovies &&
			searchedShowsData?.searchedShows &&
			searchedGamesData?.searchedGames &&
			searchedPeopleData?.searchedPeople
		) {
			if (!_.isEmpty(searchedMoviesData.searchedMovies.results)) {
				return 'movies';
			} else if (!_.isEmpty(searchedShowsData.searchedShows.results)) {
				return 'shows';
			} else if (!_.isEmpty(searchedGamesData.searchedGames.results)) {
				return 'games';
			} else if (!_.isEmpty(searchedPeopleData.searchedPeople.results)) {
				return 'people';
			}
		}

		return 'movies';
	}, [
		manualCategory.category,
		searchedMoviesData,
		searchedShowsData,
		searchedGamesData,
		searchedPeopleData,
	]);

	const searchResultsType = activeCategory;

	const { data: usersShowsData } = useQuery(Queries.USERS_SHOWS, {
		skip: searchResultsType !== 'shows',
		fetchPolicy: 'network-only',
	});

	const { data: usersMoviesData } = useQuery(Queries.USERS_MOVIES, {
		skip: searchResultsType !== 'movies',
		fetchPolicy: 'network-only',
	});

	const { data: usersGamesData } = useQuery(Queries.USERS_GAMES, {
		skip: searchResultsType !== 'games',
		fetchPolicy: 'network-only',
	});

	const activeSearchPayload = useMemo(() => {
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
		searchedMoviesData,
		searchedShowsData,
		searchedPeopleData,
		searchedGamesData,
	]);

	const userMatchedMedias = useMemo(() => {
		const matchedMedias: Array<UserMovie | UserShow | UserGame> = [];

		const usersMediaMap: Map<string, UserMovie | UserShow | UserGame> = new Map();

		let userDataArr;

		if (searchResultsType === 'movies' && usersMoviesData?.usersMovies) {
			userDataArr = usersMoviesData.usersMovies;
		} else if (searchResultsType === 'shows' && usersShowsData?.usersShows) {
			userDataArr = usersShowsData.usersShows;
		} else if (searchResultsType === 'games' && usersGamesData?.usersGames) {
			userDataArr = usersGamesData.usersGames;
		}

		userDataArr = userDataArr ?? [];

		if (!activeSearchPayload?.results) {
			return matchedMedias;
		}

		for (const userDataObj of userDataArr) {
			if (userDataObj?.id) {
				usersMediaMap.set(userDataObj.id, userDataObj);
			}
		}

		for (const item of activeSearchPayload.results) {
			const matched = usersMediaMap.get(item.id);
			if (matched) {
				matchedMedias.push(matched);
			}
		}

		return matchedMedias;
	}, [activeSearchPayload, searchResultsType, usersMoviesData, usersShowsData, usersGamesData]);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToTop();
	}, [page]);

	useEffect(() => {
		const el = searchBarRef.current;
		if (el) {
			el.value = q;
		}
	}, [q]);

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
		<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{searchedMoviesData?.searchedMovies &&
				searchedShowsData?.searchedShows &&
				searchedPeopleData?.searchedPeople && (
					<>
						<SearchBar ref={searchBarRef} />
						<section className='grid grid-cols-[20%_80%]'>
							<section className='m-4 flex flex-col items-center'>
								<div className='mb-4 w-full'>
									<h3>Search Results</h3>
								</div>
								<ul className='w-full'>
									{[
										{
											id: 'movies',
											label: 'Movies',
											count: searchedMoviesData.searchedMovies.total_results,
										},
										{
											id: 'shows',
											label: 'Shows',
											count: searchedShowsData.searchedShows.total_results,
										},
										{
											id: 'games',
											label: 'Games',
											count: searchedGamesData?.searchedGames.total_results ?? 0,
										},
										{
											id: 'people',
											label: 'People',
											count: searchedPeopleData.searchedPeople.total_results,
										},
									].map(cat => (
										<li
											key={cat.id}
											onClick={() =>
												setManualCategory({ q, page, category: cat.id as TSearchResults })
											}
											className='flex w-full cursor-pointer items-center justify-between py-1'
										>
											<span className={`${activeCategory === cat.id ? 'underline' : ''}`}>
												{cat.label}
											</span>
											<span>{cat.count}</span>
										</li>
									))}
								</ul>
							</section>

							<section className='m-4'>
								{activeSearchPayload?.results.map(result => (
									<SearchResult
										key={result.id}
										result={result}
										searchedResultType={
											searchResultsType.replace(/s$/, '') as 'movie' | 'show' | 'game' | 'person'
										}
										userMatchedMedias={userMatchedMedias as UserMovie[] | UserShow[] | UserGame[]}
									/>
								))}
							</section>
						</section>
						<Pagination
							currPage={currPage}
							paginate={paginateSearch}
							totalItems={activeSearchPayload?.total_results ?? 0}
							itemsPerPage={RESULTS_PER_PAGE}
							siblingCount={1}
						/>
					</>
				)}
		</main>
	);
}
