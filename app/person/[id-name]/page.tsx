'use client';

import { useMemo, useState, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import _ from 'lodash';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import * as Queries from '../../../graphql/queries';
import { Circles } from 'react-loading-icons';
import { IRelatedMedia } from '../../../models/ts/interfaces';
import { CommonMethods } from '../../../utils/CommonMethods';
import { useQuery } from '@apollo/client/react';
import {
  KNOWN_FOR_MIN_EP_COUNT,
  KNOWN_FOR_CARDS_LIMIT,
  MAX_SUMMARY_WORD_LENGTH,
} from '../../../utils/constants';
import RelatedHorizontalScroller from '../../../components/HorizontalScroller/Related/RelatedHorizontalScroller';
import Modal from '../../../components/Modal';

export default function PersonDetailsPage() {
  const params = useParams();
  const idName = params?.['id-name'] as string;
  const id = idName?.split('-')[0] ?? '';

  const [showFullDescription, setShowFullDescription] = useState(false);

  const { data: personDetailsData, loading: personDetailsLoading } = useQuery(
    Queries.PERSON_DETAILS,
    {
      variables: {
        personDetailsId: id,
      },
      fetchPolicy: 'network-only',
      skip: !id,
    }
  );

  const { data: knownForMoviesData, loading: knownForMoviesLoading } = useQuery(
    Queries.GET_PERSONS_KNOWN_FOR_MOVIES,
    {
      variables: {
        personsKnownForMovieResId: id,
      },
      fetchPolicy: 'network-only',
      skip: !id,
    }
  );

  const { data: knownForShowsData, loading: knownForShowsLoading } = useQuery(
    Queries.GET_PERSONS_KNOWN_FOR_SHOWS,
    {
      variables: {
        personsKnownForShowResId: id,
      },
      fetchPolicy: 'network-only',
      skip: !id,
    }
  );

  const memoMappedMedia = useMemo(() => {
    if (!knownForMoviesData && !knownForShowsData) return [];

    const uniqueMovies: Set<string> = new Set();
    const mappedMoviesCast: IRelatedMedia[] = [];

    for (const castObj of knownForMoviesData?.personsKnownForMovie?.cast ?? []) {
      if (castObj && !uniqueMovies.has(castObj.id)) {
        uniqueMovies.add(castObj.id);

        mappedMoviesCast.push({
          id: castObj.id,
          imagePath: castObj.poster_path,
          name: castObj.title,
          popularity: castObj.popularity,
          type: 'movie',
        });
      }
    }

    const uniqueShows: Set<string> = new Set();
    const mappedShowsCast: IRelatedMedia[] = [];

    for (const castObj of knownForShowsData?.personsKnownForShow?.cast ?? []) {
      if (
        castObj &&
        !uniqueShows.has(castObj.id) &&
        (castObj.episode_count ?? 0) > KNOWN_FOR_MIN_EP_COUNT
      ) {
        uniqueShows.add(castObj.id);

        mappedShowsCast.push({
          id: castObj.id,
          imagePath: castObj.poster_path,
          name: castObj.name,
          popularity: castObj.popularity,
          type: 'show',
        });
      }
    }

    return mappedMoviesCast
      .concat(mappedShowsCast)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, KNOWN_FOR_CARDS_LIMIT);
  }, [knownForMoviesData, knownForShowsData]);

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

  if (personDetailsLoading || !personDetailsData || knownForMoviesLoading || knownForShowsLoading) {
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
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]'>
        {/* Left Column: Image & Personal Info */}
        <aside className='flex flex-col gap-8'>
          <div className='relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-2xl'>
            <Image
              className='object-cover'
              src={CommonMethods.getTheMovieDbImage(person.profile_path)}
              alt={person.name ?? ''}
              fill
              priority
              sizes='(max-width: 768px) 100vw, 300px'
            />
          </div>

          <div className='rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm'>
            <h3 className='mb-4 border-b pb-2 text-xl font-bold text-gray-900'>Personal Info</h3>

            <div className='space-y-4'>
              <div>
                <h4 className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
                  Known For
                </h4>
                <p className='font-medium text-gray-900'>{person.known_for_department || 'N/A'}</p>
              </div>

              <div>
                <h4 className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
                  Gender
                </h4>
                <p className='font-medium text-gray-900'>
                  {person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : 'Unknown'}
                </p>
              </div>

              <div>
                <h4 className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
                  Birthday
                </h4>
                <p className='font-medium text-gray-900'>
                  {person.birthday
                    ? `${CommonMethods.formatDate(person.birthday)}${!person.deathday ? ` (${getAge(person.birthday)} years old)` : ''}`
                    : 'Unknown'}
                </p>
              </div>

              {person.place_of_birth && (
                <div>
                  <h4 className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
                    Place of Birth
                  </h4>
                  <p className='font-medium text-gray-900'>{person.place_of_birth}</p>
                </div>
              )}

              {person.deathday && (
                <div>
                  <h4 className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
                    Date of Death
                  </h4>
                  <p className='font-medium text-gray-900'>
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
            <h1 className='mb-6 text-5xl font-black tracking-tight text-gray-900'>{person.name}</h1>
            <h2 className='mb-4 text-2xl font-bold text-gray-800'>Biography</h2>
            <div className='text-lg leading-relaxed text-gray-700'>
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
                      className='mt-3 font-bold text-blue-600 transition-colors hover:text-blue-800'
                      onClick={() => setShowFullDescription(true)}
                    >
                      Read Full Biography →
                    </button>
                  </div>
                )
              ) : (
                <p className='italic text-gray-400'>No biography available for this person.</p>
              )}
            </div>
          </div>

          {!_.isEmpty(memoMappedMedia) && (
            <div className='mt-8'>
              <h2 className='mb-6 text-2xl font-bold text-gray-800'>Known For</h2>
              <div className='-mx-4 sm:-mx-0'>
                <RelatedHorizontalScroller items={memoMappedMedia} />
              </div>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence mode='wait'>
        {showFullDescription && (
          <Suspense fallback={null}>
            <Modal closeModal={() => setShowFullDescription(false)}>
              <div className='p-2'>
                <h3 className='mb-6 border-b pb-4 text-3xl font-bold text-gray-900'>Biography</h3>
                <div className='max-h-[70vh] overflow-y-auto whitespace-pre-line pr-4 text-lg leading-relaxed text-gray-700'>
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
