'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import SearchBar from '@components/Search/SearchBar';
import MediaCard from '@/components/MediaCard/MediaCard';
import MediaCardSkeleton from '@/components/Skeletons/MediaCardSkeleton';
import { CommonMethods } from '@/utils/CommonMethods';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';

import { useRouter, useSearchParams } from 'next/navigation';
import { TSearchResults } from '@ts/types';

import _ from 'lodash';
import { useUserMedia } from '@/components/UserMediaProvider';
import type { Movie, Show, Game } from '@prisma/client';

interface Props {
  searchedMoviesData: any;
  searchedShowsData: any;
  searchedPeopleData: any;
  searchedGamesData: any;
  fetchNextPageMovies?: (page: number) => Promise<any>;
  fetchNextPageShows?: (page: number) => Promise<any>;
  fetchNextPagePeople?: (page: number) => Promise<any>;
  fetchNextPageGames?: (page: number) => Promise<any>;
}

export default function SearchClient({
  searchedMoviesData,
  searchedShowsData,
  searchedPeopleData,
  searchedGamesData,
  fetchNextPageMovies,
  fetchNextPageShows,
  fetchNextPagePeople,
  fetchNextPageGames,
}: Props) {
  const searchParams = useSearchParams();
  const searchBarRef = useRef<HTMLInputElement>(null);

  const q = searchParams.get('q') ?? '';

  const [manualCategory, setManualCategory] = useState<{
    q: string;
    category: TSearchResults | null;
  }>({ q, category: null });

  if (manualCategory.q !== q) {
    setManualCategory({ q, category: null });
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

  const moviesQuery = useInfiniteQuery({
    queryKey: ['search', 'movies', q],
    queryFn: ({ pageParam = 1 }) => fetchNextPageMovies?.(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage && lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialData: { pages: [searchedMoviesData?.searchedMovies], pageParams: [1] },
    enabled: !!fetchNextPageMovies,
  });

  const showsQuery = useInfiniteQuery({
    queryKey: ['search', 'shows', q],
    queryFn: ({ pageParam = 1 }) => fetchNextPageShows?.(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage && lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialData: { pages: [searchedShowsData?.searchedShows], pageParams: [1] },
    enabled: !!fetchNextPageShows,
  });

  const gamesQuery = useInfiniteQuery({
    queryKey: ['search', 'games', q],
    queryFn: ({ pageParam = 1 }) => fetchNextPageGames?.(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage && lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialData: { pages: [searchedGamesData?.searchedGames], pageParams: [1] },
    enabled: !!fetchNextPageGames,
  });

  const peopleQuery = useInfiniteQuery({
    queryKey: ['search', 'people', q],
    queryFn: ({ pageParam = 1 }) => fetchNextPagePeople?.(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage && lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialData: { pages: [searchedPeopleData?.searchedPeople], pageParams: [1] },
    enabled: !!fetchNextPagePeople,
  });

  const activeQuery = useMemo(() => {
    switch (searchResultsType) {
      case 'movies':
        return moviesQuery;
      case 'shows':
        return showsQuery;
      case 'games':
        return gamesQuery;
      case 'people':
        return peopleQuery;
      default:
        return moviesQuery;
    }
  }, [searchResultsType, moviesQuery, showsQuery, gamesQuery, peopleQuery]);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
      activeQuery.fetchNextPage();
    }
  }, [inView, activeQuery.hasNextPage, activeQuery.isFetchingNextPage, activeQuery]);

  const activeSearchPayload = useMemo(() => {
    const results = activeQuery.data?.pages.flatMap((page: any) => page?.results || []) || [];
    return { results };
  }, [activeQuery.data]);

  const { userMovies, userShows, userGames } = useUserMedia();

  const userMatchedMedias = useMemo(() => {
    const matchedMedias: Array<Movie | Show | Game> = [];

    const usersMediaMap: Map<string, Movie | Show | Game> = new Map();

    let userDataArr;

    if (searchResultsType === 'movies') {
      userDataArr = userMovies;
    } else if (searchResultsType === 'shows') {
      userDataArr = userShows;
    } else if (searchResultsType === 'games') {
      userDataArr = userGames;
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
  }, [activeSearchPayload, searchResultsType, userMovies, userShows, userGames]);

  useEffect(() => {
    const el = searchBarRef.current;
    if (el) {
      el.value = q;
    }
  }, [q]);

  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)] px-4 sm:px-10 lg:px-20'>
      {searchedMoviesData?.searchedMovies &&
        searchedShowsData?.searchedShows &&
        searchedPeopleData?.searchedPeople && (
          <>
            <div className='relative z-[999] mb-8'>
              <SearchBar ref={searchBarRef} />
            </div>
            <section className='flex flex-col gap-8 md:flex-row'>
              {/* Sidebar */}
              <aside className='w-full flex-shrink-0 md:w-64'>
                <div className='sticky top-[calc(var(--header-height-mobile)+2rem)] rounded-xl border border-border bg-card/50 p-6 shadow-lg backdrop-blur-md'>
                  <h3 className='mb-6 text-xl font-bold text-foreground'>Search Results</h3>
                  <ul className='flex flex-col gap-2'>
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
                    ].map(cat => {
                      const isActive = activeCategory === cat.id;
                      return (
                        <li
                          key={cat.id}
                          onClick={() => {
                            setManualCategory({ q, category: cat.id as TSearchResults });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
                            isActive
                              ? 'text-primary-foreground bg-primary shadow-md'
                              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                          }`}
                        >
                          <span>{cat.label}</span>
                          <span
                            className={`flex h-6 items-center justify-center rounded-full px-2.5 text-xs font-semibold ${
                              isActive
                                ? 'bg-primary-foreground/20 text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {cat.count}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </aside>

              {/* Main Results Grid */}
              <section className='flex-1'>
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                  {activeSearchPayload?.results.map((result: any, idx: number) => {
                    const mediaType = searchResultsType.replace(/s$/, '').toUpperCase() as any;
                    return (
                      <MediaCard
                        key={`${result.id}-${idx}`}
                        item={result}
                        mediaType={mediaType}
                        variant='responsive'
                        index={idx}
                        userStatus={CommonMethods.getUserStatusFromMedia(userMatchedMedias, result)}
                      />
                    );
                  })}

                  {activeQuery.isFetchingNextPage &&
                    Array.from({ length: 10 }).map((_, idx) => (
                      <MediaCardSkeleton key={`skeleton-${idx}`} />
                    ))}
                </div>

                <div className='my-8 flex justify-center'>
                  <div ref={ref} className='h-1 w-full'></div>
                </div>
              </section>
            </section>
          </>
        )}
    </main>
  );
}
