import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import RoundProgressBar from '../../components/RoundProgressBar';
import { Circles } from 'react-loading-icons';
import commaNumber from 'comma-number';
import RecommendedMoviesHorizontalScroller from '../../components/UI/HorizontalScrollerUI/Related/RelatedHorizontalScroller';
import MediaCastHorizontalScroller from '../../components/UI/HorizontalScrollerUI/MediaCast/MediaCastHorizontalScroller';
import { BASE_IMG_URL } from '../../utils/URLs';
import { useSession } from 'next-auth/react';
import { useGQLMutation, useGQLQuery } from '../../hooks/useGQL';
import { ICast } from '@ts/interfaces';
import { watchStatusOptions } from 'models/watchStatusOptions';
import { ratingOptions } from 'models/ratingOptions';
import { getEnglishName } from 'all-iso-language-codes';
import { formatDate } from '../../utils/formatDate';
import {
	NexusGenArgTypes,
	NexusGenObjects,
	NexusGenEnums,
} from '../../graphql/generated/nexus-typegen';

const MovieDetails = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [watchStatus, setWatchStatus] =
		useState<NexusGenEnums['WatchStatusTypes']>('NOT_WATCHING');

	const [rating, setRating] = useState<string | number>(ratingOptions[0].value);

	const id = Number((router.query?.['id-name'] as string)?.split('-')[0]);

	const { data: movieDetailsData, loading: movieDetailsLoading } = useGQLQuery<
		NexusGenObjects['MovieDetailsRes'],
		NexusGenArgTypes['Query']['movieDetails']
	>(Queries.MOVIE_DETAILS, {
		variables: {
			movieDetailsId: id,
		},
		fetchPolicy: 'network-only',
	});

	const { data: usersMovieData, loading: usersMovieLoading } = useGQLQuery<
		NexusGenObjects['UserMovie'],
		NexusGenArgTypes['Query']['usersMovie']
	>(Queries.GET_USERS_MOVIE, {
		variables: {
			movieId: String(movieDetailsData?.id!),
		},
		fetchPolicy: 'network-only',
	});

	const { data: recMoviesData, loading: recMoviesLoading } = useGQLQuery<
		NexusGenObjects['MoviesRes'],
		NexusGenArgTypes['Query']['recommendedMovies']
	>(Queries.RECOMMENDED_MOVIES, {
		variables: {
			recommendedMoviesId: movieDetailsData?.id!,
		},
	});

	const { data: moviesCastCrewData, loading: moviesCastCrewLoading } =
		useGQLQuery<
			NexusGenObjects['MoviesCastCrewRes'],
			NexusGenArgTypes['Query']['moviesCastCrew']
		>(Queries.GET_MOVIES_CAST_CREW, {
			variables: {
				movieId: movieDetailsData?.id!,
			},
		});

	const { mutateFunction: addMovie, mutateLoading: addMovieLoading } =
		useGQLMutation<
			NexusGenObjects['UserMovie'],
			NexusGenArgTypes['Mutation']['addMovie']
		>(Mutations.ADD_MOVIE, {
			variables: {
				movieId: String(movieDetailsData?.id!),
				movieName: movieDetailsData?.title!,
				watchStatus,
			},
			refetchQueries: () => [
				{
					query: Queries.GET_USERS_MOVIE,
					variables: {
						movieId: String(movieDetailsData?.id!),
					},
				},
				'UsersMovie',
			],
		});

	const { mutateFunction: updateMovie, mutateLoading: updateMovieLoading } =
		useGQLMutation<
			NexusGenObjects['UserMovie'],
			NexusGenArgTypes['Mutation']['updateMovie']
		>(Mutations.UPDATE_MOVIE, {
			variables: {
				movieId: String(movieDetailsData?.id!),
				watchStatus,
				movieRating: typeof rating === 'number' ? rating : null,
			},
			refetchQueries: () => [
				{
					query: Queries.GET_USERS_MOVIE,
					variables: {
						movieId: String(movieDetailsData?.id!),
					},
				},
				'UsersMovie',
			],
		});

	const { mutateFunction: deleteMovie, mutateLoading: deleteMovieLoading } =
		useGQLMutation<
			NexusGenObjects['UserMovie'],
			NexusGenArgTypes['Mutation']['deleteMovie']
		>(Mutations.DELETE_MOVIE, {
			variables: {
				movieId: String(movieDetailsData?.id!),
			},
			refetchQueries: () => [
				{
					query: Queries.GET_USERS_MOVIE,
					variables: {
						movieId: String(movieDetailsData?.id!),
					},
				},
				'UsersMovie',
			],
		});

	const isDBPending =
		addMovieLoading || updateMovieLoading || deleteMovieLoading;

	const handleChangeWatchStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;

		setWatchStatus(value as NexusGenEnums['WatchStatusTypes']);

		if (usersMovieData) {
			if ((value as NexusGenEnums['WatchStatusTypes']) === 'NOT_WATCHING') {
				deleteMovie({
					variables: {
						movieId: String(movieDetailsData?.id!),
					},
				});
			} else {
				updateMovie({
					variables: {
						movieId: String(movieDetailsData?.id!),
						watchStatus: value as NexusGenEnums['WatchStatusTypes'],
					},
				});
			}
		} else {
			addMovie({
				variables: {
					movieId: String(movieDetailsData?.id!),
					movieName: movieDetailsData?.title!,
					watchStatus: value as NexusGenEnums['WatchStatusTypes'],
				},
			});
		}
	};

	const handleChangeRating = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		setRating(isNaN(parseInt(value)) ? '' : parseInt(value));

		updateMovie({
			variables: {
				movieId: String(movieDetailsData!.id),
				movieRating: isNaN(parseInt(value)) ? null : parseInt(value),
				watchStatus,
			},
		});
	};

	useEffect(() => {
		if (!usersMovieLoading) {
			if (usersMovieData) {
				setWatchStatus(usersMovieData.status!);
				setRating(usersMovieData.rating ?? '');
			} else {
				setWatchStatus('NOT_WATCHING');
				setRating('');
			}
		}
	}, [usersMovieData, usersMovieLoading]);

	if (movieDetailsLoading || !movieDetailsData) {
		return (
			<section className='flex justify-center items-center h-screen'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>{movieDetailsData.title}</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
				<section className='relative mx-4 mt-4 aspect-w-16 aspect-h-16'>
					<Image
						className='rounded-lg'
						src={BASE_IMG_URL + movieDetailsData.poster_path}
						alt={movieDetailsData.title ?? undefined}
						layout='fill'
					/>
				</section>

				<section className='mt-4'>
					<section className='flex items-center mb-8 mt-8'>
						<section className='h-[5rem] w-[5rem]'>
							<RoundProgressBar
								percentageVal={+movieDetailsData.vote_average.toFixed(1) * 10}
							/>
						</section>
						<p className='ml-[.5rem] font-medium text-base'>
							{commaNumber(movieDetailsData.vote_count)} voted users
						</p>
					</section>

					{status === 'authenticated' && session && (
						<section className='my-4 h-[1.5rem]'>
							<select
								className='mr-4 h-full rounded outline-none'
								value={watchStatus}
								onChange={handleChangeWatchStatus}
								disabled={isDBPending}
							>
								{watchStatusOptions.map(option => (
									<option key={option.value} value={option.value}>
										{option.text}
									</option>
								))}
							</select>

							<select
								className='h-full rounded outline-none'
								value={rating}
								onChange={handleChangeRating}
								disabled={
									watchStatus === 'NOT_WATCHING' ||
									watchStatus === 'PLAN_TO_WATCH' ||
									isDBPending
								}
							>
								{ratingOptions.map(option => (
									<option key={option.value} value={option.value}>
										{option.text}
									</option>
								))}
							</select>
						</section>
					)}

					<section className='pb-32'>
						<h1>{movieDetailsData.title}</h1>
						<h4 className='my-4'>{movieDetailsData.tagline}</h4>
						<p>{movieDetailsData.overview}</p>
					</section>
				</section>

				<section className='ml-8 my-4'>
					<h3 className='mb-4 underline underline-offset-4'>Details</h3>
					<h4>Runtime</h4>
					<p className='ml-1'>{movieDetailsData.runtime} minutes</p>
					<h4 className='mt-4'>Status</h4>
					<p className='ml-1'>{movieDetailsData.status}</p>
					<h4 className='mt-4'>Release Date</h4>
					{movieDetailsData.release_date ? (
						<p className='ml-1'>{formatDate(movieDetailsData.release_date)}</p>
					) : (
						<p className='ml-1'>N/A</p>
					)}
					<h4 className='mt-4'>Genre(s)</h4>
					<div className='ml-1'>
						{movieDetailsData.genres.map((genre, idx) => (
							<p key={idx}>{genre.name}</p>
						))}
					</div>
					<h4 className='mt-4'>Original Language</h4>
					<p className='ml-1'>
						{getEnglishName(movieDetailsData.original_language)}
					</p>
					{movieDetailsData.homepage.length > 0 && (
						<>
							<h4 className='mt-4'>Official Page</h4>
							<Link href={movieDetailsData.homepage}>
								<a className='underline ml-1' target='_blank'>
									Learn More
								</a>
							</Link>
						</>
					)}
				</section>

				<section className='col-start-2 mt-4'>
					{!moviesCastCrewLoading && moviesCastCrewData?.cast?.length! > 0 && (
						<section>
							<h3 className='mb-4 ml-8'>Cast</h3>
							<MediaCastHorizontalScroller
								items={
									moviesCastCrewData?.cast
										?.map(cast => ({
											id: cast!.id,
											name: cast!.name,
											character: cast!.character,
											profile_path: cast!.profile_path,
										}))
										.slice(0, 20) as ICast[]
								}
							/>
						</section>
					)}

					{!recMoviesLoading && recMoviesData?.results?.length! > 0 && (
						<section className='pb-4'>
							<h3 className='mb-4 ml-8 mt-4'>Recommended Movies</h3>
							<RecommendedMoviesHorizontalScroller
								items={recMoviesData!.results.map(movie => ({
									id: movie.id,
									poster_path: movie.poster_path,
									title: movie.title,
									popularity: movie.popularity,
								}))}
							/>
						</section>
					)}
				</section>
			</main>
		</>
	);
};

export default MovieDetails;
