import { forwardRef, useState, useEffect, RefObject } from 'react';
import { CommonMethods } from 'utils/CommonMethods';
import { EContent } from '@ts/enums';
import { useRouter } from 'next/router';
import { FaSearch } from 'react-icons/fa';
import { useDebounce } from 'hooks/useDebounce';
import { useQuery } from '@apollo/client';
import * as Queries from '../../../graphql/queries';
import _ from 'lodash';

interface Props {
	closeSearch?: () => void;
	isSearchBtnClicked?: boolean;
}

const SearchBar = forwardRef<HTMLInputElement, Props>(
	({ closeSearch, isSearchBtnClicked }, ref) => {
		const router = useRouter();

		const [searchQuery, setSearchQuery] = useState('');

		const [searchResults, setSearchResults] = useState<any[]>([]);

		const { data: searchedMoviesData, loading: searchedMoviesLoading } =
			useQuery(Queries.SEARCHED_MOVIES, {
				variables: {
					q: searchQuery,
				},
				// skip: _.isEmpty(searchQuery),
			});

		const { data: searchedShowsData, loading: searchedShowsLoading } = useQuery(
			Queries.SEARCHED_SHOWS,
			{
				variables: {
					q: searchQuery,
				},
				// skip: _.isEmpty(searchQuery),
			}
		);

		const { data: searchedPeopleData, loading: searchedPeopleLoading } =
			useQuery(Queries.SEARCHED_PEOPLE, {
				variables: {
					q: searchQuery,
				},
				// skip: _.isEmpty(searchQuery),
			});

		useDebounce(
			() => {
				if (
					searchedMoviesData?.searchedMovies &&
					searchedShowsData?.searchedShows &&
					searchedPeopleData?.searchedPeople
				) {
					const movieResults = searchedMoviesData.searchedMovies.results.map(
						movie => ({ id: movie.id, movieTitle: movie.title })
					);
					const showsResults = searchedShowsData.searchedShows.results.map(
						show => ({ id: show.id, showName: show.name })
					);
					const peopleResults = searchedPeopleData.searchedPeople.results.map(
						person => ({ id: person.id, personName: person.name })
					);
					setSearchResults([
						...movieResults,
						...showsResults,
						...peopleResults,
					]);
				}
			},
			3000,
			[
				searchQuery,
				searchedMoviesData?.searchedMovies,
				searchedShowsData?.searchedShows,
				searchedPeopleData?.searchedPeople,
			]
		);

		const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			if (closeSearch) closeSearch();

			if (searchQuery.trim().length === 0) return;

			router.push(`/search?q=${searchQuery.trim().split(' ').join('+')}`);
		};

		useEffect(() => {
			if (isSearchBtnClicked) {
				(ref as RefObject<HTMLButtonElement>).current?.focus();
			}
		}, [isSearchBtnClicked, ref]);

		console.log(searchResults);

		return (
			<form
				className='relative flex w-full flex-col items-center justify-center'
				onSubmit={handleSubmit}
			>
				<input
					className='w-[calc(100%-2rem)] rounded-md border-none bg-gray-300 py-4 pl-12 pr-4 text-base text-gray-700 transition duration-300 focus:border-0 focus:shadow-[0_1px_12px_#5272a2] focus:outline-none'
					type='text'
					placeholder='Search for a movie, tv show, or person...'
					ref={ref}
					onChange={e => setSearchQuery(e.target.value)}
				/>
				<button
					className='absolute left-[calc(100%-3.5rem)] top-3.5 z-10 border-none bg-transparent text-[1.5rem] text-gray-700 transition-all focus:text-black focus:outline-none hover:scale-125 hover:cursor-pointer hover:text-black'
					type='submit'
				>
					<FaSearch />
				</button>
				{!_.isEmpty(searchQuery) && (
					<div className='max-h-52 w-[calc(100%-2rem)] overflow-y-auto rounded-md bg-gray-700 bg-opacity-80 p-4 shadow-md transition-all duration-300'>
						{!_.isEmpty(searchResults) ? (
							searchResults.map(result => (
								<div
									key={result.id}
									className='mb-2 rounded-md p-2 transition-all duration-300 hover:bg-gray-600'
								>
									<span className='text-white'>
										{result.movieTitle || result.showName || result.personName}{' '}
										||{' '}
									</span>
									<span className='text-sm text-gray-300'>
										{result.movieTitle
											? CommonMethods.toTitleCase(EContent.MOVIE)
											: result.showName
											? CommonMethods.toTitleCase(EContent.SHOW)
											: CommonMethods.toTitleCase(EContent.PERSON)}
									</span>
								</div>
							))
						) : (
							<span className='text-sm text-gray-300'>No results</span>
						)}
					</div>
				)}
			</form>
		);
	}
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
