import React from 'react';
import { request } from 'graphql-request';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL } from '../../utils/URLs';
import { useSession } from 'next-auth/react';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { useGQLMutation, useGQLQuery } from '../../hooks/useGQL';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';
import { IUseGetQuery } from '@ts/interfaces';
import { useMutation, useQuery } from '@apollo/client';

interface Props {
	movieDetails: NexusGenObjects['MovieDetailsRes'];
}

const MovieDetails = ({ movieDetails }: Props) => {
	const { data: session, status } = useSession();

	const { mutateFunction: addMovie, mutateData } = useGQLMutation<
		NexusGenArgTypes['Mutation']['addedMovie']
	>(Mutations.MUTATION_ADD_MOVIE, {
		movieId: String(movieDetails.id),
		movieName: movieDetails.title,
		watchStatus: 'WATCHING!!!',
	});

	// const [addMovie] = useMutation(Mutations.MUTATION_ADD_MOVIE);

	const {
		refetch: refetchUser,
		data: userData,
	}: IUseGetQuery<NexusGenObjects['User']> = useGQLQuery(
		Queries.QUERY_GET_USER
	);

	// const {
	// 	refetch: refetchUser,
	// 	data: userData,
	// 	error: userError,
	// } = useQuery(Queries.QUERY_GET_USER);

	console.log('USER DATA: ', userData);

	// console.log(movieDetails);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)] m-4'>
			<div className='w-[75%]'>
				<h1>{movieDetails.title}</h1>
				<p>{movieDetails.overview}</p>
			</div>
			<div>
				{status === 'authenticated' && session.user && (
					<button
						className='bg-green-500'
						onClick={() => {
							addMovie({
								variables: {
									movieId: String(movieDetails.id),
									movieName: movieDetails.title,
									watchStatus: 'WATCHING!!!',
								},
							});
							refetchUser();
							// fix!
						}}
					>
						Add to my list
					</button>
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
