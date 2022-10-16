import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import RoundProgressBar from '../../components/UI/RoundProgressBar';
import commaNumber from 'comma-number';
import RecommendedMoviesHorizontalScroller from '../../components/UI/HorizontalScrollerUI/KnownForHorizontalScroller';
import { request } from 'graphql-request';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL, BASE_IMG_URL } from '../../utils/URLs';
import { useSession } from 'next-auth/react';
import { useGQLMutation, useGQLQuery } from '../../hooks/useGQL';
import { IUseGQLQuery, IUseGQLMutation } from '@ts/interfaces';
import { watchStatusOptions } from 'models/watchStatusOptions';
import { ratingOptions } from 'models/ratingOptions';
import { getEnglishName } from 'all-iso-language-codes';
import { formatDate } from '../../utils/formatDate';
import {
	NexusGenArgTypes,
	NexusGenObjects,
	NexusGenEnums,
} from '../../graphql/generated/nexus-typegen';

interface Props {
	movieDetails: NexusGenObjects['MovieDetailsRes'];
}

const MovieDetails = ({ movieDetails }: Props) => {
	const { data: session, status } = useSession();

	const recMoviesContainerRef = useRef<HTMLElement>(null);
	const overviewRef = useRef<HTMLParagraphElement>(null);

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
		mutateLoading: updateMovieLoading,
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
		mutateLoading: deleteMovieLoading,
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

	const isDBPending =
		addMovieLoading || updateMovieLoading || deleteMovieLoading;

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

	if (recMoviesLoading) {
		return;
	}

	return (
		<main
			className={`mt-[calc(var(--header-height-mobile)+1rem)] grid ${
				recMoviesData?.results?.length! > 0
					? 'grid-rows-[1fr_1fr]'
					: `${
							overviewRef.current?.clientHeight === undefined ||
							overviewRef.current.clientHeight <= 609
								? 'grid-rows-[calc(100vh-var(--header-height-mobile)-2rem)]'
								: 'grid-rows-[1fr]'
					  }`
			} grid-cols-[30%_70%] px-16`}
		>
			<section className='relative mx-4 mt-4'>
				<Image
					className='rounded-lg'
					src={BASE_IMG_URL + movieDetails.poster_path}
					alt={movieDetails.title ?? undefined}
					layout='fill'
				/>
			</section>

			<section className='mt-4'>
				<section className='flex items-center mb-8 mt-8'>
					<section className='h-[5rem] w-[5rem]'>
						<RoundProgressBar
							percentageVal={+movieDetails.vote_average.toFixed(1) * 10}
						/>
					</section>
					<p className='ml-[.5rem]'>
						{commaNumber(movieDetails.vote_count)} voted users
					</p>
				</section>

				{status === 'authenticated' && session.user && (
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

				<section>
					<h1>{movieDetails.title}</h1>
					<h4 className='my-4'>{movieDetails.tagline}</h4>
					<p ref={overviewRef}>{movieDetails.overview}</p>
				</section>
			</section>

			<section className='ml-8 my-4'>
				<h3 className='mb-4'>Details</h3>
				<h4>Runtime</h4>
				<p>{movieDetails.runtime} minutes</p>
				<h4 className='mt-4'>Status</h4>
				<p>{movieDetails.status}</p>
				<h4 className='mt-4'>Release Date</h4>
				{movieDetails.release_date ? (
					<p>{formatDate(movieDetails.release_date)}</p>
				) : (
					<p>N/A</p>
				)}
				<h4 className='mt-4'>Genre(s)</h4>
				<div>
					{movieDetails.genres.map((genre, idx) => (
						<p key={idx}>{genre.name}</p>
					))}
				</div>
				<h4 className='mt-4'>Original Language</h4>
				<p>{getEnglishName(movieDetails.original_language)}</p>
				{movieDetails.homepage.length > 0 && (
					<>
						<h4 className='mt-4'>Official Page</h4>
						<Link href={movieDetails.homepage}>
							<a className='underline' target='_blank'>
								Learn More
							</a>
						</Link>
					</>
				)}
			</section>

			{recMoviesData?.results?.length! > 0 && (
				<section className='col-start-2 mt-4' ref={recMoviesContainerRef}>
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
