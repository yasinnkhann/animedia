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

export const revalidate = 3600;

export default async function Home() {
  const popular = 'movies';
  const trending = 'shows';
  const time = 'day';

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
