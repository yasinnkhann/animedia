import React from 'react';
import Image from 'next/image';
import * as Queries from '../../../graphql/queries';
import { useRouter } from 'next/router';
import { getDetailsPageRoute } from '../../../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { formatDate } from '../../../utils/formatDate';
import { useSession } from 'next-auth/react';
import { renderTableStatus } from '../../../utils/renderTableStatus';
import { useQuery } from '@apollo/client';
import { ShowResult } from 'graphql/generated/code-gen/graphql';
import { getImage } from 'utils/getImage';

interface Props {
	show: ShowResult;
	rank: number;
}

const ShowCard = ({ show, rank }: Props) => {
	const { data: session } = useSession();

	const router = useRouter();

	const { data: usersShowData, loading: usersShowLoading } = useQuery(
		Queries.GET_USERS_SHOW,
		{
			variables: {
				showId: String(show.id),
			},
		}
	);

	const handleGoToDetailsPage = () => {
		router.push(getDetailsPageRoute(ESearchType.SHOW, show.id, show.name));
	};

	return (
		<tr className='border'>
			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-lg'>{rank}</p>
			</td>

			<td className='grid grid-cols-[5rem_calc(100%-5rem)] grid-rows-[100%] break-words p-4'>
				<section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer'>
					<Image
						className='rounded-lg'
						src={getImage(show.poster_path)}
						alt={show.name}
						layout='fill'
						onClick={handleGoToDetailsPage}
					/>
				</section>

				<section className='col-start-2 pl-4'>
					<h3 className='cursor-pointer' onClick={handleGoToDetailsPage}>
						{show.name}
					</h3>
					<p>
						{show.first_air_date
							? formatDate(show.first_air_date)
							: 'First Air Date Not Available'}
					</p>
				</section>
			</td>

			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-base'>{show.vote_average.toFixed(1)}</p>
			</td>

			{session && (
				<>
					<td className='border-x-2 border-gray-200 text-center align-middle'>
						<p>
							{usersShowData?.usersShow?.rating
								? usersShowData.usersShow.rating
								: 'N/A'}
						</p>
					</td>
					<td className='border-x-2 border-gray-200 px-4 text-center align-middle'>
						<p>
							{usersShowData?.usersShow?.status
								? renderTableStatus(usersShowData.usersShow.status)
								: 'N/A'}
						</p>
					</td>
				</>
			)}
		</tr>
	);
};

export default ShowCard;
