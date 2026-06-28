'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { BiArrowBack } from 'react-icons/bi';

interface LibraryNavProps {
  currentTab: 'shows' | 'movies' | 'games' | 'collections';
}

const LibraryNav = ({ currentTab }: LibraryNavProps) => {
  const { data: session } = useSession();

  const tabs = [
    { id: 'shows', label: 'Shows', href: '/my-shows/watching' },
    { id: 'movies', label: 'Movies', href: '/my-movies/watching' },
    { id: 'games', label: 'Games', href: '/my-games/wishlist' },
    { id: 'collections', label: 'Collections', href: '/collections' },
  ];

  return (
    <div className='w-full border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-10 md:px-20 lg:px-40'>
      <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        {/* Back to Profile Button */}
        {session?.user?.id ? (
          <Link
            href={`/user/${session.user.id}`}
            className='group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground'
          >
            <BiArrowBack className='transition-transform group-hover:-translate-x-1' size={18} />
            Back to Profile
          </Link>
        ) : (
          <div /> /* Placeholder to maintain flex-between spacing if no session */
        )}

        {/* Library Navigation Tabs */}
        <nav className='flex space-x-1 rounded-xl bg-muted/50 p-1'>
          {tabs.map(tab => {
            const isActive = currentTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default LibraryNav;
