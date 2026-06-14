'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from './Pagination';
import PeopleList from './MediaPerson/PeopleList';
import { RESULTS_PER_PAGE } from '@/utils/constants';

interface Props {
  peopleData: any;
  currPage: number;
  title: string;
  basePath: string;
}

const PeopleBrowseClient = ({ peopleData, currPage, title, basePath }: Props) => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currPage]);

  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)] px-48'>
      <h3 className='mb-4'>{title}</h3>
      <PeopleList peopleData={peopleData} pageNum={currPage} />
      <Pagination
        currPage={currPage}
        totalItems={peopleData.total_results}
        itemsPerPage={RESULTS_PER_PAGE}
        paginate={(pageNum: number) => router.push(`${basePath}?page=${pageNum}`)}
        siblingCount={1}
        maxPageNum={500}
      />
    </main>
  );
};

export default PeopleBrowseClient;
