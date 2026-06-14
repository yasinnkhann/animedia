import { Fragment, type ReactElement } from 'react';
import { ExtractStrict, TContent, TStatusParam } from '@ts/types';
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
        <table>
          <thead>
            <tr className='border-b border-border text-muted-foreground'>
              <th className='w-[5rem] p-4 font-medium'>#</th>

              <th className='p-4 text-left font-medium'>Title</th>

              <th className='w-[7rem] p-4 font-medium'>My Rating</th>

              {mediaType === 'SHOWS' && <th className='w-[8rem] p-4 font-medium'>Current Ep.</th>}

              {mediaType === 'GAMES' && <th className='w-[8rem] p-4 font-medium'>In Wishlist</th>}

              <th className='w-[7rem] p-4 font-medium'>Remove</th>
            </tr>
          </thead>

          <tbody className='divide-y divide-border border-b border-border'>
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
      </section>
    </section>
  );
};

export default MyMediaList;
