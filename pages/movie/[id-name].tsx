import React, { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL } from '../../utils/URLs';
import { useSession } from 'next-auth/react';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { useGQLMutation, useGQLQuery } from '../../hooks/useGQL';
import { IUseGetQuery } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
	NexusGenEnums,
} from '../../graphql/generated/nexus-typegen';
import { watchStatusOptions } from 'models/watchStatusOptions';

interface Props {
	movieDetails: NexusGenObjects['MovieDetailsRes'];
}

const MovieDetails = ({ movieDetails }: Props) => {
	const { data: session, status } = useSession();

	const [watchStatus, setWatchStatus] =
		useState<NexusGenEnums['WatchStatusTypes']>('NOT_WATCHING');

	const { mutateFunction: addMovie } = useGQLMutation<
		NexusGenArgTypes['Mutation']['addedMovie']
	>(Mutations.MUTATION_ADD_MOVIE, {
		movieId: String(movieDetails.id),
		movieName: movieDetails.title,
		watchStatus,
	});

	const { refetch: refetchUser }: IUseGetQuery<NexusGenObjects['User']> =
		useGQLQuery(Queries.QUERY_GET_USER);

	const { data: usersMovieData }: IUseGetQuery<NexusGenObjects['UserMovie']> =
		useGQLQuery<NexusGenArgTypes['Query']['usersMovie']>(
			Queries.QUERY_GET_USERS_MOVIE,
			{
				movieId: String(movieDetails.id),
			}
		);

	const { mutateFunction: updateMovie } = useGQLMutation<
		NexusGenArgTypes['Mutation']['updatedMovie']
	>(Mutations.MUTATION_UPDATE_MOVIE, {
		movieId: String(movieDetails.id),
		watchStatus,
	});

	console.log('USERS MOVIE: ', usersMovieData);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		console.log(value);

		setWatchStatus(value as NexusGenEnums['WatchStatusTypes']);

		if (usersMovieData) {
			updateMovie({
				variables: {
					movieId: String(movieDetails.id),
					watchStatus: value as NexusGenEnums['WatchStatusTypes'],
				},
			});
		} else {
			addMovie({
				variables: {
					movieId: String(movieDetails.id),
					movieName: movieDetails.title,
					watchStatus: value as NexusGenEnums['WatchStatusTypes'],
				},
			});
		}

		refetchUser();
	};

	useEffect(() => {
		if (usersMovieData) {
			setWatchStatus(usersMovieData.status!);
		}
	}, [usersMovieData]);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)] m-4'>
			<div className='w-[75%]'>
				<h1>{movieDetails.title}</h1>
				<p>{movieDetails.overview}</p>
			</div>
			<div>
				{status === 'authenticated' && session.user && (
					<select value={watchStatus} onChange={handleChange}>
						{watchStatusOptions.map(option => (
							<option key={option.value} value={option.value}>
								{option.text}
							</option>
						))}
					</select>
				)}
			</div>
		</div>
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
