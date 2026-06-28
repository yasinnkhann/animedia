import Image from 'next/image';
import Link from 'next/link';
import RoundProgressBar from '@/components/RoundProgressBar';
import commaNumber from 'comma-number';
import { getEnglishName } from 'all-iso-language-codes';
import { CommonMethods } from '@/utils/CommonMethods';
import { tmdbClient } from '@/lib/api';
import MovieActions from './MovieActions';
import PageAnimationWrapper from '@/components/PageAnimationWrapper';
import { Suspense } from 'react';
import HorizontalScrollerSkeleton from '@/components/Skeletons/HorizontalScrollerSkeleton';
import MovieCastServer from '@/components/movie/MovieCastServer';
import MovieRelatedServer from '@/components/movie/MovieRelatedServer';
import ReviewSection from '@/components/Reviews/ReviewSection';
import FranchiseTracker from '@/components/movie/FranchiseTracker';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ 'id-name': string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.['id-name']?.split('-')[0] ?? '';

  if (!id) {
    return {
      title: 'Movie Not Found | AniMedia',
    };
  }

  const movieDetails = await tmdbClient.getMovieDetails(id);
  const title = movieDetails?.title ? `${movieDetails.title} | AniMedia` : 'Movie | AniMedia';
  const description =
    movieDetails?.overview || movieDetails?.tagline || 'View movie details on AniMedia.';
  const posterUrl = movieDetails?.poster_path
    ? (CommonMethods.getTheMovieDbImage(movieDetails.poster_path) as string)
    : '';

  const ogUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/og`);
  ogUrl.searchParams.set('title', movieDetails?.title || 'Movie');
  if (posterUrl) ogUrl.searchParams.set('poster', posterUrl);
  if (movieDetails?.vote_average) {
    ogUrl.searchParams.set('rating', String(+(movieDetails.vote_average ?? 0).toFixed(1) * 10));
  }
  ogUrl.searchParams.set('type', 'MOVIE');

  const images = [ogUrl.toString()];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    },
  };
}

export default async function MovieDetails({ params }: { params: Promise<{ 'id-name': string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams?.['id-name']?.split('-')[0] ?? '';

  if (!id) return null;

  const movieDetails = await tmdbClient.getMovieDetails(id);
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const movieId = movieDetails?.id ? String(movieDetails.id) : '';
  const movieTitle = movieDetails?.title ?? '';

  return (
    <PageAnimationWrapper className='mt-[calc(var(--header-height-mobile)+1rem)] flex flex-col gap-y-8 px-4 sm:px-8 lg:grid lg:grid-cols-[30%_70%] lg:gap-y-0 lg:px-16'>
      <section className='relative mx-auto mt-4 aspect-[2/3] w-[14rem] sm:w-[16rem] lg:mx-4 lg:w-full lg:max-w-[20rem]'>
        <Image
          className='rounded-lg'
          src={CommonMethods.getTheMovieDbImage(movieDetails?.poster_path)}
          alt={movieDetails?.title ?? ''}
          fill
          priority
          sizes='(max-width: 768px) 100vw, 30vw'
        />
      </section>

      <section className='mt-4 flex flex-col'>
        <h1 className='mb-2 text-3xl font-bold sm:text-4xl'>{movieDetails?.title}</h1>
        <section className='mb-6 mt-4 flex items-center'>
          <section className='h-[4rem] w-[4rem] sm:h-[5rem] sm:w-[5rem]'>
            <RoundProgressBar percentageVal={+(movieDetails?.vote_average ?? 0).toFixed(1) * 10} />
          </section>
          <p className='ml-4 text-sm font-medium sm:text-base'>
            {commaNumber(movieDetails?.vote_count ?? 0)} voted users
          </p>
        </section>

        <MovieActions
          movieId={movieId}
          movieTitle={movieTitle}
          movieImage={
            movieDetails?.poster_path
              ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
              : null
          }
        />

        <section className='mt-6 pb-8 lg:pb-32'>
          <h4 className='my-4'>{movieDetails?.tagline}</h4>
          <p>{movieDetails?.overview}</p>
        </section>
      </section>

      <section className='my-4 lg:ml-8'>
        <h3 className='mb-4 underline underline-offset-4'>Details</h3>
        <h4>Runtime</h4>
        <p className='ml-1'>{movieDetails?.runtime} minutes</p>
        <h4 className='mt-4'>Status</h4>
        <p className='ml-1'>{movieDetails?.status}</p>
        <h4 className='mt-4'>Release Date</h4>
        {movieDetails?.release_date ? (
          <p className='ml-1'>{CommonMethods.formatDate(movieDetails.release_date)}</p>
        ) : (
          <p className='ml-1'>N/A</p>
        )}
        <h4 className='mt-4'>Genre(s)</h4>
        <div className='ml-1'>
          {movieDetails?.genres?.map((genre: any, idx: number) => <p key={idx}>{genre.name}</p>)}
        </div>
        <h4 className='mt-4'>Original Language</h4>
        <p className='ml-1'>
          {movieDetails?.original_language ? getEnglishName(movieDetails.original_language) : ''}
        </p>
        {movieDetails?.homepage && movieDetails.homepage.length > 0 && (
          <>
            <h4 className='mt-4'>Official Page</h4>
            <Link
              href={movieDetails.homepage}
              className='ml-1 underline'
              target='_blank'
              rel='noopener noreferrer'
            >
              Learn More
            </Link>
          </>
        )}
      </section>

      <section className='mt-4 lg:col-start-2'>
        {movieDetails?.belongs_to_collection && (
          <Suspense fallback={null}>
            <FranchiseTracker
              collectionId={movieDetails.belongs_to_collection.id}
              userId={userId}
              currentMovieId={movieDetails.id}
            />
          </Suspense>
        )}
        <Suspense key='cast' fallback={<HorizontalScrollerSkeleton />}>
          <MovieCastServer movieId={id} />
        </Suspense>

        <Suspense key='related' fallback={<HorizontalScrollerSkeleton />}>
          <MovieRelatedServer movieId={id} />
        </Suspense>

        <section className='mt-16 pb-16'>
          <ReviewSection
            mediaType='MOVIE'
            mediaId={movieId}
            mediaTitle={movieTitle}
            mediaImage={movieDetails?.poster_path}
          />
        </section>
      </section>
    </PageAnimationWrapper>
  );
}
