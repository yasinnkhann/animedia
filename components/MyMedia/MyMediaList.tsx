import { Fragment, type ReactElement } from 'react';
import { ExtractStrict, TContent, TStatusParam } from '@ts/types';
import { BsInbox } from 'react-icons/bs';
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
  const adjustedStatus = status?.toUpperCase().split('-').join(' ') ?? '';

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

        {myMedias.length === 0 ? (
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
          <table className='block w-full sm:table'>
            <thead className='hidden sm:table-header-group'>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='w-[5rem] p-4 font-medium'>#</th>

                <th className='p-4 text-left font-medium'>Title</th>

                <th className='w-[7rem] p-4 font-medium'>My Rating</th>

                {mediaType === 'SHOWS' && <th className='w-[8rem] p-4 font-medium'>Current Ep.</th>}

                {mediaType === 'GAMES' && <th className='w-[8rem] p-4 font-medium'>In Wishlist</th>}

                <th className='w-[7rem] p-4 font-medium'>Remove</th>
              </tr>
            </thead>

            <tbody className='flex flex-col gap-4 divide-y divide-border p-4 sm:table-row-group sm:gap-0 sm:divide-y-0 sm:divide-border sm:border-b sm:border-border sm:p-0'>
              {myMedias?.map((myMedia, idx) => {
                let myMediaComp: ReactElement;
                if (mediaType === 'MOVIES') {
                  myMediaComp = (
                    <MyMovieEntry key={myMedia.id} myMovie={myMedia as Movie} count={idx + 1} />
                  );
                } else if (mediaType === 'SHOWS') {
                  myMediaComp = (
                    <MyShowEntry key={myMedia.id} myShow={myMedia as Show} count={idx + 1} />
                  );
                } else if (mediaType === 'GAMES') {
                  myMediaComp = (
                    <MyGameEntry key={myMedia.id} myGame={myMedia as Game} count={idx + 1} />
                  );
                } else {
                  myMediaComp = <></>;
                }
                return <Fragment key={myMedia.id}>{myMediaComp}</Fragment>;
              })}
            </tbody>
          </table>
        )}
      </section>
    </section>
  );
};

export default MyMediaList;
