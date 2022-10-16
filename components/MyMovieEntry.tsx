import React, { useState, useEffect } from 'react';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../graphql/generated/nexus-typegen';
import * as Queries from '../graphql/queries';
import * as Mutations from '../graphql/mutations';
import { getDetailsPageRoute } from '../utils/getDetailsPageRoute';
import { useRouter } from 'next/router';
import { ESearchType } from '@ts/enums';
import { IUseGQLMutation, IUseGQLQuery } from '@ts/interfaces';
import { useGQLMutation, useGQLQuery } from '../hooks/useGQL';
import { BASE_IMG_URL } from '../utils/URLs';
import Image from 'next/image';

interface Props {
	movie: NexusGenObjects['UserMovie'];
	count: number;
}

const MyMovieEntry = ({ movie, count }: Props) => {
	const router = useRouter();

	const {
		data: movieData,
		loading: movieLoading,
	}: IUseGQLQuery<
		NexusGenObjects['MovieDetailsRes'],
		NexusGenArgTypes['Query']['movieDetails']
	> = useGQLQuery<NexusGenArgTypes['Query']['movieDetails']>(
		Queries.QUERY_MOVIE_DETAILS,
		{
			variables: {
				movieDetailsId: Number(movie.id),
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
				movieId: String(movie.id),
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_MOVIES,
				},
				'UsersMovies',
			],
		}
	);

	console.log('MOVIE!!!: ', movieData);

	// useEffect(() => {}, []);

	return (
		<tr className='border-2'>
			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-lg'>{count}</p>
			</td>
			<td className='align-middle text-center border-x-2 border-gray-200'>
				<div className='row-start-1 w-[5rem] h-[7rem] relative cursor-pointer'>
					<Image
						className='rounded-lg'
						src={BASE_IMG_URL + movieData?.poster_path}
						alt={movieData?.title}
						layout='fill'
						onClick={() =>
							router.push(
								getDetailsPageRoute(
									ESearchType.MOVIE,
									Number(movie.id),
									movie.name as string
								)
							)
						}
					/>
				</div>
			</td>
			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-lg'>{movie.name}</p>
			</td>
			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-lg'>{movie.rating ?? 'N/A'}</p>
			</td>
			<td className='align-middle text-center border-x-2 border-gray-200'>
				<i
					className='fa fa-trash cursor-pointer text-red-600'
					aria-hidden='true'
					onClick={() => {
						deleteMovie({
							variables: {
								movieId: movie.id as string,
							},
						});
					}}
				></i>
			</td>
		</tr>
	);
};

export default MyMovieEntry;
