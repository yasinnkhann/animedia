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
import RelatedHorizontalScroller from '../../components/UI/HorizontalScrollerUI/Related/RelatedHorizontalScroller';
import MediaCastHorizontalScroller from '../../components/UI/HorizontalScrollerUI/MediaCast/MediaCastHorizontalScroller';
import { useSession } from 'next-auth/react';
import { ICast } from '@ts/interfaces';
import { watchStatusOptions, ratingOptions } from 'models/dropDownOptions';
import { getEnglishName } from 'all-iso-language-codes';
import { formatDate } from '../../utils/formatDate';
import { useMutation, useQuery } from '@apollo/client';
import { WatchStatusTypes } from 'graphql/generated/code-gen/graphql';
import { getImage } from 'utils/getImage';
import _ from 'lodash';

const MovieDetails = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [watchStatus, setWatchStatus] = useState<WatchStatusTypes>(
		WatchStatusTypes.NotWatching
	);

	const [rating, setRating] = useState<string | number>(ratingOptions[0].value);

	const id = Number((router.query?.['id-name'] as string)?.split('-')[0]);

	const { data: movieDetailsData, loading: movieDetailsLoading } = useQuery(
		Queries.MOVIE_DETAILS,
		{
			skip: isNaN(id),
			variables: {
				movieDetailsId: id,
			},
			fetchPolicy: 'network-only',
		}
	);

	const { data: usersMovieData, loading: usersMovieLoading } = useQuery(
		Queries.GET_USERS_MOVIE,
		{
			skip: !movieDetailsData?.movieDetails.id,
			variables: {
				movieId: String(movieDetailsData?.movieDetails.id!),
			},
			fetchPolicy: 'network-only',
		}
	);

	const { data: recMoviesData, loading: recMoviesLoading } = useQuery(
		Queries.RECOMMENDED_MOVIES,
		{
			skip: !movieDetailsData?.movieDetails.id,
			variables: {
				recommendedMoviesId: movieDetailsData?.movieDetails.id!,
			},
		}
	);

	const { data: moviesCastCrewData, loading: moviesCastCrewLoading } = useQuery(
		Queries.GET_MOVIES_CAST_CREW,
		{
			skip: !movieDetailsData?.movieDetails.id,
			variables: {
				movieId: movieDetailsData?.movieDetails.id!,
			},
		}
	);

	const [addMovie, { loading: addMovieLoading }] = useMutation(
		Mutations.ADD_MOVIE,
		{
			variables: {
				movieId: String(movieDetailsData?.movieDetails.id!),
				movieName: movieDetailsData?.movieDetails.title!,
				watchStatus,
			},
			refetchQueries: () => [
				{
					query: Queries.GET_USERS_MOVIE,
					variables: {
						movieId: String(movieDetailsData?.movieDetails.id!),
					},
				},
				'UsersMovie',
			],
		}
	);

	const [updateMovie, { loading: updateMovieLoading }] = useMutation(
		Mutations.UPDATE_MOVIE,
		{
			variables: {
				movieId: String(movieDetailsData?.movieDetails?.id!),
				watchStatus,
				movieRating: typeof rating === 'number' ? rating : null,
			},
			refetchQueries: () => [
				{
					query: Queries.GET_USERS_MOVIE,
					variables: {
						movieId: String(movieDetailsData?.movieDetails?.id!),
					},
				},
				'UsersMovie',
			],
		}
	);

	const [deleteMovie, { loading: deleteMovieLoading }] = useMutation(
		Mutations.DELETE_MOVIE,
		{
			variables: {
				movieId: String(movieDetailsData?.movieDetails.id!),
			},
			refetchQueries: () => [
				{
					query: Queries.GET_USERS_MOVIE,
					variables: {
						movieId: String(movieDetailsData?.movieDetails.id!),
					},
				},
				'UsersMovie',
			],
		}
	);

	const isDBPending =
		addMovieLoading || updateMovieLoading || deleteMovieLoading;

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
		setRating(isNaN(parseInt(value)) ? '' : parseInt(value));

		updateMovie({
			variables: {
				movieId: String(movieDetailsData?.movieDetails!.id!),
				movieRating: isNaN(parseInt(value)) ? null : parseInt(value),
				watchStatus,
			},
		});
	};

	useEffect(() => {
		if (!usersMovieLoading) {
			if (usersMovieData?.usersMovie) {
				setWatchStatus(usersMovieData?.usersMovie?.status!);
				setRating(usersMovieData?.usersMovie?.rating ?? '');
			} else {
				setWatchStatus(WatchStatusTypes.NotWatching);
				setRating('');
			}
		}
	}, [usersMovieData, usersMovieLoading]);

	if (
		movieDetailsLoading ||
		!movieDetailsData?.movieDetails ||
		usersMovieLoading
	) {
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
				<section className='aspect-w-16 aspect-h-16 relative mx-4 mt-4'>
					<Image
						className='rounded-lg'
						src={getImage(movieDetailsData.movieDetails.poster_path)}
						alt={movieDetailsData.movieDetails.title ?? undefined}
						layout='fill'
					/>
				</section>

				<section className='mt-4'>
					<section className='mb-8 mt-8 flex items-center'>
						<section className='h-[5rem] w-[5rem]'>
							<RoundProgressBar
								percentageVal={
									+movieDetailsData.movieDetails.vote_average.toFixed(1) * 10
								}
							/>
						</section>
						<p className='ml-[.5rem] text-base font-medium'>
							{commaNumber(movieDetailsData.movieDetails.vote_count)} voted
							users
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
						<h1>{movieDetailsData.movieDetails.title}</h1>
						<h4 className='my-4'>{movieDetailsData.movieDetails.tagline}</h4>
						<p>{movieDetailsData.movieDetails.overview}</p>
					</section>
				</section>

				<section className='my-4 ml-8'>
					<h3 className='mb-4 underline underline-offset-4'>Details</h3>
					<h4>Runtime</h4>
					<p className='ml-1'>
						{movieDetailsData.movieDetails.runtime} minutes
					</p>
					<h4 className='mt-4'>Status</h4>
					<p className='ml-1'>{movieDetailsData.movieDetails.status}</p>
					<h4 className='mt-4'>Release Date</h4>
					{movieDetailsData.movieDetails.release_date ? (
						<p className='ml-1'>
							{formatDate(movieDetailsData.movieDetails.release_date)}
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
					<p className='ml-1'>
						{getEnglishName(movieDetailsData.movieDetails.original_language)}
					</p>
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
						moviesCastCrewData?.moviesCastCrew?.cast && (
							<section>
								<h3 className='mb-4 ml-8'>Cast</h3>
								<MediaCastHorizontalScroller
									items={
										moviesCastCrewData?.moviesCastCrew?.cast
											.map(cast => ({
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

					{!recMoviesLoading &&
						!_.isEmpty(recMoviesData?.recommendedMovies?.results) && (
							<section className='pb-4'>
								<h3 className='mb-4 ml-8 mt-4'>Recommended Movies</h3>
								<RelatedHorizontalScroller
									items={recMoviesData!.recommendedMovies.results.map(
										movie => ({
											id: movie.id,
											poster_path: movie.poster_path,
											title: movie.title,
											popularity: movie.popularity,
										})
									)}
								/>
							</section>
						)}
				</section>
			</main>
		</>
	);
};

export default MovieDetails;
