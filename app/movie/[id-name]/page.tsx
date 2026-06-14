import Image from 'next/image';
import Link from 'next/link';
import RoundProgressBar from '@/components/RoundProgressBar';
import commaNumber from 'comma-number';
import { getEnglishName } from 'all-iso-language-codes';
import { CommonMethods } from '@/utils/CommonMethods';
import _ from 'lodash';
import { RESULTS_PER_PAGE } from '@/utils/constants';
import RelatedHorizontalScroller from '@/components/HorizontalScroller/Related/RelatedHorizontalScroller';
import MediaCastHorizontalScroller from '@/components/HorizontalScroller/MediaCast/MediaCastHorizontalScroller';
import { tmdbClient } from '@/lib/api';
import MovieActions from './MovieActions';
import PageAnimationWrapper from '@/components/PageAnimationWrapper';
import { ICast } from '@ts/interfaces';

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
  const images = movieDetails?.poster_path
    ? [CommonMethods.getTheMovieDbImage(movieDetails.poster_path) as string]
    : [];

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

  const [movieDetails, moviesCastCrew, recMovies] = await Promise.all([
    tmdbClient.getMovieDetails(id),
    tmdbClient.getMovieCredits(id),
    tmdbClient.getRecommendedMovies(id),
  ]);

  const movieId = movieDetails?.id ? String(movieDetails.id) : '';
  const movieTitle = movieDetails?.title ?? '';

  return (
    <PageAnimationWrapper className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
      <section className='aspect-h-16 aspect-w-16 relative mx-4 mt-4'>
        <Image
          className='rounded-lg'
          src={CommonMethods.getTheMovieDbImage(movieDetails?.poster_path)}
          alt={movieDetails?.title ?? ''}
          fill
          sizes='100vw'
        />
      </section>

      <section className='mt-4'>
        <section className='mb-8 mt-8 flex items-center'>
          <section className='h-[5rem] w-[5rem]'>
            <RoundProgressBar percentageVal={+(movieDetails?.vote_average ?? 0).toFixed(1) * 10} />
          </section>
          <p className='ml-[.5rem] text-base font-medium'>
            {commaNumber(movieDetails?.vote_count ?? 0)} voted users
          </p>
        </section>

        <MovieActions movieId={movieId} movieTitle={movieTitle} />

        <section className='pb-32'>
          <h1>{movieDetails?.title}</h1>
          <h4 className='my-4'>{movieDetails?.tagline}</h4>
          <p>{movieDetails?.overview}</p>
        </section>
      </section>

      <section className='my-4 ml-8'>
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

      <section className='col-start-2 mt-4'>
        {moviesCastCrew?.cast?.length > 0 && (
          <section>
            <h3 className='mb-4 ml-8'>Cast</h3>
            <MediaCastHorizontalScroller
              items={
                moviesCastCrew.cast
                  .map((cast: any) => ({
                    id: cast.id,
                    name: cast.name,
                    character: cast.character,
                    profile_path: cast.profile_path,
                    type: 'character',
                  }))
                  .slice(0, RESULTS_PER_PAGE) as ICast[]
              }
            />
          </section>
        )}

        {recMovies?.results && !_.isEmpty(recMovies.results) && (
          <section className='pb-4'>
            <h3 className='mb-4 ml-8 mt-4'>Recommended Movies</h3>
            <RelatedHorizontalScroller
              items={recMovies.results.map((movie: any) => ({
                id: movie.id,
                imagePath: movie.poster_path,
                name: movie.title,
                popularity: movie.popularity ?? 0,
                type: 'movie',
              }))}
              mediaType={'movies'}
            />
          </section>
        )}
      </section>
    </PageAnimationWrapper>
  );
}
