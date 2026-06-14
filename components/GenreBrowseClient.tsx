'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from './Pagination';
import MediaList from './MediaPerson/MediaList';
import { Select } from 'antd';
import { RESULTS_PER_PAGE } from '@/utils/constants';

interface Props {
  mediaData: any;
  currPage: number;
  sortBy: string;
  genre: string;
  basePath: string;
  sortByOptions: { value: string; text: string }[];
  genreOptions: { value: string; text: string }[];
}

const GenreBrowseClient = ({
  mediaData,
  currPage,
  sortBy,
  genre,
  basePath,
  sortByOptions,
  genreOptions,
}: Props) => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currPage]);

  const handleSortByChange = (value: string) => {
    router.push(
      `${basePath}?page=1&sortBy=${encodeURIComponent(value)}&genre=${encodeURIComponent(genre)}`
    );
  };

  const handleGenreTypeChange = (value: string) => {
    router.push(
      `${basePath}?page=1&sortBy=${encodeURIComponent(sortBy)}&genre=${encodeURIComponent(value)}`
    );
  };

  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
      <section className='grid grid-cols-[20%_60%_20%]'>
        <section className='mt-4 justify-self-center'>
          <div className='mb-2'>
            <label className='mb-1 block text-blue-500' htmlFor='sort-by-dropdown'>
              Sort By:
            </label>
            <Select
              className='!w-[10rem]'
              id='sort-by-dropdown'
              value={sortBy}
              options={sortByOptions.map(option => ({
                value: option.value,
                label: option.text,
              }))}
              onChange={handleSortByChange}
            />
          </div>

          <div>
            <label className='mb-1 block text-blue-500' htmlFor='genre-type-dropdown'>
              Genre Type:
            </label>
            <Select
              className='!w-[10rem]'
              id='genre-type-dropdown'
              size='middle'
              value={genre}
              options={genreOptions.map(option => ({
                value: option.value,
                label: option.text,
              }))}
              onChange={handleGenreTypeChange}
            />
          </div>
        </section>

        <section className='flex flex-col items-center'>
          <MediaList
            mediaData={mediaData}
            pageNum={currPage}
            title={`${sortBy} ${genre} ${basePath.includes('show') ? 'Shows' : basePath.includes('game') ? 'Games' : 'Movies'}`}
            genrePage
          />

          <Pagination
            currPage={currPage}
            totalItems={mediaData.total_results}
            itemsPerPage={RESULTS_PER_PAGE}
            paginate={(pageNum: number) =>
              router.push(
                `${basePath}?page=${pageNum}&sortBy=${encodeURIComponent(sortBy)}&genre=${encodeURIComponent(genre)}`
              )
            }
            siblingCount={1}
            maxPageNum={500}
          />
        </section>
      </section>
    </main>
  );
};

export default GenreBrowseClient;
