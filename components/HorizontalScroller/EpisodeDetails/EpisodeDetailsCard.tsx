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

const FALLBACK_IMAGE = '/episode-no-preview.png';

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
  const [imgLoaded, setImgLoaded] = useState(false);

  const imageSrc = epDetailsCardData?.still_path
    ? CommonMethods.getTheMovieDbImage(epDetailsCardData.still_path)
    : FALLBACK_IMAGE;

  const [prevImageSrc, setPrevImageSrc] = useState(imageSrc);
  if (prevImageSrc !== imageSrc) {
    setPrevImageSrc(imageSrc);
    setImgLoaded(false);
  }

  if (isLoading || !epDetailsCardData?.id) {
    return <EpisodeDetailsCardSkeleton />;
  }

  return (
    <>
      <section
        className='group relative mx-4 h-[7rem] w-[15rem] cursor-pointer select-none'
        role='button'
        tabIndex={0}
        onClick={() => setShowModal(true)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setShowModal(true);
          }
        }}
      >
        <section className='relative h-full w-full'>
          <div className='relative h-full w-full overflow-hidden rounded-lg shadow-md transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/20'>
            {/* Pulse skeleton visible beneath image while it loads */}
            {!imgLoaded && <div className='absolute inset-0 animate-pulse rounded-lg bg-muted' />}

            <Image
              className='rounded-lg object-cover transition-all duration-500 ease-in-out group-hover:scale-105'
              style={{ opacity: imgLoaded ? 1 : 0 }}
              src={imageSrc}
              alt={epDetailsCardData.name ?? ''}
              fill
              sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
              onLoad={() => setImgLoaded(true)}
            />

            {/* Hover glassmorphism overlay — matches MediaCard */}
            <div className='absolute inset-0 flex flex-col items-center justify-end rounded-lg bg-black/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100'>
              <div className='mb-2 translate-y-4 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-semibold text-white opacity-0 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
                View Details
              </div>
            </div>
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
              <div className='flex w-full flex-col bg-transparent'>
                {/* Hero Image Header */}
                <div className='relative h-[16rem] w-full shrink-0 sm:h-[22rem]'>
                  <Image
                    src={imageSrc}
                    alt={epDetailsCardData.name ?? 'Episode Image'}
                    fill
                    sizes='(max-width: 768px) 100vw, 50vw'
                    className='object-cover'
                    priority
                  />
                  {/* Gradient Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent' />

                  {/* Title and Rating on top of the image gradient */}
                  <div className='absolute bottom-0 left-0 w-full p-6 pb-4'>
                    <div className='flex items-end justify-between gap-4'>
                      <h2 className='text-2xl font-bold text-white drop-shadow-md sm:text-3xl'>
                        {epDetailsCardData.name}
                      </h2>
                      <div className='flex shrink-0 items-center space-x-3 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md'>
                        <div className='h-10 w-10'>
                          <RoundProgressBar
                            percentageVal={+(epDetailsCardData.vote_average ?? 0).toFixed(1) * 10}
                          />
                        </div>
                        <p className='hidden text-xs font-medium text-white/90 sm:block'>
                          {commaNumber(epDetailsCardData.vote_count ?? 0)} votes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Body */}
                <div className='flex flex-col gap-6 p-6'>
                  {/* Sleek Metadata Badges */}
                  <div className='flex flex-wrap gap-3'>
                    <div className='rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-foreground'>
                      Season {epDetailsCardData.season_number}
                    </div>
                    <div className='rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-foreground'>
                      Episode {epDetailsCardData.episode_number}
                    </div>
                    {epDetailsCardData.runtime && (
                      <div className='rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-foreground'>
                        {epDetailsCardData.runtime} min
                      </div>
                    )}
                    {epDetailsCardData.air_date && (
                      <div className='rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-foreground'>
                        {CommonMethods.formatDate(epDetailsCardData.air_date)}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className='text-lg leading-relaxed text-muted-foreground'>
                    {epDetailsCardData.overview ? (
                      <p>{epDetailsCardData.overview}</p>
                    ) : (
                      <p className='italic text-muted-foreground/60'>No Description Available</p>
                    )}
                  </div>
                </div>
              </div>
            </Modal>
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
};

export default EpisodeDetailsCard;
