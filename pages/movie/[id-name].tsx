import React, { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL } from '../../utils/URLs';
import { useSession } from 'next-auth/react';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { useGQLMutation, useGQLQuery } from '../../hooks/useGQL';
import { IUseGQLQuery, IUseGQLMutation } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
	NexusGenEnums,
} from '../../graphql/generated/nexus-typegen';
import { watchStatusOptions } from 'models/watchStatusOptions';
import { ratingOptions } from 'models/ratingOptions';
import Image from 'next/image';
import { BASE_IMG_URL } from '../../utils/URLs';

interface Props {
	movieDetails: NexusGenObjects['MovieDetailsRes'];
}

const MovieDetails = ({ movieDetails }: Props) => {
	const { data: session, status } = useSession();

	const [watchStatus, setWatchStatus] =
		useState<NexusGenEnums['WatchStatusTypes']>('NOT_WATCHING');
	const [rating, setRating] = useState<string | number>(ratingOptions[0].value);

	const {
		data: usersMovieData,
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

	console.log('MY MOVIE INFO: ', usersMovieData);
	console.log('MOVIE DETAILS: ', movieDetails);

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
		if (usersMovieData) {
			setWatchStatus(usersMovieData.status!);
			setRating(usersMovieData?.rating ?? '');
		}
	}, [usersMovieData]);

	useEffect(() => {
		if (watchStatus === 'NOT_WATCHING') {
			setRating('');
		}
	}, [watchStatus]);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)] m-4'>
			<section>
				<div className='w-[15rem] h-[20rem] relative'>
					<Image
						className='rounded-lg'
						src={BASE_IMG_URL + movieDetails.poster_path}
						alt={movieDetails.title}
						layout='fill'
					/>
				</div>
				<div className='w-[75%]'>
					<h1>{movieDetails.title}</h1>
					<p>{movieDetails.overview}</p>
				</div>
			</section>

			<section>
				{status === 'authenticated' && session.user && (
					<div>
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
					</div>
				)}
			</section>
		</section>
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
