import React from 'react';
import Image from 'next/image';
import * as Queries from '../../../graphql/queries';
import * as Mutations from '../../../graphql/mutations';
import { useRouter } from 'next/router';
import { formatDate } from '../../../utils/formatDate';
import { getDetailsPageRoute } from '../../../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { IUseGQLMutation, IUseGQLQuery } from '@ts/interfaces';
import { useGQLMutation, useGQLQuery } from '../../../hooks/useGQL';
import { BASE_IMG_URL } from '../../../utils/URLs';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../../graphql/generated/nexus-typegen';

interface Props {
	myMovie: NexusGenObjects['UserMovie'];
	count: number;
}

const MyMovieEntry = ({ myMovie, count }: Props) => {
	const router = useRouter();

	const {
		data: movieData,
	}: IUseGQLQuery<
		NexusGenObjects['MovieDetailsRes'],
		NexusGenArgTypes['Query']['movieDetails']
	> = useGQLQuery<NexusGenArgTypes['Query']['movieDetails']>(
		Queries.QUERY_MOVIE_DETAILS,
		{
			variables: {
				movieDetailsId: Number(myMovie.id),
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
				movieId: String(myMovie.id),
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_MOVIES,
				},
				'UsersMovies',
			],
		}
	);

	const handleGoToDetailsPage = () => {
		router.push(
			getDetailsPageRoute(
				ESearchType.MOVIE,
				Number(myMovie.id),
				myMovie.name as string
			)
		);
	};

	return (
		<tr className='border-2'>
			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-lg'>{count}</p>
			</td>

			<td className='grid grid-rows-[100%] grid-cols-[5rem_calc(100%-5rem)] break-words p-4'>
				<section className='row-start-1 w-[5rem] h-[7rem] relative cursor-pointer'>
					<Image
						className='rounded-lg'
						src={BASE_IMG_URL + movieData?.poster_path}
						priority
						alt={movieData?.title}
						layout='fill'
						onClick={handleGoToDetailsPage}
					/>
				</section>

				<section className='col-start-2 pl-4'>
					<h3 className='cursor-pointer' onClick={handleGoToDetailsPage}>
						{myMovie.name}
					</h3>

					<p>{formatDate(movieData?.release_date as string)}</p>
				</section>
			</td>

			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-lg'>{myMovie.rating ?? 'N/A'}</p>
			</td>

			<td className='align-middle text-center border-x-2 border-gray-200'>
				<i
					className='fa fa-trash cursor-pointer text-red-600'
					aria-hidden='true'
					onClick={() => {
						deleteMovie({
							variables: {
								movieId: myMovie.id as string,
							},
						});
					}}
				/>
			</td>
		</tr>
	);
};

export default MyMovieEntry;
