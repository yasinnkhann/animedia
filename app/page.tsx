import HomePageClient from '../components/HomePageClient';
import { Suspense } from 'react';
import PopularServerSection from '@/components/Home/PopularServerSection';
import TrendingServerSection from '@/components/Home/TrendingServerSection';
import ForYouServerSection from '@/components/Home/ForYouServerSection';
import HorizontalScrollerSkeleton from '@/components/Skeletons/HorizontalScrollerSkeleton';

export const metadata = {
  title: 'Home',
};

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const popular =
    searchParams.popular === 'shows'
      ? 'shows'
      : searchParams.popular === 'theatres'
        ? 'theatres'
        : 'movies';
  const trending = searchParams.trending === 'shows' ? 'shows' : 'movies';
  const time = searchParams.time === 'week' ? 'week' : 'day';

  return (
    <HomePageClient
      popular={popular}
      trending={trending}
      time={time}
      forYouContent={
        <Suspense fallback={<HorizontalScrollerSkeleton />}>
          <ForYouServerSection />
        </Suspense>
      }
      popularContent={
        <Suspense fallback={<HorizontalScrollerSkeleton />}>
          <PopularServerSection popular={popular} />
        </Suspense>
      }
      trendingContent={
        <Suspense fallback={<HorizontalScrollerSkeleton />}>
          <TrendingServerSection trending={trending} time={time} />
        </Suspense>
      }
    />
  );
}
