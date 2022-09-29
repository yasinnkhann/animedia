import React from 'react';
import { useRouter } from 'next/router';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../graphql/generated/nexus-typegen';
import * as Queries from '../graphql/queries';
import { IUseGQLQuery } from '@ts/interfaces';
import { useGQLQuery } from '../hooks/useGQL';
import { getDetailsPageRoute } from '../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { BASE_IMG_URL } from '../utils/URLs';
import Image from 'next/image';
import { formatDate } from '../utils/formatDate';
import { useSession } from 'next-auth/react';

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
		router.replace(getDetailsPageRoute(ESearchType.SHOW, show.id, show.name));
	};

	return (
		<tr className='border'>
			<td className='align-middle text-center border-x-4 border-blue-300'>
				<p className='text-lg'>{rank}</p>
			</td>

			<td
				className='break-words border-x-4 border-blue-300'
				onClick={handleGoToDetailsPage}
			>
				<h3>{show.name}</h3>
				<div className='w-[5rem] h-[5rem]'>
					<Image
						src={BASE_IMG_URL + show.poster_path}
						alt={show.name}
						height='100%'
						width='100%'
						onClick={handleGoToDetailsPage}
					/>
				</div>
				<p>{formatDate(show.first_air_date as string)}</p>
			</td>
			<td className='align-middle text-center border-x-4 border-blue-300'>
				<p className='text-base'>{show.vote_average.toFixed(1)}</p>
			</td>
			{session && (
				<>
					<td className='align-middle text-center border-x-4 border-blue-300'>
						<p>{usersShowData?.rating ? usersShowData.rating : 'N/A'}</p>
					</td>
					<td className='align-middle text-center border-x-4 border-blue-300'>
						<p>{usersShowData?.status ? usersShowData.status : 'N/A'}</p>
					</td>
				</>
			)}
		</tr>
	);
};

export default ShowCard;
