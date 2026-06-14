'use client';

import { forwardRef, useState, useEffect, RefObject } from 'react';
import { motion } from 'framer-motion';
import { CommonMethods } from '@utils/CommonMethods';
import { TDropDownSearchResult } from '@ts/types';
import { useRouter } from 'next/navigation';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { useDebounceValue } from '@hooks/useDebounceValue';
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

    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearchQuery = useDebounceValue(searchQuery, 400);

    useEffect(() => {
      if (_.isEmpty(debouncedSearchQuery)) {
        setDropDownSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const controller = new AbortController();
      const signal = controller.signal;

      globalSearchAction(debouncedSearchQuery)
        .then(data => {
          if (signal.aborted) return;

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
          setIsSearching(false);
        })
        .catch(() => {
          if (!signal.aborted) setIsSearching(false);
        });

      return () => {
        controller.abort();
      };
    }, [debouncedSearchQuery]);

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
          className='w-[calc(100%-2rem)] rounded-md border-none bg-muted/50 py-4 pl-12 pr-4 text-base text-foreground transition duration-300 focus:border-0 focus:shadow-[0_1px_12px_#5272a2] focus:outline-none'
          type='text'
          placeholder='Search for a movie, tv show, game, or person...'
          ref={ref}
          onChange={e => {
            setSearchQuery(e.target.value);
            if (_.isEmpty(e.target.value)) {
              setDropDownSearchResults([]);
              setIsSearching(false);
            } else {
              setIsSearching(true);
            }
          }}
        />

        <button
          className='absolute left-[calc(100%-3.5rem)] top-3.5 z-10 border-none bg-transparent text-[1.5rem] text-muted-foreground transition-all hover:scale-125 hover:cursor-pointer hover:text-primary focus:text-primary focus:outline-none'
          type='submit'
        >
          {isSearching ? <FaSpinner className='animate-spin' /> : <FaSearch />}
        </button>

        {!_.isEmpty(dropDownSearchResults) && (
          <motion.div
            className='bg-popover max-h-52 w-[calc(100%-2rem)] overflow-y-auto rounded-md p-4 shadow-md transition-all duration-300'
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
                className='mb-2 cursor-pointer rounded-md p-2 transition-all duration-300 hover:bg-muted'
                onClick={() => handleDropdownResultsClick(result)}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.2 },
                  },
                }}
                whileHover={{ backgroundColor: 'hsl(var(--muted))' }}
              >
                <span className='text-foreground'>{result.titleName} || </span>
                <span className='text-muted-foreground'>
                  {' '}
                  {CommonMethods.toTitleCase(result.type!)}
                </span>
                <span className='float-right text-foreground'>
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
