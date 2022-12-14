import React from 'react';
import Image from 'next/image';
import * as Queries from '../../../graphql/queries';
import { useRouter } from 'next/router';
import { IUseGQLQuery } from '@ts/interfaces';
import { useGQLQuery } from '../../../hooks/useGQL';
import { getDetailsPageRoute } from '../../../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { BASE_IMG_URL } from '../../../utils/URLs';
import { formatDate } from '../../../utils/formatDate';
import { useSession } from 'next-auth/react';
import { renderTableStatus } from '../../../utils/renderTableStatus';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../../graphql/generated/nexus-typegen';

interface Props {
	show: NexusGenObjects['ShowResult'];
	rank: number;
}

const ShowCard = ({ show, rank }: Props) => {
	const { data: session } = useSession();

	const router = useRouter();

	const {
		data: usersShowData,
	}: IUseGQLQuery<
		NexusGenObjects['UserShow'],
		NexusGenArgTypes['Query']['usersShow']
	> = useGQLQuery<NexusGenArgTypes['Query']['usersShow']>(
		Queries.QUERY_GET_USERS_SHOW,
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
			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-lg'>{rank}</p>
			</td>

			<td className='grid grid-rows-[100%] grid-cols-[5rem_calc(100%-5rem)] break-words p-4'>
				<section className='row-start-1 w-[5rem] h-[7rem] relative cursor-pointer'>
					<Image
						className='rounded-lg'
						src={BASE_IMG_URL + show.poster_path}
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

			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-base'>{show.vote_average.toFixed(1)}</p>
			</td>

			{session && (
				<>
					<td className='align-middle text-center border-x-2 border-gray-200'>
						<p>{usersShowData?.rating ? usersShowData.rating : 'N/A'}</p>
					</td>
					<td className='align-middle text-center border-x-2 border-gray-200 px-4'>
						<p>
							{usersShowData?.status
								? renderTableStatus(usersShowData.status)
								: 'N/A'}
						</p>
					</td>
				</>
			)}
		</tr>
	);
};

export default ShowCard;
