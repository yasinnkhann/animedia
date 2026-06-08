'use client';

import { useMemo, useState, lazy, Suspense } from 'react';
import { useParams } from 'next/navigation';
import _ from 'lodash';
import Image from 'next/image';
import * as Queries from '@/graphql/queries';
import { Circles } from 'react-loading-icons';
import { IRelatedMedia } from '@ts/interfaces';
import { CommonMethods } from '@/utils/CommonMethods';
import { useQuery } from '@apollo/client/react';
import {
  KNOWN_FOR_MIN_EP_COUNT,
  KNOWN_FOR_CARDS_LIMIT,
  MAX_SUMMARY_WORD_LENGTH,
} from '@/utils/constants';
import RelatedHorizontalScroller from '@/components/HorizontalScroller/Related/RelatedHorizontalScroller';

const Modal = lazy(() => import('@/components/Modal'));

const PersonDetails = () => {
  const params = useParams();

  const id = (params?.['id-name'] as string)?.split('-')[0] ?? '';

  const [showFullDescription, setShowFullDescription] = useState(false);

  const { data: personDetailsData, loading: personDetailsLoading } = useQuery(
    Queries.PERSON_DETAILS,
    {
      skip: !id,
      variables: {
        personDetailsId: id,
      },
      fetchPolicy: 'network-only',
    }
  );

  const { data: knownForMoviesData, loading: knownForMoviesLoading } = useQuery(
    Queries.GET_PERSONS_KNOWN_FOR_MOVIES,
    {
      skip: !id,
      variables: {
        personsKnownForMovieResId: id,
      },
      fetchPolicy: 'network-only',
    }
  );

  const { data: knownForShowsData, loading: knownForShowsLoading } = useQuery(
    Queries.GET_PERSONS_KNOWN_FOR_SHOWS,
    {
      skip: !id,
      variables: {
        personsKnownForShowResId: id,
      },
      fetchPolicy: 'network-only',
    }
  );

  const knownFor: IRelatedMedia[] = useMemo(() => {
    if (!knownForMoviesData || !knownForShowsData) return [];

    const allKnownFor: IRelatedMedia[] = [];

    if (
      knownForMoviesData?.personsKnownForMovie &&
      !_.isEmpty(knownForMoviesData.personsKnownForMovie.cast)
    ) {
      allKnownFor.push(
        ...knownForMoviesData.personsKnownForMovie.cast
          .filter((movie): movie is NonNullable<typeof movie> => !!(movie?.id && movie?.title))
          .map(movie => ({
            id: movie.id,
            imagePath: movie.poster_path,
            name: movie.title,
            popularity: movie.popularity ?? 0,
            type: 'movie' as const,
          }))
      );
    }

    if (
      knownForShowsData?.personsKnownForShow &&
      !_.isEmpty(knownForShowsData.personsKnownForShow.cast)
    ) {
      allKnownFor.push(
        ...knownForShowsData.personsKnownForShow.cast
          .filter(
            (show): show is NonNullable<typeof show> =>
              !!(
                show?.id &&
                show?.name &&
                show?.episode_count != null &&
                show.episode_count >= KNOWN_FOR_MIN_EP_COUNT
              )
          )
          .map(show => ({
            id: show.id,
            imagePath: show.poster_path,
            name: show.name,
            popularity: show.popularity ?? 0,
            type: 'show' as const,
          }))
      );
    }

    return allKnownFor.sort((a, b) => b.popularity - a.popularity).slice(0, KNOWN_FOR_CARDS_LIMIT);
  }, [knownForMoviesData, knownForShowsData]);

  if (personDetailsLoading || !personDetailsData?.personDetails) {
    return (
      <section className='flex h-screen items-center justify-center'>
        <Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
      </section>
    );
  }

  const person = personDetailsData.personDetails;

  return (
    <>
      <main className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
        <section className='aspect-h-16 aspect-w-16 relative mx-4 mt-4'>
          <Image
            className='rounded-lg'
            src={CommonMethods.getTheMovieDbImage(person.profile_path)}
            alt={person.name ?? 'Unknown'}
            fill
            sizes='100vw'
          />
        </section>

        <section className='mt-4'>
          <section className='pb-32'>
            <h1>{person.name}</h1>
            <h4 className='my-4 italic text-gray-400'>{person.known_for_department}</h4>
            <p>
              {person.biography && person.biography.length > MAX_SUMMARY_WORD_LENGTH * 7 ? (
                !showFullDescription ? (
                  <>
                    {person.biography
                      .split(' ')
                      .slice(0, MAX_SUMMARY_WORD_LENGTH * 7)
                      .join(' ')}
                    ...
                    <button
                      className='text-md ml-4 text-blue-500 underline'
                      onClick={() => setShowFullDescription(true)}
                    >
                      Read More
                    </button>
                  </>
                ) : (
                  <>
                    {person.biography}
                    <button
                      className='text-md ml-4 text-blue-500 underline'
                      onClick={() => setShowFullDescription(false)}
                    >
                      Read Less
                    </button>
                  </>
                )
              ) : person.biography ? (
                person.biography
              ) : (
                <i>Biography Not Available</i>
              )}
            </p>
          </section>
        </section>

        <section className='my-4 ml-8'>
          <h3 className='mb-4 underline underline-offset-4'>Personal Info</h3>
          <h4 className='mt-4'>Birth Date</h4>
          {person.birthday ? (
            <p className='ml-1'>{CommonMethods.formatDate(person.birthday)}</p>
          ) : (
            <p className='ml-1'>N/A</p>
          )}
          <h4 className='mt-4'>Place of Birth</h4>
          <p className='ml-1'>{person.place_of_birth ?? 'N/A'}</p>
          <h4 className='mt-4'>Department</h4>
          <p className='ml-1'>{person.known_for_department}</p>
          <h4 className='mt-4'>Popularity</h4>
          <p className='ml-1'>{person.popularity}</p>
        </section>

        <section className='col-start-2 mt-4'>
          {!knownForMoviesLoading && !knownForShowsLoading && !_.isEmpty(knownFor) && (
            <section className='pb-4'>
              <h3 className='mb-4 ml-8 mt-4'>Known For</h3>
              <RelatedHorizontalScroller items={knownFor} />
            </section>
          )}
        </section>
      </main>
      {showFullDescription && person.biography && (
        <Suspense fallback={<div>Loading...</div>}>
          <Modal closeModal={() => setShowFullDescription(false)}>
            <h3 className='mb-4 text-xl font-semibold'>Biography</h3>
            <p>{person.biography}</p>
          </Modal>
        </Suspense>
      )}
    </>
  );
};

export default PersonDetails;
