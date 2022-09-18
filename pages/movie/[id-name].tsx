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
import { Select } from 'antd';
import { watchStatusOptions } from 'models/watchStatusOptions';

const { Option } = Select;

interface Props {
	movieDetails: NexusGenObjects['MovieDetailsRes'];
}

const MovieDetails = ({ movieDetails }: Props) => {
	const { data: session, status } = useSession();

	// const [watchStatus, setWatchStatus] =
	// 	useState<NexusGenEnums['WatchStatusTypes']>();

	const { mutateFunction: addMovie } = useGQLMutation<
		NexusGenArgTypes['Mutation']['addedMovie']
	>(Mutations.MUTATION_ADD_MOVIE, {
		movieId: String(movieDetails.id),
		movieName: movieDetails.title,
		watchStatus: 'PLAN_TO_WATCH',
	});

	const {
		refetch: refetchUser,
		data: userData,
	}: IUseGetQuery<NexusGenObjects['User']> = useGQLQuery(
		Queries.QUERY_GET_USER
	);

	const { data: usersMovieData }: IUseGetQuery<NexusGenObjects['UserMovie'][]> =
		useGQLQuery(Queries.QUERY_GET_USERS_MOVIES);

	console.log('USER MOVIES: ', usersMovieData);

	const handleChange = (value: NexusGenEnums['WatchStatusTypes']) => {
		console.log(`selected ${value}`);
		addMovie({
			variables: {
				movieId: String(movieDetails.id),
				movieName: movieDetails.title,
				watchStatus: value,
			},
		});
		refetchUser();
		console.log('ADDED');
	};

	// useEffect(() => {}, []);
	console.log('USER DATA: ', userData);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)] m-4'>
			<div className='w-[75%]'>
				<h1>{movieDetails.title}</h1>
				<p>{movieDetails.overview}</p>
			</div>
			<div>
				{status === 'authenticated' && session.user && (
					<Select
						defaultValue={'' as any}
						style={{ width: 120 }}
						onChange={handleChange}
					>
						{watchStatusOptions.map(option => (
							<Option key={option.value} value={option.value}>
								{option.text}
							</Option>
						))}
					</Select>
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
