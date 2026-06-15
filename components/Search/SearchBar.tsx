'use client';

import { forwardRef, useState, useEffect, RefObject, useRef } from 'react';
import { motion } from 'framer-motion';
import { CommonMethods } from '@utils/CommonMethods';
import { TDropDownSearchResult } from '@ts/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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

    interface TGroupedResults {
      movies: TDropDownSearchResult[];
      shows: TDropDownSearchResult[];
      games: TDropDownSearchResult[];
      people: TDropDownSearchResult[];
    }

    const [dropDownSearchResults, setDropDownSearchResults] = useState<TGroupedResults | null>(
      null
    );

    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearchQuery = useDebounceValue(searchQuery, 400);

    useEffect(() => {
      if (_.isEmpty(debouncedSearchQuery)) {
        setDropDownSearchResults(null);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const controller = new AbortController();
      const signal = controller.signal;

      globalSearchAction(debouncedSearchQuery)
        .then(data => {
          if (signal.aborted) return;

          let groupedResults: TGroupedResults = { movies: [], shows: [], games: [], people: [] };
          if (data) {
            groupedResults.movies = _.uniqBy(data.movies, 'title')
              .map((movie: any) => ({
                id: movie.id,
                titleName: movie.title,
                releaseDate: movie.release_date,
                imagePath: movie.poster_path,
                type: 'movie' as const,
              }))
              .slice(0, 3);

            groupedResults.shows = _.uniqBy(data.shows, 'name')
              .map((show: any) => ({
                id: show.id,
                titleName: show.name,
                firstAirDate: show.first_air_date,
                imagePath: show.poster_path,
                type: 'show' as const,
              }))
              .slice(0, 3);

            groupedResults.people = _.uniqBy(data.people, 'name')
              .map((person: any) => ({
                id: person.id,
                titleName: person.name,
                knownForDepartment: person.known_for_department,
                imagePath: person.profile_path,
                type: 'person' as const,
              }))
              .slice(0, 3);

            groupedResults.games = _.uniqBy(data.games, 'name')
              .map((game: any) => ({
                id: game.id,
                titleName: game.name,
                releaseDate: game.first_release_date
                  ? new Date(game.first_release_date * 1000).toISOString()
                  : undefined,
                imagePath: game.cover?.image_id,
                type: 'game' as const,
              }))
              .slice(0, 3);
          }
          setDropDownSearchResults(groupedResults);
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

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
      if (isSearchBtnClicked) {
        (ref as RefObject<HTMLInputElement>).current?.focus();
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (dropDownSearchResults && e.key === 'Escape') {
          setDropDownSearchResults(null);
          (ref as RefObject<HTMLInputElement>).current?.blur();
        }
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
          if (dropDownSearchResults) {
            setDropDownSearchResults(null);
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isSearchBtnClicked, ref, dropDownSearchResults]);

    return (
      <form
        ref={formRef}
        className='relative z-50 flex w-full flex-col items-center justify-center'
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
              setDropDownSearchResults(null);
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

        {dropDownSearchResults &&
          (dropDownSearchResults.movies.length > 0 ||
            dropDownSearchResults.shows.length > 0 ||
            dropDownSearchResults.games.length > 0 ||
            dropDownSearchResults.people.length > 0) && (
            <motion.div
              className='absolute left-0 right-0 top-[4rem] z-50 mx-auto max-h-[28rem] w-[calc(100%-2rem)] overflow-y-auto rounded-md border border-border bg-background p-4 shadow-xl transition-all duration-300'
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
              {[
                { title: 'Movies', results: dropDownSearchResults.movies },
                { title: 'Shows', results: dropDownSearchResults.shows },
                { title: 'Games', results: dropDownSearchResults.games },
                { title: 'People', results: dropDownSearchResults.people },
              ].map(
                section =>
                  section.results.length > 0 && (
                    <div key={section.title} className='mb-4 last:mb-0'>
                      <h4 className='mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                        {section.title}
                      </h4>
                      {section.results.map(result => (
                        <motion.div
                          key={result.id}
                          className='mb-1 flex cursor-pointer items-center gap-3 rounded-md p-2 transition-all duration-300 hover:bg-muted'
                          onClick={() => handleDropdownResultsClick(result)}
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: {
                              opacity: 1,
                              x: 0,
                              transition: { duration: 0.2 },
                            },
                          }}
                        >
                          <div className='relative h-[45px] w-[30px] flex-shrink-0 overflow-hidden rounded'>
                            <Image
                              src={
                                result.type === 'game'
                                  ? result.imagePath
                                    ? `https://images.igdb.com/igdb/image/upload/t_cover_small/${result.imagePath}.jpg`
                                    : CommonMethods.getIgdbImage(undefined)
                                  : CommonMethods.getTheMovieDbImage(result.imagePath)
                              }
                              alt={result.titleName!}
                              fill
                              className='object-cover'
                              sizes='30px'
                            />
                          </div>

                          <div className='flex flex-grow flex-col overflow-hidden'>
                            <span className='truncate text-sm font-medium text-foreground'>
                              {result.titleName}
                            </span>
                            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                              <span
                                className={`rounded px-1.5 py-0.5 text-[0.65rem] font-bold ${
                                  result.type === 'movie'
                                    ? 'bg-blue-500/20 text-blue-500'
                                    : result.type === 'show'
                                      ? 'bg-purple-500/20 text-purple-500'
                                      : result.type === 'game'
                                        ? 'bg-green-500/20 text-green-500'
                                        : 'bg-orange-500/20 text-orange-500'
                                }`}
                              >
                                {CommonMethods.toTitleCase(result.type!)}
                              </span>
                              <span>
                                {result.releaseDate || result.firstAirDate
                                  ? new Date(
                                      result.releaseDate ?? result.firstAirDate!
                                    ).getFullYear()
                                  : result.knownForDepartment}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )
              )}
            </motion.div>
          )}
      </form>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
