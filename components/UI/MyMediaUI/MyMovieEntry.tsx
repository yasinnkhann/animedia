import React from 'react';
import Image from 'next/image';
import { BsFillTrashFill } from 'react-icons/bs';
import * as Queries from '../../../graphql/queries';
import * as Mutations from '../../../graphql/mutations';
import { useRouter } from 'next/router';
import { formatDate } from '../../../utils/formatDate';
import { getDetailsPageRoute } from '../../../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { useGQLMutation, useGQLQuery } from '../../../hooks/useGQL';
import { BASE_IMG_URL } from '../../../utils/URLs';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../../graphql/generated/nexus-typegen';
import { useMutation } from '@apollo/client';

interface Props {
	myMovie: NexusGenObjects['UserMovie'];
	count: number;
}

const MyMovieEntry = ({ myMovie, count }: Props) => {
	const router = useRouter();

	const { data: movieData } = useGQLQuery<
		NexusGenObjects['MovieDetailsRes'],
		NexusGenArgTypes['Query']['movieDetails']
	>(Queries.MOVIE_DETAILS, {
		variables: {
			movieDetailsId: Number(myMovie.id),
		},
	});

	const { mutateFunction: deleteMovie } = useGQLMutation<
		NexusGenObjects['UserMovie'],
		NexusGenArgTypes['Mutation']['deleteMovie']
	>(Mutations.DELETE_MOVIE, {
		variables: {
			movieId: String(myMovie.id),
		},
		refetchQueries: () => [
			{
				query: Queries.GET_USERS_MOVIES,
			},
			'UsersMovies',
		],
	});

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

					<p>
						{movieData?.release_date
							? formatDate(movieData?.release_date)
							: 'Release Date Not Available'}
					</p>
				</section>
			</td>

			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-lg'>{myMovie.rating ?? 'N/A'}</p>
			</td>

			<td className='align-middle text-center border-x-2 border-gray-200'>
				<BsFillTrashFill
					size={20}
					className='cursor-pointer text-red-500 w-full'
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
