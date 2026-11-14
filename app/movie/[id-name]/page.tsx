import Image from 'next/image';
import Link from 'next/link';
import RoundProgressBar from '@/components/RoundProgressBar';
import commaNumber from 'comma-number';
import { getEnglishName } from 'all-iso-language-codes';
import { CommonMethods } from '@/utils/CommonMethods';
import { CLIENT_BASE_URL } from '@/utils/constants';
import { tmdbClient } from '@/lib/api';
import MovieActions from './MovieActions';
import PageAnimationWrapper from '@/components/PageAnimationWrapper';
import { Suspense } from 'react';
import HorizontalScrollerSkeleton from '@/components/Skeletons/HorizontalScrollerSkeleton';
import MovieCastServer from '@/components/movie/MovieCastServer';
import MovieRelatedClient from '@/components/movie/MovieRelatedClient';
import ReviewSection from '@/components/Reviews/ReviewSection';
import FranchiseTracker from '@/components/movie/FranchiseTracker';
import WatchProviders from '@/components/Media/WatchProviders';
import { WatchTrailerButton } from '@/components/Media/TrailerModal';

import { Metadata } from 'next';

export const revalidate = 3600;

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
  const backdropUrl = movieDetails?.backdrop_path
    ? (CommonMethods.getTheMovieDbImage(movieDetails.backdrop_path) as string)
    : '';

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || CLIENT_BASE_URL;
  const ogUrl = new URL(`${baseUrl}/api/og`);
  ogUrl.searchParams.set('title', movieDetails?.title || 'Movie');
  if (posterUrl) ogUrl.searchParams.set('poster', posterUrl);
  if (backdropUrl) ogUrl.searchParams.set('backdrop', backdropUrl);
  if (movieDetails?.release_date) {
    ogUrl.searchParams.set('year', movieDetails.release_date.split('-')[0]);
  }
  if (movieDetails?.genres && movieDetails.genres.length > 0) {
    ogUrl.searchParams.set(
      'genres',
      movieDetails.genres
        .slice(0, 3)
        .map((g: any) => g.name)
        .join(' • ')
    );
  }
  if (movieDetails?.tagline) {
    ogUrl.searchParams.set('tagline', movieDetails.tagline);
  }
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
    twitter: {
      card: 'summary_large_image',
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

  const [movieDetails, watchProviders, videosData] = await Promise.all([
    tmdbClient.getMovieDetails(id),
    tmdbClient.getMovieWatchProviders(id).catch(() => null),
    tmdbClient.getMovieVideos(id).catch(() => null),
  ]);

  const movieId = movieDetails?.id ? String(movieDetails.id) : '';
  const movieTitle = movieDetails?.title ?? '';

  return (
    <div className='relative w-full overflow-hidden'>
      {/* Cinematic Ambient Backdrop Glow */}
      {movieDetails?.backdrop_path && (
        <div className='pointer-events-none absolute -top-12 left-0 right-0 -z-10 h-[480px] overflow-hidden opacity-25 blur-3xl dark:opacity-20'>
          <Image
            src={CommonMethods.getTheMovieDbImage(movieDetails.backdrop_path)}
            alt=''
            fill
            className='scale-110 object-cover object-top'
            priority={false}
          />
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background' />
        </div>
      )}

      <PageAnimationWrapper className='mt-[calc(var(--header-height-mobile)+1rem)] flex flex-col gap-8 px-4 sm:px-8 lg:flex-row lg:gap-10 lg:px-16'>
        {/* Left Sidebar: Poster + Where to Watch + Details */}
        <aside className='flex w-full flex-col gap-5 lg:w-[280px] lg:shrink-0 xl:w-[320px]'>
          <section className='group relative mx-auto aspect-[2/3] w-[14rem] sm:w-[16rem] lg:w-full'>
            <Image
              className='rounded-2xl object-cover shadow-2xl ring-1 ring-white/10'
              src={CommonMethods.getTheMovieDbImage(movieDetails?.poster_path)}
              alt={movieDetails?.title ?? ''}
              fill
              priority
              sizes='(max-width: 768px) 100vw, 320px'
            />
          </section>

          {/* Where to Watch / Streaming Providers */}
          <WatchProviders mediaType='MOVIE' mediaId={movieId} initialData={watchProviders} />

          {/* Movie Details Card */}
          <div className='rounded-2xl border border-border/60 bg-card/30 p-5 shadow-sm backdrop-blur-sm'>
            <h3 className='mb-4 text-base font-bold text-foreground'>Movie Details</h3>
            <dl className='space-y-3.5 text-sm'>
              <div>
                <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                  Runtime
                </dt>
                <dd className='mt-0.5 font-semibold text-foreground'>
                  {movieDetails?.runtime ? `${movieDetails.runtime} minutes` : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                  Status
                </dt>
                <dd className='mt-0.5 font-semibold text-foreground'>
                  {movieDetails?.status || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                  Release Date
                </dt>
                <dd className='mt-0.5 font-semibold text-foreground'>
                  {movieDetails?.release_date
                    ? CommonMethods.formatDate(movieDetails.release_date)
                    : 'N/A'}
                </dd>
              </div>
              {movieDetails?.genres && movieDetails.genres.length > 0 && (
                <div>
                  <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                    Genre(s)
                  </dt>
                  <dd className='mt-1 flex flex-wrap gap-1.5'>
                    {movieDetails.genres.map((genre: any, idx: number) => (
                      <span
                        key={idx}
                        className='rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-xs text-foreground'
                      >
                        {genre.name}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                  Original Language
                </dt>
                <dd className='mt-0.5 font-semibold text-foreground'>
                  {movieDetails?.original_language
                    ? getEnglishName(movieDetails.original_language)
                    : 'N/A'}
                </dd>
              </div>
              {movieDetails?.homepage && movieDetails.homepage.length > 0 && (
                <div>
                  <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                    Official Page
                  </dt>
                  <dd className='mt-0.5 truncate text-xs'>
                    <Link
                      href={movieDetails.homepage}
                      target='_blank'
                      rel='noreferrer'
                      className='text-primary hover:underline'
                    >
                      {movieDetails.homepage}
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>

        {/* Right Main Content */}
        <div className='flex min-w-0 flex-1 flex-col gap-6'>
          {/* Header & Actions */}
          <section className='flex flex-col'>
            <h1 className='mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
              {movieDetails?.title}
            </h1>
            <section className='mb-5 mt-3 flex flex-wrap items-center justify-between gap-4'>
              <div className='flex items-center gap-3.5'>
                <section className='h-[4rem] w-[4rem] drop-shadow-md sm:h-[4.5rem] sm:w-[4.5rem]'>
                  <RoundProgressBar
                    percentageVal={+(movieDetails?.vote_average ?? 0).toFixed(1) * 10}
                  />
                </section>
                <div className='flex flex-col'>
                  <span className='text-sm font-semibold text-foreground sm:text-base'>
                    {commaNumber(movieDetails?.vote_count ?? 0)} votes
                  </span>
                  <span className='text-xs text-muted-foreground'>Community Rating</span>
                </div>
              </div>

              {/* Watch Trailer Button in Hero */}
              <WatchTrailerButton
                mediaTitle={movieTitle}
                mediaType='MOVIE'
                mediaId={movieId}
                initialVideos={videosData?.results}
                variant='hero'
              />
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

            <section className='mt-6 space-y-3'>
              {movieDetails?.tagline && (
                <p className='text-lg font-medium italic text-primary/90'>
                  &ldquo;{movieDetails.tagline}&rdquo;
                </p>
              )}
              {movieDetails?.overview && (
                <div>
                  <h3 className='mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    Overview
                  </h3>
                  <p className='max-w-3xl text-sm leading-relaxed text-foreground/85 sm:text-base'>
                    {movieDetails.overview}
                  </p>
                </div>
              )}
            </section>
          </section>

          {/* Franchise Tracker */}
          {movieDetails?.belongs_to_collection && (
            <Suspense fallback={null}>
              <FranchiseTracker
                collectionId={movieDetails.belongs_to_collection.id}
                currentMovieId={movieDetails.id}
              />
            </Suspense>
          )}

          {/* Cast */}
          <Suspense key='cast' fallback={<HorizontalScrollerSkeleton />}>
            <MovieCastServer movieId={id} />
          </Suspense>

          {/* Related */}
          <MovieRelatedClient movieId={id} />

          {/* Reviews */}
          <section className='mt-8 pb-16'>
            <ReviewSection
              mediaType='MOVIE'
              mediaId={movieId}
              mediaTitle={movieTitle}
              mediaImage={movieDetails?.poster_path}
            />
          </section>
        </div>
      </PageAnimationWrapper>
    </div>
  );
}
