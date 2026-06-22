'use client';

import { Fragment, useState, type ReactElement } from 'react';
import { ExtractStrict, TContent, TStatusParam } from '@ts/types';
import { BsInbox } from 'react-icons/bs';
import { TbSearch } from 'react-icons/tb';
import Link from 'next/link';
import MyMovieEntry from './MyMovieEntry';
import MyShowEntry from './MyShowEntry';
import MyGameEntry from './MyGameEntry';
import type { Movie, Show, Game } from '@prisma/client';

interface Props {
  status: TStatusParam;
  myMedias: Movie[] | Show[] | Game[];
  mediaType: Uppercase<ExtractStrict<TContent, 'movies' | 'shows' | 'games'>>;
}

const MyMediaList = ({ status, myMedias, mediaType }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const adjustedStatus = status?.toUpperCase().split('-').join(' ') ?? '';

  const filteredMedias = myMedias.filter(media =>
    media.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className='w-full px-4 sm:px-10 md:px-20 lg:px-40'>
      <section className='flex flex-col pb-4'>
        <div className='relative mt-8 flex h-[3rem] items-center justify-center rounded-t-lg bg-muted/30'>
          <h4 className='text-center text-primary'>
            {adjustedStatus ? `${adjustedStatus} ${mediaType}` : mediaType}
          </h4>
          <h4 className='ml-2 text-foreground'>{myMedias.length}</h4>
        </div>

        {mediaType !== 'GAMES' && (
          <div className='mb-6 mt-4 flex flex-wrap justify-center gap-2 sm:justify-start'>
            {[
              { label: 'Watching', value: 'watching' },
              { label: 'Completed', value: 'completed' },
              { label: 'On Hold', value: 'on-hold' },
              { label: 'Dropped', value: 'dropped' },
              { label: 'Plan to Watch', value: 'plan-to-watch' },
            ].map(tab => {
              const isActive = status === tab.value;
              const routePrefix = mediaType === 'MOVIES' ? 'my-movies' : 'my-shows';

              return (
                <Link
                  key={tab.value}
                  href={`/${routePrefix}/${tab.value}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium no-underline transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Search Filter */}
        {myMedias.length > 0 && (
          <div className='relative mb-6 mt-4 w-full sm:w-96'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <TbSearch className='text-muted-foreground' size={20} />
            </div>
            <input
              type='text'
              className='block w-full rounded-lg border border-border bg-card p-2.5 pl-10 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              placeholder={`Search in your ${mediaType.toLowerCase()}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {filteredMedias.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-lg border border-border bg-card py-20 text-center shadow-sm'>
            <BsInbox className='mb-4 text-6xl text-muted-foreground opacity-50' />
            <h3 className='mb-2 text-xl font-semibold text-foreground'>
              No {mediaType.toLowerCase()} found
            </h3>
            <p className='text-muted-foreground'>
              It looks like you haven&apos;t added any {mediaType.toLowerCase()} to this list yet.
            </p>
          </div>
        ) : (
          <div className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {filteredMedias?.map((myMedia, idx) => {
              let myMediaComp: ReactElement;
              if (mediaType === 'MOVIES') {
                myMediaComp = <MyMovieEntry key={myMedia.id} myMovie={myMedia as Movie} />;
              } else if (mediaType === 'SHOWS') {
                myMediaComp = <MyShowEntry key={myMedia.id} myShow={myMedia as Show} />;
              } else if (mediaType === 'GAMES') {
                myMediaComp = <MyGameEntry key={myMedia.id} myGame={myMedia as Game} />;
              } else {
                myMediaComp = <></>;
              }
              return <Fragment key={myMedia.id}>{myMediaComp}</Fragment>;
            })}
          </div>
        )}
      </section>
    </section>
  );
};

export default MyMediaList;
