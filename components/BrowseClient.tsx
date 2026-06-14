'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from './Pagination';
import MediaList from './MediaPerson/MediaList';
import { RESULTS_PER_PAGE } from '@/utils/constants';

interface Props {
  mediaData: any;
  currPage: number;
  title: string;
  basePath: string;
}

const BrowseClient = ({ mediaData, currPage, title, basePath }: Props) => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currPage]);

  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
      <section className='flex flex-col items-center'>
        <MediaList mediaData={mediaData} pageNum={currPage} title={title} />

        <Pagination
          currPage={currPage}
          totalItems={mediaData.total_results}
          itemsPerPage={RESULTS_PER_PAGE}
          paginate={(pageNum: number) => router.push(`${basePath}?page=${pageNum}`)}
          siblingCount={1}
          maxPageNum={500}
        />
      </section>
    </main>
  );
};

export default BrowseClient;
