import { forwardRef, useState, useEffect, RefObject } from 'react';
import { CommonMethods } from 'utils/CommonMethods';
import { TDropDownSearchResult } from '@ts/types';
import { useRouter } from 'next/router';
import { FaSearch } from 'react-icons/fa';
import { useDebounce } from 'hooks/useDebounce';
import { useQuery } from '@apollo/client';
import * as Queries from '../../graphql/queries';
import _ from 'lodash';
import { RESULTS_PER_PAGE } from 'utils/constants';

interface Props {
	closeSearch?: () => void;
	isSearchBtnClicked?: boolean;
}

const SearchBar = forwardRef<HTMLInputElement, Props>(
	({ closeSearch, isSearchBtnClicked }, ref) => {
		const router = useRouter();

		const [searchQuery, setSearchQuery] = useState('');

		const [dropDownSearchResults, setDropDownSearchResults] = useState<
			TDropDownSearchResult[]
		>([]);

		const { data: searchedMoviesData } = useQuery(Queries.SEARCHED_MOVIES, {
			variables: {
				q: searchQuery,
			},
			skip: _.isEmpty(searchQuery),
		});

		const { data: searchedShowsData } = useQuery(Queries.SEARCHED_SHOWS, {
			variables: {
				q: searchQuery,
			},
			skip: _.isEmpty(searchQuery),
		});

		const { data: searchedGamesData } = useQuery(Queries.SEARCHED_GAMES, {
			variables: {
				q: searchQuery,
				limit: RESULTS_PER_PAGE,
				page: 1,
			},
			skip: _.isEmpty(searchQuery),
		});

		const { data: searchedPeopleData } = useQuery(Queries.SEARCHED_PEOPLE, {
			variables: {
				q: searchQuery,
			},
			skip: _.isEmpty(searchQuery),
		});

		useDebounce(
			() => {
				let allResults: any[] = [];
				if (
					searchedMoviesData?.searchedMovies.results &&
					searchedShowsData?.searchedShows.results &&
					searchedGamesData?.searchedGames.results &&
					searchedPeopleData?.searchedPeople.results
				) {
					const movieResults = searchedMoviesData.searchedMovies.results
						.map(movie => ({
							id: movie.id,
							titleName: movie.title,
							releaseDate: movie.release_date,
							type: 'movie',
						}))
						.slice(0, 5);

					const showsResults = searchedShowsData.searchedShows.results
						.map(show => ({
							id: show.id,
							titleName: show.name,
							firstAirDate: show.first_air_date,
							type: 'show',
						}))
						.slice(0, 5);

					const peopleResults = searchedPeopleData.searchedPeople.results
						.map(person => ({
							id: person.id,
							titleName: person.name,
							knownForDepartment: person.known_for_department,
							type: 'person',
						}))
						.slice(0, 5);

					const gameResults = searchedGamesData.searchedGames.results
						.map(game => ({
							id: game.id,
							titleName: game.name,
							releaseDate: new Date(
								game.first_release_date * 1000
							).toISOString(),
							type: 'game',
						}))
						.slice(0, 5);

					allResults = [
						...movieResults,
						...showsResults,
						...gameResults,
						...peopleResults,
					];
				}
				setDropDownSearchResults(allResults as TDropDownSearchResult[]);
			},
			_.isEmpty(searchQuery) ? 0 : 2000,
			[
				searchQuery,
				searchedMoviesData?.searchedMovies,
				searchedShowsData?.searchedShows,
				searchedGamesData?.searchedGames,
				searchedPeopleData?.searchedPeople,
			]
		);

		const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			if (closeSearch) closeSearch();

			if (searchQuery.trim().length === 0) return;

			router.push(`/search?q=${searchQuery.trim().split(' ').join('+')}`);
		};

		const handleDropdownResultsClick = (result: TDropDownSearchResult) => {
			router.push(
				CommonMethods.getDetailsPageRoute(
					result.type!,
					result.id,
					result.titleName!
				)
			);
			if (closeSearch) closeSearch();
		};

		useEffect(() => {
			if (isSearchBtnClicked) {
				(ref as RefObject<HTMLButtonElement>).current?.focus();
			}

			const close = (e: KeyboardEvent) => {
				if (!_.isEmpty(dropDownSearchResults) && e.key === 'Escape') {
					setDropDownSearchResults([]);
					(ref as RefObject<HTMLButtonElement>).current?.blur();
				}
			};
			window.addEventListener('keydown', close);
			return () => window.removeEventListener('keydown', close);
		}, [isSearchBtnClicked, ref, dropDownSearchResults]);

		return (
			<form
				className='relative flex w-full flex-col items-center justify-center'
				onSubmit={handleSubmit}
			>
				<input
					className='w-[calc(100%-2rem)] rounded-md border-none bg-gray-300 py-4 pl-12 pr-4 text-base text-gray-700 transition duration-300 focus:border-0 focus:shadow-[0_1px_12px_#5272a2] focus:outline-none'
					type='text'
					placeholder='Search for a movie, tv show, game, or person...'
					ref={ref}
					onChange={e => setSearchQuery(e.target.value)}
				/>

				<button
					className='absolute left-[calc(100%-3.5rem)] top-3.5 z-10 border-none bg-transparent text-[1.5rem] text-gray-700 transition-all hover:scale-125 hover:cursor-pointer hover:text-black focus:text-black focus:outline-none'
					type='submit'
				>
					<FaSearch />
				</button>

				{!_.isEmpty(dropDownSearchResults) && (
					<div className='max-h-52 w-[calc(100%-2rem)] overflow-y-auto rounded-md bg-gray-700 bg-opacity-80 p-4 shadow-md transition-all duration-300'>
						{dropDownSearchResults.map(result => (
							<div
								key={result.id}
								className='mb-2 cursor-pointer rounded-md p-2 transition-all duration-300 hover:bg-gray-600'
								onClick={() => handleDropdownResultsClick(result)}
							>
								<span className='text-white'>{result.titleName} || </span>
								<span className='text-gray-300'>
									{' '}
									{CommonMethods.toTitleCase(result.type!)}
								</span>
								<span className='float-right text-white'>
									{CommonMethods.formatDate(
										result.releaseDate ??
											result.firstAirDate ??
											result.knownForDepartment
									)}
								</span>
							</div>
						))}
					</div>
				)}
			</form>
		);
	}
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
