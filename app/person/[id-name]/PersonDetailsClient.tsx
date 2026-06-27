'use client';

import { useMemo, useState, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import _ from 'lodash';
import { useParams } from 'next/navigation';
import Image from 'next/image';

import { Circles } from 'react-loading-icons';
import { IRelatedMedia } from '../../../models/ts/interfaces';
import { CommonMethods } from '../../../utils/CommonMethods';

import {
  KNOWN_FOR_MIN_EP_COUNT,
  KNOWN_FOR_CARDS_LIMIT,
  MAX_SUMMARY_WORD_LENGTH,
} from '../../../utils/constants';
import RelatedHorizontalScroller from '../../../components/HorizontalScroller/Related/RelatedHorizontalScroller';
import Modal from '../../../components/Modal';

interface Props {
  personDetailsData: any;
  creditsNode: React.ReactNode;
}

export default function PersonDetailsClient({ personDetailsData, creditsNode }: Props) {
  const params = useParams();
  const idName = params?.['id-name'] as string;
  const id = idName?.split('-')[0] ?? '';

  const [showFullDescription, setShowFullDescription] = useState(false);

  const getAge = (dateStr: string) => {
    const today = new Date();
    const birthDate = new Date(dateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (!personDetailsData) {
    return (
      <section className='flex h-screen items-center justify-center'>
        <Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
      </section>
    );
  }

  const person = personDetailsData.personDetails;

  return (
    <motion.main
      className='mx-auto mt-[calc(var(--header-height-mobile)+2rem)] max-w-7xl px-4 sm:px-6 lg:px-8'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className='mb-6 text-center text-4xl font-bold tracking-tight text-foreground lg:hidden'>
        {person.name}
      </h1>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]'>
        {/* Left Column: Image & Personal Info */}
        <aside className='flex flex-col gap-8'>
          <div className='relative mx-auto aspect-[2/3] w-[14rem] overflow-hidden rounded-xl shadow-2xl sm:w-[16rem] lg:mx-0 lg:w-full'>
            <Image
              className='object-cover'
              src={CommonMethods.getTheMovieDbImage(person.profile_path)}
              alt={person.name ?? ''}
              fill
              priority
              sizes='(max-width: 768px) 100vw, 300px'
            />
          </div>

          <div className='rounded-xl border border-border bg-card p-6 shadow-sm'>
            <h3 className='mb-4 border-b border-border pb-2 text-xl font-bold text-foreground'>
              Personal Info
            </h3>

            <div className='space-y-4'>
              <div>
                <h4 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                  Known For
                </h4>
                <p className='font-medium text-foreground'>
                  {person.known_for_department || 'N/A'}
                </p>
              </div>

              <div>
                <h4 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                  Gender
                </h4>
                <p className='font-medium text-foreground'>
                  {person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : 'Unknown'}
                </p>
              </div>

              <div>
                <h4 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                  Birthday
                </h4>
                <p className='font-medium text-foreground'>
                  {person.birthday
                    ? `${CommonMethods.formatDate(person.birthday)}${!person.deathday ? ` (${getAge(person.birthday)} years old)` : ''}`
                    : 'Unknown'}
                </p>
              </div>

              {person.place_of_birth && (
                <div>
                  <h4 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                    Place of Birth
                  </h4>
                  <p className='font-medium text-foreground'>{person.place_of_birth}</p>
                </div>
              )}

              {person.deathday && (
                <div>
                  <h4 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                    Date of Death
                  </h4>
                  <p className='font-medium text-foreground'>
                    {`${CommonMethods.formatDate(person.deathday)} (${person.birthday ? getAge(person.birthday) - getAge(person.deathday) : 'Unknown'} years old)`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right Column: Bio & Credits */}
        <section className='flex min-w-0 flex-col gap-8'>
          <div>
            <h1 className='mb-6 hidden text-5xl font-bold tracking-tight text-foreground lg:block'>
              {person.name}
            </h1>
            <h2 className='mb-4 text-2xl font-bold text-foreground'>Biography</h2>
            <div className='text-lg leading-relaxed text-muted-foreground'>
              {person.biography ? (
                person.biography.split(' ').length <= MAX_SUMMARY_WORD_LENGTH ? (
                  person.biography
                ) : (
                  <div className='relative'>
                    <p>
                      {person.biography.split(' ').slice(0, MAX_SUMMARY_WORD_LENGTH).join(' ') +
                        '...'}
                    </p>
                    <button
                      className='mt-3 font-bold text-primary transition-colors hover:text-primary/80'
                      onClick={() => setShowFullDescription(true)}
                    >
                      Read Full Biography →
                    </button>
                  </div>
                )
              ) : (
                <p className='italic text-muted-foreground'>
                  No biography available for this person.
                </p>
              )}
            </div>
          </div>

          {creditsNode}
        </section>
      </div>

      <AnimatePresence mode='wait'>
        {showFullDescription && (
          <Suspense fallback={null}>
            <Modal closeModal={() => setShowFullDescription(false)}>
              <div className='p-2'>
                <h3 className='mb-6 border-b border-border pb-4 text-3xl font-bold text-foreground'>
                  Biography
                </h3>
                <div className='max-h-[70vh] overflow-y-auto whitespace-pre-line pr-4 text-lg leading-relaxed text-muted-foreground'>
                  {person.biography}
                </div>
              </div>
            </Modal>
          </Suspense>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
