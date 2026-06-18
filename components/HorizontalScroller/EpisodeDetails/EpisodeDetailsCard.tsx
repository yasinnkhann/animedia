'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CommonMethods } from '@utils/CommonMethods';
import RoundProgressBar from '@components/RoundProgressBar';
import Modal from '@components/Modal';
import commaNumber from 'comma-number';
import { Suspense } from 'react';
import { Puff } from 'react-loading-icons';
import { AnimatePresence } from 'framer-motion';

const EpisodeDetailsCardSkeleton = () => {
  return (
    <div className='relative mx-4 h-[7rem] w-[15rem] select-none'>
      <div className='relative h-full w-full'>
        <div className='h-full w-full animate-pulse rounded-lg bg-muted' />
        <div className='mt-2 flex flex-col items-center gap-1'>
          <div className='h-4 w-1/2 animate-pulse rounded bg-muted' />
          <div className='h-4 w-3/4 animate-pulse rounded bg-muted' />
        </div>
      </div>
    </div>
  );
};

const EpisodeDetailsCard = ({
  epDetailsCardData,
  isLoading,
}: {
  epDetailsCardData?: any;
  isLoading?: boolean;
}) => {
  const [showModal, setShowModal] = useState(false);

  if (isLoading || !epDetailsCardData?.id) {
    return <EpisodeDetailsCardSkeleton />;
  }

  return (
    <>
      <section className='relative mx-4 h-[7rem] w-[15rem] select-none' role='button' tabIndex={0}>
        <section className='relative h-full w-full' onClick={() => setShowModal(true)}>
          <div className='relative h-full w-full'>
            <Image
              className='rounded-lg object-contain'
              src={CommonMethods.getTheMovieDbImage(epDetailsCardData.still_path)}
              alt={epDetailsCardData.name ?? ''}
              fill
              sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
            />
          </div>
          <div className='relative flex w-full flex-wrap content-start whitespace-normal'>
            <h2 className='m-0 w-full break-words text-center text-base'>
              <p>
                Season {epDetailsCardData.season_number} Ep. {epDetailsCardData.episode_number}
              </p>
              <p className='font-bold'>{epDetailsCardData.name}</p>
            </h2>
          </div>
        </section>
      </section>

      <AnimatePresence mode='wait'>
        {showModal && (
          <Suspense
            fallback={
              <div className='flex justify-center'>
                <Puff stroke='#00b3ff' />
              </div>
            }
          >
            <Modal closeModal={() => setShowModal(false)}>
              <div className='w-full rounded-lg bg-transparent'>
                <div className='flex items-center justify-between border-b border-border px-6 py-4'>
                  <h2 className='text-lg font-semibold text-foreground'>
                    {epDetailsCardData.name}
                  </h2>
                </div>
                <div className='p-6'>
                  <div className='flex items-center space-x-4'>
                    <div className='h-16 w-16'>
                      <RoundProgressBar
                        percentageVal={+(epDetailsCardData.vote_average ?? 0).toFixed(1) * 10}
                      />
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {commaNumber(epDetailsCardData.vote_count ?? 0)} voted users
                    </p>
                  </div>
                  <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div>
                      <h4 className='font-semibold text-foreground'>Season</h4>
                      <p className='text-muted-foreground'>{epDetailsCardData.season_number}</p>
                    </div>
                    <div>
                      <h4 className='font-semibold text-foreground'>Episode</h4>
                      <p className='text-muted-foreground'>{epDetailsCardData.episode_number}</p>
                    </div>
                    <div>
                      <h4 className='font-semibold text-foreground'>Runtime</h4>
                      <p className='text-muted-foreground'>
                        {epDetailsCardData.runtime
                          ? `${epDetailsCardData.runtime} min`
                          : 'Runtime Not Available'}
                      </p>
                    </div>
                    <div>
                      <h4 className='font-semibold text-foreground'>Air Date</h4>
                      <p className='text-muted-foreground'>
                        {epDetailsCardData.air_date
                          ? CommonMethods.formatDate(epDetailsCardData.air_date)
                          : 'Air Date Not Available'}
                      </p>
                    </div>
                  </div>
                  <div className='mt-6'>
                    <h4 className='mb-2 font-semibold text-foreground'>Description:</h4>
                    <p className='text-muted-foreground'>
                      {epDetailsCardData.overview
                        ? epDetailsCardData.overview
                        : 'No Description Available'}
                    </p>
                  </div>
                </div>
                {epDetailsCardData.still_path && (
                  <div className='relative mt-4 h-[35rem] w-full overflow-hidden rounded-lg border border-border'>
                    <div className='relative h-full'>
                      <Image
                        src={CommonMethods.getTheMovieDbImage(epDetailsCardData.still_path)}
                        alt={epDetailsCardData.name ?? ''}
                        fill
                        sizes='(max-width: 768px) 100vw, 50vw'
                        className='object-cover'
                      />
                    </div>
                  </div>
                )}
              </div>
            </Modal>
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
};

export default EpisodeDetailsCard;
