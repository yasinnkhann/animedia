import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import RoundProgressBar from '../../components/RoundProgressBar';
import { Circles } from 'react-loading-icons';
import commaNumber from 'comma-number';
import { useSession } from 'next-auth/react';
import { ICast } from '@ts/interfaces';
import { watchStatusOptions, ratingOptions } from 'models/dropDownOptions';
import { getEnglishName } from 'all-iso-language-codes';
import { CommonMethods } from '../../utils/CommonMethods';
import { useMutation, useQuery } from '@apollo/client';
import { WatchStatusTypes } from 'graphql/generated/code-gen/graphql';
import _ from 'lodash';
import { RESULTS_PER_PAGE } from 'utils/constants';
import { IoMdArrowDropdown } from 'react-icons/io';
import RelatedHorizontalScroller from '../../components/HorizontalScroller/Related/RelatedHorizontalScroller';
import MediaCastHorizontalScroller from 'components/HorizontalScroller/MediaCast/MediaCastHorizontalScroller';

const MovieDetails = () => {
	const { data: session, status } = useSession();

	const router = useRouter();

	const [watchStatus, setWatchStatus] = useState<WatchStatusTypes>(WatchStatusTypes.NotWatching);

	const [rating, setRating] = useState<number | string>(ratingOptions[0].value);

	const id = (router.query?.['id-name'] as string)?.split('-')[0] ?? '';

	const { data: movieDetailsData, loading: movieDetailsLoading } = useQuery(Queries.MOVIE_DETAILS, {
		skip: !id,
		variables: {
			movieDetailsId: id,
		},
		fetchPolicy: 'network-only',
	});

	const { data: usersMovieData, loading: usersMovieLoading } = useQuery(Queries.USERS_MOVIE, {
		skip: !movieDetailsData?.movieDetails.id,
		variables: {
			movieId: String(movieDetailsData?.movieDetails.id!),
		},
		fetchPolicy: 'network-only',
	});

	const { data: recMoviesData, loading: recMoviesLoading } = useQuery(Queries.RECOMMENDED_MOVIES, {
		skip: !movieDetailsData?.movieDetails.id,
		variables: {
			recommendedMoviesId: movieDetailsData?.movieDetails.id!,
		},
	});

	const { data: moviesCastCrewData, loading: moviesCastCrewLoading } = useQuery(
		Queries.GET_MOVIES_CAST_CREW,
		{
			skip: !movieDetailsData?.movieDetails.id,
			variables: {
				movieId: movieDetailsData?.movieDetails.id!,
			},
		}
	);

	const [addMovie, { loading: addMovieLoading }] = useMutation(Mutations.ADD_MOVIE, {
		variables: {
			movieId: String(movieDetailsData?.movieDetails.id!),
			movieName: movieDetailsData?.movieDetails.title!,
			watchStatus,
		},
		refetchQueries: () => [
			{
				query: Queries.USERS_MOVIE,
				variables: {
					movieId: String(movieDetailsData?.movieDetails.id!),
				},
			},
			'UsersMovie',
		],
	});

	const [updateMovie, { loading: updateMovieLoading }] = useMutation(Mutations.UPDATE_MOVIE, {
		variables: {
			movieId: String(movieDetailsData?.movieDetails?.id!),
			watchStatus,
			movieRating: typeof rating === 'number' ? rating : null,
		},
		refetchQueries: () => [
			{
				query: Queries.USERS_MOVIE,
				variables: {
					movieId: String(movieDetailsData?.movieDetails?.id!),
				},
			},
			'UsersMovie',
		],
	});

	const [deleteMovie, { loading: deleteMovieLoading }] = useMutation(Mutations.DELETE_MOVIE, {
		variables: {
			movieId: String(movieDetailsData?.movieDetails.id!),
		},
		refetchQueries: () => [
			{
				query: Queries.USERS_MOVIE,
				variables: {
					movieId: String(movieDetailsData?.movieDetails.id!),
				},
			},
			'UsersMovie',
		],
	});

	const isDBPending = addMovieLoading || updateMovieLoading || deleteMovieLoading;

	const handleChangeWatchStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;

		setWatchStatus(value as WatchStatusTypes);

		if (usersMovieData?.usersMovie) {
			if ((value as WatchStatusTypes) === WatchStatusTypes.NotWatching) {
				deleteMovie({
					variables: {
						movieId: String(movieDetailsData?.movieDetails?.id!),
					},
				});
			} else if ((value as WatchStatusTypes) === WatchStatusTypes.PlanToWatch) {
				updateMovie({
					variables: {
						movieId: String(movieDetailsData?.movieDetails?.id!),
						watchStatus: value as WatchStatusTypes,
						movieRating: null,
					},
				});
			} else {
				updateMovie({
					variables: {
						movieId: String(movieDetailsData?.movieDetails?.id!),
						watchStatus: value as WatchStatusTypes,
						movieRating: usersMovieData.usersMovie?.rating ?? null,
					},
				});
			}
		} else {
			addMovie({
				variables: {
					movieId: String(movieDetailsData?.movieDetails?.id!),
					movieName: movieDetailsData?.movieDetails?.title!,
					watchStatus: value as WatchStatusTypes,
				},
			});
		}
	};

	const handleChangeRating = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		setRating(value === '' ? '' : +value);

		updateMovie({
			variables: {
				movieId: String(movieDetailsData?.movieDetails!.id!),
				movieRating: isNaN(parseInt(value)) ? null : parseInt(value),
				watchStatus,
			},
		});
	};

	useEffect(() => {
		if (usersMovieLoading) return;

		if (usersMovieData?.usersMovie?.status) {
			setWatchStatus(usersMovieData.usersMovie.status);
			setRating(usersMovieData.usersMovie.rating ?? '');
		} else {
			setWatchStatus(WatchStatusTypes.NotWatching);
			setRating('');
		}
	}, [usersMovieData, usersMovieLoading]);

	if (movieDetailsLoading || !movieDetailsData?.movieDetails || usersMovieLoading) {
		return (
			<section className='flex h-screen items-center justify-center'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>{movieDetailsData.movieDetails.title}</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
				<section className='aspect-h-16 aspect-w-16 relative mx-4 mt-4'>
					<Image
						className='rounded-lg'
						src={CommonMethods.getTheMovieDbImage(movieDetailsData.movieDetails.poster_path)}
						alt={movieDetailsData.movieDetails.title ?? undefined}
						layout='fill'
					/>
				</section>

				<section className='mt-4'>
					<section className='mb-8 mt-8 flex items-center'>
						<section className='h-[5rem] w-[5rem]'>
							<RoundProgressBar
								percentageVal={+(movieDetailsData.movieDetails.vote_average ?? 0).toFixed(1) * 10}
							/>
						</section>
						<p className='ml-[.5rem] text-base font-medium'>
							{commaNumber(movieDetailsData.movieDetails.vote_count)} voted users
						</p>
					</section>

					{status === 'authenticated' && session && (
						<section className='my-4 flex items-center space-x-4'>
							<div className='relative'>
								<select
									className='appearance-none rounded border border-gray-300 bg-transparent px-2 py-2 pr-8 leading-tight text-gray-700 focus:bg-transparent focus:outline-none'
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
								<IoMdArrowDropdown className='pointer-events-none absolute inset-y-0 right-0 mr-3 mt-3 text-black' />
							</div>

							<div className='relative'>
								<select
									className='appearance-none rounded border border-gray-300 bg-transparent px-2 py-2 pr-8 leading-tight text-gray-700 focus:bg-transparent focus:outline-none'
									value={rating}
									onChange={handleChangeRating}
									disabled={
										watchStatus === 'NOT_WATCHING' || watchStatus === 'PLAN_TO_WATCH' || isDBPending
									}
								>
									{ratingOptions.map(option => (
										<option key={option.value} value={option.value}>
											{option.text}
										</option>
									))}
								</select>
								<IoMdArrowDropdown className='pointer-events-none absolute inset-y-0 right-0 mr-3 mt-3 text-black' />
							</div>
						</section>
					)}

					<section className='pb-32'>
						<h1>{movieDetailsData.movieDetails.title}</h1>
						<h4 className='my-4'>{movieDetailsData.movieDetails.tagline}</h4>
						<p>{movieDetailsData.movieDetails.overview}</p>
					</section>
				</section>

				<section className='my-4 ml-8'>
					<h3 className='mb-4 underline underline-offset-4'>Details</h3>
					<h4>Runtime</h4>
					<p className='ml-1'>{movieDetailsData.movieDetails.runtime} minutes</p>
					<h4 className='mt-4'>Status</h4>
					<p className='ml-1'>{movieDetailsData.movieDetails.status}</p>
					<h4 className='mt-4'>Release Date</h4>
					{movieDetailsData.movieDetails.release_date ? (
						<p className='ml-1'>
							{CommonMethods.formatDate(movieDetailsData.movieDetails.release_date)}
						</p>
					) : (
						<p className='ml-1'>N/A</p>
					)}
					<h4 className='mt-4'>Genre(s)</h4>
					<div className='ml-1'>
						{movieDetailsData.movieDetails.genres.map((genre, idx) => (
							<p key={idx}>{genre.name}</p>
						))}
					</div>
					<h4 className='mt-4'>Original Language</h4>
					<p className='ml-1'>{getEnglishName(movieDetailsData.movieDetails.original_language)}</p>
					{movieDetailsData.movieDetails.homepage.length > 0 && (
						<>
							<h4 className='mt-4'>Official Page</h4>
							<Link href={movieDetailsData.movieDetails.homepage}>
								<a className='ml-1 underline' target='_blank'>
									Learn More
								</a>
							</Link>
						</>
					)}
				</section>

				<section className='col-start-2 mt-4'>
					{!moviesCastCrewLoading &&
						moviesCastCrewData?.moviesCastCrew &&
						!_.isEmpty(moviesCastCrewData.moviesCastCrew.cast) && (
							<section>
								<h3 className='mb-4 ml-8'>Cast</h3>
								<MediaCastHorizontalScroller
									items={
										moviesCastCrewData.moviesCastCrew
											.cast!.map(cast => ({
												id: cast.id,
												name: cast.name,
												character: cast.character,
												profile_path: cast.profile_path,
												type: cast.__typename,
											}))
											.slice(0, RESULTS_PER_PAGE) as ICast[]
									}
								/>
							</section>
						)}

					{!recMoviesLoading &&
						recMoviesData?.recommendedMovies &&
						!_.isEmpty(recMoviesData.recommendedMovies.results) && (
							<section className='pb-4'>
								<h3 className='mb-4 ml-8 mt-4'>Recommended Movies</h3>
								<RelatedHorizontalScroller
									items={recMoviesData.recommendedMovies.results.map(movie => ({
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
			</main>
		</>
	);
};

export default MovieDetails;
