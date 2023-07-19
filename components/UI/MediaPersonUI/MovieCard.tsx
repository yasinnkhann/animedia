import React from 'react';
import Image from 'next/image';
import * as Queries from '../../../graphql/queries';
import { useRouter } from 'next/router';
import { getDetailsPageRoute } from '../../../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { BASE_IMG_URL } from '../../../utils/constants';
import { formatDate } from '../../../utils/formatDate';
import { useSession } from 'next-auth/react';
import { renderTableStatus } from '../../../utils/renderTableStatus';
import { useQuery } from '@apollo/client';
import { MovieResult } from 'graphql/generated/code-gen/graphql';

interface Props {
	movie: MovieResult;
	rank: number;
}

const MovieCard = ({ movie, rank }: Props) => {
	const { data: session } = useSession();

	const router = useRouter();

	const { data: usersMovieData, loading: usersMovieLoading } = useQuery(
		Queries.GET_USERS_MOVIE,
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
			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-lg'>{rank}</p>
			</td>

			<td className='grid grid-cols-[5rem_calc(100%-5rem)] grid-rows-[100%] break-words p-4'>
				<section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer'>
					<Image
						className='rounded-lg'
						src={BASE_IMG_URL + movie.poster_path}
						alt={movie.title}
						layout='fill'
						onClick={handleGoToDetailsPage}
					/>
				</section>

				<section className='col-start-2 pl-4'>
					<h3 className='cursor-pointer' onClick={handleGoToDetailsPage}>
						{movie.title}
					</h3>

					<p>
						{movie.release_date
							? formatDate(movie.release_date)
							: 'Release Date Not Available'}
					</p>
				</section>
			</td>

			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-base'>{movie.vote_average.toFixed(1)}</p>
			</td>

			{session && (
				<>
					<td className='border-x-2 border-gray-200 text-center align-middle'>
						<p>
							{usersMovieData?.usersMovie?.rating
								? usersMovieData.usersMovie.rating
								: 'N/A'}
						</p>
					</td>

					<td className='border-x-2 border-gray-200 px-4 text-center align-middle'>
						<p>
							{usersMovieData?.usersMovie?.status
								? renderTableStatus(usersMovieData.usersMovie.status)
								: 'N/A'}
						</p>
					</td>
				</>
			)}
		</tr>
	);
};

export default MovieCard;
