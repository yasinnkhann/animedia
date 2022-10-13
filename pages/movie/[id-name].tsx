import React, { useState, useEffect, useRef } from 'react';
import { request } from 'graphql-request';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL, BASE_IMG_URL } from '../../utils/URLs';
import { useSession } from 'next-auth/react';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { useGQLMutation, useGQLQuery } from '../../hooks/useGQL';
import { IUseGQLQuery, IUseGQLMutation } from '@ts/interfaces';
import { watchStatusOptions } from 'models/watchStatusOptions';
import { ratingOptions } from 'models/ratingOptions';
import Image from 'next/image';
import {
	NexusGenObjects,
	NexusGenArgTypes,
	NexusGenEnums,
} from '../../graphql/generated/nexus-typegen';
import RecommendedMoviesHorizontalScroller from '../../components/UI/HorizontalScrollerUI/KnownForHorizontalScroller';
import RoundProgressBar from '../../components/UI/RoundProgressBar';
import commaNumber from 'comma-number';

interface Props {
	movieDetails: NexusGenObjects['MovieDetailsRes'];
}

const MovieDetails = ({ movieDetails }: Props) => {
	const { data: session, status } = useSession();

	const recMoviesContainerRef = useRef<HTMLElement>(null);

	const [watchStatus, setWatchStatus] =
		useState<NexusGenEnums['WatchStatusTypes']>('NOT_WATCHING');
	const [rating, setRating] = useState<string | number>(ratingOptions[0].value);

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
				movieId: String(movieDetails.id),
			},
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
				recommendedMoviesId: movieDetails.id,
			},
		}
	);

	console.log('MY MOVIE INFO: ', usersMovieData);
	console.log('MOVIE DETAILS: ', movieDetails);
	console.log('REC MOVIES: ', recMoviesData);

	const {
		mutateFunction: addMovie,
	}: IUseGQLMutation<
		NexusGenObjects['UserMovie'],
		NexusGenArgTypes['Mutation']['addedMovie']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['addedMovie']>(
		Mutations.MUTATION_ADD_MOVIE,
		{
			variables: {
				movieId: String(movieDetails.id),
				movieName: movieDetails.title,
				watchStatus,
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_MOVIE,
					variables: {
						movieId: String(movieDetails.id),
					},
				},
				'UsersMovie',
			],
		}
	);

	const {
		mutateFunction: updateMovie,
	}: IUseGQLMutation<
		NexusGenObjects['UserMovie'],
		NexusGenArgTypes['Mutation']['updatedMovie']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['updatedMovie']>(
		Mutations.MUTATION_UPDATE_MOVIE,
		{
			variables: {
				movieId: String(movieDetails.id),
				watchStatus,
				movieRating: typeof rating === 'number' ? rating : null,
			},
		}
	);

	const {
		mutateFunction: deleteMovie,
	}: IUseGQLMutation<
		NexusGenObjects['UserMovie'],
		NexusGenArgTypes['Mutation']['deletedMovie']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['deletedMovie']>(
		Mutations.MUTATION_DELETE_MOVIE,
		{
			variables: {
				movieId: String(movieDetails.id),
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_MOVIE,
					variables: {
						movieId: String(movieDetails.id),
					},
				},
				'UsersMovie',
			],
		}
	);

	const handleChangeWatchStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;

		setWatchStatus(value as NexusGenEnums['WatchStatusTypes']);

		if (usersMovieData) {
			if ((value as NexusGenEnums['WatchStatusTypes']) === 'NOT_WATCHING') {
				deleteMovie({
					variables: {
						movieId: String(movieDetails.id),
					},
				});
			} else {
				updateMovie({
					variables: {
						movieId: String(movieDetails.id),
						watchStatus: value as NexusGenEnums['WatchStatusTypes'],
					},
				});
			}
		} else {
			addMovie({
				variables: {
					movieId: String(movieDetails.id),
					movieName: movieDetails.title,
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
				movieId: String(movieDetails.id),
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
		if (recMoviesContainerRef.current) {
			const scrollerClass =
				'.react-horizontal-scrolling-menu--scroll-container';

			const recMoviesScroller = recMoviesContainerRef.current.querySelector(
				scrollerClass
			) as HTMLDivElement;

			recMoviesScroller.style.height = '23rem';
		}
	});

	return (
		<main className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-rows-[1.5fr_1fr] grid-cols-[30%_70%] px-16'>
			<section className='relative mx-4 mt-4'>
				<Image
					className='rounded-lg'
					src={BASE_IMG_URL + movieDetails.poster_path}
					alt={movieDetails.title ?? undefined}
					layout='fill'
				/>
			</section>

			<section className='mt-4'>
				<section className='flex items-center mb-4'>
					<section className='h-[4rem] w-[4rem]'>
						<RoundProgressBar
							percentageVal={+movieDetails.vote_average.toFixed(1) * 10}
						/>
					</section>
					<span>{commaNumber(movieDetails.vote_count)} voted users</span>
				</section>

				<section>
					{status === 'authenticated' && session.user && (
						<section>
							<select value={watchStatus} onChange={handleChangeWatchStatus}>
								{watchStatusOptions.map(option => (
									<option key={option.value} value={option.value}>
										{option.text}
									</option>
								))}
							</select>

							<select
								value={rating}
								onChange={handleChangeRating}
								disabled={
									watchStatus === 'NOT_WATCHING' ||
									watchStatus === 'PLAN_TO_WATCH'
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
				</section>

				<section>
					<h1>{movieDetails.title}</h1>
					<p>{movieDetails.overview}</p>
				</section>
			</section>

			{!recMoviesLoading && recMoviesData?.results?.length! > 0 && (
				<section className='col-start-2' ref={recMoviesContainerRef}>
					<h3>Recommended Movies</h3>
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
		</main>
	);
};

export default MovieDetails;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const id = Number((ctx.params?.['id-name'] as string).split('-')[0]);
	const data = await request(SERVER_BASE_URL, Queries.QUERY_MOVIE_DETAILS, {
		movieDetailsId: id,
	});

	const { movieDetails } = data;

	return {
		props: {
			movieDetails,
		},
	};
};
