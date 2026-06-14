'use client';

import { forwardRef, useState, useEffect, RefObject } from 'react';
import { motion } from 'framer-motion';
import { CommonMethods } from '@utils/CommonMethods';
import { TDropDownSearchResult } from '@ts/types';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { useDebounce } from '@hooks/useDebounce';
import _ from 'lodash';
import { globalSearchAction } from '@/lib/actions/searchActions';

interface Props {
  closeSearch?: () => void;
  isSearchBtnClicked?: boolean;
}

const SearchBar = forwardRef<HTMLInputElement, Props>(
  ({ closeSearch, isSearchBtnClicked }, ref) => {
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');

    const [dropDownSearchResults, setDropDownSearchResults] = useState<TDropDownSearchResult[]>([]);

    useDebounce(
      () => {
        if (_.isEmpty(searchQuery)) {
          setDropDownSearchResults([]);
          return;
        }

        globalSearchAction(searchQuery).then(data => {
          let allResults: TDropDownSearchResult[] = [];
          if (data) {
            const movieResults = data.movies
              .map((movie: any) => ({
                id: movie.id,
                titleName: movie.title,
                releaseDate: movie.release_date,
                type: 'movie' as const,
              }))
              .slice(0, 5);

            const showsResults = data.shows
              .map((show: any) => ({
                id: show.id,
                titleName: show.name,
                firstAirDate: show.first_air_date,
                type: 'show' as const,
              }))
              .slice(0, 5);

            const peopleResults = data.people
              .map((person: any) => ({
                id: person.id,
                titleName: person.name,
                knownForDepartment: person.known_for_department,
                type: 'person' as const,
              }))
              .slice(0, 5);

            const gameResults = data.games
              .map((game: any) => ({
                id: game.id,
                titleName: game.name,
                releaseDate: game.first_release_date
                  ? new Date(game.first_release_date * 1000).toISOString()
                  : undefined,
                type: 'game' as const,
              }))
              .slice(0, 5);

            allResults = [...movieResults, ...showsResults, ...gameResults, ...peopleResults];
          }
          setDropDownSearchResults(allResults as TDropDownSearchResult[]);
        });
      },
      _.isEmpty(searchQuery) ? 0 : 2000,
      [searchQuery]
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (closeSearch) closeSearch();

      if (searchQuery.trim().length === 0) return;

      router.push(`/search?q=${searchQuery.trim().split(' ').join('+')}`);
    };

    const handleDropdownResultsClick = (result: TDropDownSearchResult) => {
      router.push(CommonMethods.getDetailsPageRoute(result.type!, result.id, result.titleName!));
      if (closeSearch) closeSearch();
    };

    useEffect(() => {
      if (isSearchBtnClicked) {
        (ref as RefObject<HTMLInputElement>).current?.focus();
      }

      const close = (e: KeyboardEvent) => {
        if (!_.isEmpty(dropDownSearchResults) && e.key === 'Escape') {
          setDropDownSearchResults([]);
          (ref as RefObject<HTMLInputElement>).current?.blur();
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
          <motion.div
            className='max-h-52 w-[calc(100%-2rem)] overflow-y-auto rounded-md bg-gray-700 bg-opacity-80 p-4 shadow-md transition-all duration-300'
            initial='hidden'
            animate='visible'
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.05,
                },
              },
            }}
          >
            {dropDownSearchResults.map(result => (
              <motion.div
                key={result.id}
                className='mb-2 cursor-pointer rounded-md p-2 transition-all duration-300 hover:bg-gray-600'
                onClick={() => handleDropdownResultsClick(result)}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.2 },
                  },
                }}
                whileHover={{ backgroundColor: 'rgba(75, 85, 99, 1)' }}
              >
                <span className='text-white'>{result.titleName} || </span>
                <span className='text-gray-300'> {CommonMethods.toTitleCase(result.type!)}</span>
                <span className='float-right text-white'>
                  {CommonMethods.formatDate(
                    result.releaseDate ?? result.firstAirDate ?? result.knownForDepartment
                  )}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </form>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
