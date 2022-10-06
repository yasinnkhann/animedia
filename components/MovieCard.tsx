import React from 'react';
import { useRouter } from 'next/router';
import * as Queries from '../graphql/queries';
import { IUseGQLQuery } from '@ts/interfaces';
import { useGQLQuery } from '../hooks/useGQL';
import { getDetailsPageRoute } from '../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { BASE_IMG_URL } from '../utils/URLs';
import Image from 'next/image';
import { formatDate } from '../utils/formatDate';
import { useSession } from 'next-auth/react';
import { renderTableStatus } from '../utils/renderTableStatus';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../graphql/generated/nexus-typegen';

interface Props {
	movie: NexusGenObjects['MovieResult'];
	rank: number;
}

const MovieCard = ({ movie, rank }: Props) => {
	const { data: session } = useSession();

	const router = useRouter();

	const {
		data: usersMovieData,
	}: IUseGQLQuery<
		NexusGenObjects['UserMovie'],
		NexusGenArgTypes['Query']['usersMovie']
	> = useGQLQuery<NexusGenArgTypes['Query']['usersMovie']>(
		Queries.QUERY_GET_USERS_MOVIE,
		{
			variables: {
				movieId: String(movie.id),
			},
		}
	);

	const handleGoToDetailsPage = () => {
		router.push(getDetailsPageRoute(ESearchType.MOVIE, movie.id, movie.title));
	};

	return (
		<tr className='border-2'>
			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-lg'>{rank}</p>
			</td>

			<td
				className='grid grid-rows-[100%] grid-cols-[5rem_calc(100%-5rem)] break-words p-4'
				onClick={handleGoToDetailsPage}
			>
				<div className='row-start-1 w-[5rem] h-[7rem] relative cursor-pointer'>
					<Image
						className='rounded-lg'
						src={BASE_IMG_URL + movie.poster_path}
						alt={movie.title}
						layout='fill'
						onClick={handleGoToDetailsPage}
					/>
				</div>
				<div className='col-start-2 pl-4'>
					<h3 className='cursor-pointer'>{movie.title}</h3>
					<p>{formatDate(movie.release_date as string)}</p>
				</div>
			</td>
			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-base'>{movie.vote_average.toFixed(1)}</p>
			</td>
			{session && (
				<>
					<td className='align-middle text-center border-x-2 border-gray-200'>
						<p>{usersMovieData?.rating ? usersMovieData.rating : 'N/A'}</p>
					</td>
					<td className='align-middle text-center border-x-2 border-gray-200'>
						<p>
							{usersMovieData?.status
								? renderTableStatus(usersMovieData.status)
								: 'N/A'}
						</p>
					</td>
				</>
			)}
		</tr>
	);
};

export default MovieCard;
