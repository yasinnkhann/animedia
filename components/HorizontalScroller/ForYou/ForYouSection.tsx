'use client';

import { useState, useMemo } from 'react';
import ForYouScroller from './ForYouScroller';

interface Props {
  forYouData?: any[];
}

const ForYouSection = ({ forYouData }: Props) => {
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'show'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'newest' | 'rating'>('recommended');

  const filteredAndSortedData = useMemo(() => {
    let result = [...(forYouData || [])];

    // Filter by Type
    if (filterType !== 'all') {
      result = result.filter(item => {
        const isMovie = 'title' in item;
        return filterType === 'movie' ? isMovie : !isMovie;
      });
    }

    // Sort By
    if (sortBy === 'newest') {
      result.sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date || 0).getTime();
        const dateB = new Date(b.release_date || b.first_air_date || 0).getTime();
        return dateB - dateA; // Descending
      });
    } else if (sortBy === 'rating') {
      result.sort((a, b) => {
        return (b.vote_average ?? 0) - (a.vote_average ?? 0); // Descending
      });
    }
    // 'recommended' keeps the original shuffled/API order, no action needed

    return result.slice(0, 20); // Only display top 20 after filters are applied
  }, [forYouData, filterType, sortBy]);

  if (!forYouData || forYouData.length === 0) return null;

  return (
    <section className='mt-8'>
      <div className='mx-[3rem] flex flex-col justify-between md:flex-row md:items-end'>
        <div>
          <h1 className='text-xl sm:text-3xl'>Recommended For You</h1>
          <p className='mt-1 text-sm text-muted-foreground'>Based on what you&apos;re tracking</p>
        </div>

        {/* Filters & Sorting Controls */}
        <div className='mt-4 flex flex-wrap items-center gap-3 text-sm md:mt-0'>
          <div className='flex items-center gap-2 rounded-md bg-muted/50 p-1'>
            {['all', 'movie', 'show'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`rounded-sm px-3 py-1 capitalize transition-colors ${
                  filterType === type
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className='rounded-md border border-border bg-background px-3 py-1.5 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
          >
            <option value='recommended'>Recommended</option>
            <option value='newest'>Newest</option>
            <option value='rating'>Highest Rated</option>
          </select>
        </div>
      </div>

      <section className='mt-4'>
        {filteredAndSortedData.length > 0 ? (
          <ForYouScroller items={filteredAndSortedData} />
        ) : (
          <div className='ml-[3rem] flex h-[15rem] items-center text-muted-foreground'>
            No recommendations found matching your filters.
          </div>
        )}
      </section>
    </section>
  );
};

export default ForYouSection;
