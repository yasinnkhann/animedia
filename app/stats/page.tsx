import { Metadata } from 'next';
import { fetchUserMedia } from '@/app/actions/userMediaActions';
import StatsDashboard from './StatsDashboard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Stats',
  description: 'Your personal media tracking statistics on AniMedia.',
};

export default async function StatsPage() {
  const { userMovies, userShows, userGames } = await fetchUserMedia();

  return (
    <main className='mt-[var(--header-height-mobile)] min-h-[calc(100vh-var(--header-height-mobile))] px-[3rem] py-10'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Your Watchlist Stats</h1>
        <p className='text-muted-foreground'>
          An analytical breakdown of everything you are tracking.
        </p>
      </div>

      <StatsDashboard userMovies={userMovies} userShows={userShows} userGames={userGames} />
    </main>
  );
}
