import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import RoundProgressBar from '../../components/RoundProgressBar';
import { Circles } from 'react-loading-icons';
import commaNumber from 'comma-number';
import RecommendedMoviesHorizontalScroller from '../../components/UI/HorizontalScrollerUI/KnownForHorizontalScroller';
import MediaCastHorizontalScroller from '../../components/UI/HorizontalScrollerUI/MediaCastHorizontalScroller';
import { BASE_IMG_URL } from '../../utils/URLs';
import { useSession } from 'next-auth/react';
import { useGQLMutation, useGQLQuery } from '../../hooks/useGQL';
import { IUseGQLQuery, IUseGQLMutation, ICast } from '@ts/interfaces';
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

	const recMoviesContainerRef = useRef<HTMLElement>(null);
	const movieCastContainerRef = useRef<HTMLElement>(null);

	const [watchStatus, setWatchStatus] =
		useState<NexusGenEnums['WatchStatusTypes']>('NOT_WATCHING');

	const [rating, setRating] = useState<string | number>(ratingOptions[0].value);

	const id = Number((router.query?.['id-name'] as string)?.split('-')[0]);

	const {
		data: movieDetailsData,
		loading: movieDetailsLoading,
	}: IUseGQLQuery<
		NexusGenObjects['MovieDetailsRes'],
		NexusGenArgTypes['Query']['movieDetails']
	> = useGQLQuery<NexusGenArgTypes['Query']['movieDetails']>(
		Queries.QUERY_MOVIE_DETAILS,
		{
			variables: {
				movieDetailsId: id,
			},
			fetchPolicy: 'network-only',
		}
	);

	const {
		data: usersMovieData,
		loading: usersMovieLoading,
	}: IUseGQLQuery<
		NexusGenObjects['UserMovie'],
		NexusGenArgTypes['Query']['usersMovie']
	> = useGQLQuery<NexusGenArgTypes['Query']['usersMovie']>(
		Queries.QUERY_GET_USERS_MOVIE,
		{
			variables: {
				movieId: String(movieDetailsData?.id),
			},
			fetchPolicy: 'network-only',
		}
	);

	const {
		data: recMoviesData,
		loading: recMoviesLoading,
	}: IUseGQLQuery<
		NexusGenObjects['MoviesRes'],
		NexusGenArgTypes['Query']['recommendedMovies']
	> = useGQLQuery<NexusGenArgTypes['Query']['recommendedMovies']>(
		Queries.QUERY_RECOMMENDED_MOVIES,
		{
			variables: {
				recommendedMoviesId: movieDetailsData?.id!,
			},
		}
	);

	const {
		data: moviesCastCrewData,
		loading: moviesCastCrewLoading,
	}: IUseGQLQuery<
		NexusGenObjects['MoviesCastCrewRes'],
		NexusGenArgTypes['Query']['moviesCastCrew']
	> = useGQLQuery<NexusGenArgTypes['Query']['moviesCastCrew']>(
		Queries.QUERY_GET_MOVIES_CAST_CREW,
		{
			variables: {
				movieId: movieDetailsData?.id!,
			},
		}
	);

	const {
		mutateFunction: addMovie,
		mutateLoading: addMovieLoading,
	}: IUseGQLMutation<
		NexusGenObjects['UserMovie'],
		NexusGenArgTypes['Mutation']['addedMovie']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['addedMovie']>(
		Mutations.MUTATION_ADD_MOVIE,
		{
			variables: {
				movieId: String(movieDetailsData?.id),
				movieName: movieDetailsData?.title!,
				watchStatus,
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_MOVIE,
					variables: {
						movieId: String(movieDetailsData?.id),
					},
				},
				'UsersMovie',
			],
		}
	);

	const {
		mutateFunction: updateMovie,
		mutateLoading: updateMovieLoading,
	}: IUseGQLMutation<
		NexusGenObjects['UserMovie'],
		NexusGenArgTypes['Mutation']['updatedMovie']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['updatedMovie']>(
		Mutations.MUTATION_UPDATE_MOVIE,
		{
			variables: {
				movieId: String(movieDetailsData?.id),
				watchStatus,
				movieRating: typeof rating === 'number' ? rating : null,
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_MOVIE,
					variables: {
						movieId: String(movieDetailsData?.id),
					},
				},
				'UsersMovie',
			],
		}
	);

	const {
		mutateFunction: deleteMovie,
		mutateLoading: deleteMovieLoading,
	}: IUseGQLMutation<
		NexusGenObjects['UserMovie'],
		NexusGenArgTypes['Mutation']['deletedMovie']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['deletedMovie']>(
		Mutations.MUTATION_DELETE_MOVIE,
		{
			variables: {
				movieId: String(movieDetailsData?.id),
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_MOVIE,
					variables: {
						movieId: String(movieDetailsData?.id),
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

		setWatchStatus(value as NexusGenEnums['WatchStatusTypes']);

		if (usersMovieData) {
			if ((value as NexusGenEnums['WatchStatusTypes']) === 'NOT_WATCHING') {
				deleteMovie({
					variables: {
						movieId: String(movieDetailsData?.id),
					},
				});
			} else {
				updateMovie({
					variables: {
						movieId: String(movieDetailsData?.id),
						watchStatus: value as NexusGenEnums['WatchStatusTypes'],
					},
				});
			}
		} else {
			addMovie({
				variables: {
					movieId: String(movieDetailsData?.id),
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

	useEffect(() => {
		const scrollerClass = '.react-horizontal-scrolling-menu--scroll-container';

		if (recMoviesContainerRef.current) {
			const recMoviesScroller = recMoviesContainerRef.current.querySelector(
				scrollerClass
			) as HTMLDivElement;

			recMoviesScroller.style.height = '23rem';
		}

		if (movieCastContainerRef.current) {
			const movieCastScroller = movieCastContainerRef.current.querySelector(
				scrollerClass
			) as HTMLDivElement;

			movieCastScroller.style.height = '23rem';
		}
	});

	if (movieDetailsLoading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</div>
		);
	}

	return (
		<main className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
			<section className='relative mx-4 mt-4'>
				<Image
					className='rounded-lg'
					src={BASE_IMG_URL + movieDetailsData!.poster_path}
					alt={movieDetailsData!.title ?? undefined}
					layout='fill'
				/>
			</section>

			<section className='mt-4'>
				<section className='flex items-center mb-8 mt-8'>
					<section className='h-[5rem] w-[5rem]'>
						<RoundProgressBar
							percentageVal={+movieDetailsData!.vote_average.toFixed(1) * 10}
						/>
					</section>
					<p className='ml-[.5rem] font-medium text-base'>
						{commaNumber(movieDetailsData!.vote_count!)} voted users
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
					<h1>{movieDetailsData!.title}</h1>
					<h4 className='my-4'>{movieDetailsData!.tagline}</h4>
					<p>{movieDetailsData!.overview}</p>
				</section>
			</section>

			<section className='ml-8 my-4'>
				<h3 className='mb-4 underline underline-offset-4'>Details</h3>
				<h4>Runtime</h4>
				<p className='ml-1'>{movieDetailsData!.runtime} minutes</p>
				<h4 className='mt-4'>Status</h4>
				<p className='ml-1'>{movieDetailsData!.status}</p>
				<h4 className='mt-4'>Release Date</h4>
				{movieDetailsData!.release_date ? (
					<p className='ml-1'>{formatDate(movieDetailsData!.release_date)}</p>
				) : (
					<p className='ml-1'>N/A</p>
				)}
				<h4 className='mt-4'>Genre(s)</h4>
				<div className='ml-1'>
					{movieDetailsData!.genres.map((genre, idx) => (
						<p key={idx}>{genre.name}</p>
					))}
				</div>
				<h4 className='mt-4'>Original Language</h4>
				<p className='ml-1'>
					{getEnglishName(movieDetailsData!.original_language!)}
				</p>
				{movieDetailsData!.homepage.length > 0 && (
					<>
						<h4 className='mt-4'>Official Page</h4>
						<Link href={movieDetailsData!.homepage}>
							<a className='underline ml-1' target='_blank'>
								Learn More
							</a>
						</Link>
					</>
				)}
			</section>

			<section className='col-start-2 mt-4'>
				{!moviesCastCrewLoading && moviesCastCrewData?.cast?.length! > 0 && (
					<section ref={movieCastContainerRef}>
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
					<section ref={recMoviesContainerRef}>
						<h3 className='mb-4 ml-8'>Recommended Movies</h3>
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
	);
};

export default MovieDetails;
