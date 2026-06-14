import { tmdbClient } from '@/lib/api';
import PeopleBrowseClient from '@/components/PeopleBrowseClient';

export default async function PopularPeople(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = Math.max(1, parseInt(pageStr, 10) || 1);

  const popularPeople = await tmdbClient.getPopularPeople(page);

  return (
    <PeopleBrowseClient
      peopleData={popularPeople}
      currPage={page}
      title='Popular People'
      basePath='/people/popular'
    />
  );
}
