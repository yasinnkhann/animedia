'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { IEPDetails } from '@ts/interfaces';
import { CommonMethods } from '@utils/CommonMethods';
import RoundProgressBar from '@components/RoundProgressBar';
import Modal from '@components/Modal';
import commaNumber from 'comma-number';
import { Suspense } from 'react';
import { Puff } from 'react-loading-icons';
import { AnimatePresence } from 'framer-motion';
import { getEpisodeDetailsAction } from '@/lib/actions/tmdbActions';

const EpisodeDetailsCard = ({ item }: { item: IEPDetails; itemId: string }) => {
  const [showModal, setShowModal] = useState(false);
  const [epDetailsCardData, setEpDetailsCardData] = useState<any>(null);

  useEffect(() => {
    getEpisodeDetailsAction(item.showId, item.season, item.episode).then(data => {
      if (data) {
        setEpDetailsCardData(data);
      }
    });
  }, [item.showId, item.season, item.episode]);

  if (!epDetailsCardData?.id) return <></>;

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
              <div className='w-full rounded-lg bg-white'>
                <div className='flex items-center justify-between border-b border-gray-300 px-6 py-4'>
                  <h2 className='text-lg font-semibold'>{epDetailsCardData.name}</h2>
                </div>
                <div className='p-6'>
                  <div className='flex items-center space-x-4'>
                    <div className='h-16 w-16'>
                      <RoundProgressBar
                        percentageVal={+(epDetailsCardData.vote_average ?? 0).toFixed(1) * 10}
                      />
                    </div>
                    <p className='text-sm text-gray-600'>
                      {commaNumber(epDetailsCardData.vote_count ?? 0)} voted users
                    </p>
                  </div>
                  <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div>
                      <h4 className='font-semibold'>Season</h4>
                      <p>{epDetailsCardData.season_number}</p>
                    </div>
                    <div>
                      <h4 className='font-semibold'>Episode</h4>
                      <p>{epDetailsCardData.episode_number}</p>
                    </div>
                    <div>
                      <h4 className='font-semibold'>Runtime</h4>
                      <p>
                        {epDetailsCardData.runtime
                          ? `${epDetailsCardData.runtime} min`
                          : 'Runtime Not Available'}
                      </p>
                    </div>
                    <div>
                      <h4 className='font-semibold'>Air Date</h4>
                      <p>
                        {epDetailsCardData.air_date
                          ? CommonMethods.formatDate(epDetailsCardData.air_date)
                          : 'Air Date Not Available'}
                      </p>
                    </div>
                  </div>
                  <div className='mt-6'>
                    <h4 className='mb-2 font-semibold'>Description:</h4>
                    <p>
                      {epDetailsCardData.overview
                        ? epDetailsCardData.overview
                        : 'No Description Available'}
                    </p>
                  </div>
                </div>
                {epDetailsCardData.still_path && (
                  <div className='relative h-[35rem] w-full overflow-hidden rounded-lg border'>
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
