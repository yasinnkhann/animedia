import HomePageClient from '../components/HomePageClient';
import { Suspense } from 'react';
import PopularServerSection from '@/components/Home/PopularServerSection';
import TrendingServerSection from '@/components/Home/TrendingServerSection';
import ForYouServerSection from '@/components/Home/ForYouServerSection';
import DailyPickServerSection from '@/components/Home/DailyPickServerSection';
import HorizontalScrollerSkeleton from '@/components/Skeletons/HorizontalScrollerSkeleton';

import ForYouScrollerSkeleton from '@/components/Skeletons/ForYouScrollerSkeleton';

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
        <Suspense fallback={<ForYouScrollerSkeleton />}>
          <ForYouServerSection />
        </Suspense>
      }
      dailyPickContent={
        <Suspense fallback={<div className='h-32 w-full animate-pulse rounded-3xl bg-card/50' />}>
          <DailyPickServerSection />
        </Suspense>
      }
      popularContent={
        <Suspense fallback={<HorizontalScrollerSkeleton />}>
          <PopularServerSection key={`popular-${popular}`} popular={popular} />
        </Suspense>
      }
      trendingContent={
        <Suspense fallback={<HorizontalScrollerSkeleton />}>
          <TrendingServerSection
            key={`trending-${trending}-${time}`}
            trending={trending}
            time={time}
          />
        </Suspense>
      }
    />
  );
}
