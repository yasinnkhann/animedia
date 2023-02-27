import React from 'react';
import Image from 'next/image';
import { BsFillTrashFill } from 'react-icons/bs';
import * as Queries from '../../../graphql/queries';
import * as Mutations from '../../../graphql/mutations';
import { formatDate } from '../../../utils/formatDate';
import { useRouter } from 'next/router';
import { getDetailsPageRoute } from '../../../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { BASE_IMG_URL } from '../../../utils/constants';
import { useMutation, useQuery } from '@apollo/client';
import { UserShow } from 'graphql/generated/code-gen/graphql';

interface Props {
	myShow: UserShow;
	count: number;
}

const MyShowEntry = ({ myShow, count }: Props) => {
	const router = useRouter();

	const { data: showData } = useQuery(Queries.SHOW_DETAILS, {
		variables: {
			showDetailsId: Number(myShow.id),
		},
	});

	const [deleteShow] = useMutation(Mutations.DELETE_SHOW, {
		variables: {
			showId: String(myShow.id),
		},
		refetchQueries: () => [
			{
				query: Queries.GET_USERS_SHOWS,
			},
			'UsersShows',
		],
	});

	const handleGoToDetailsPage = () => {
		router.push(
			getDetailsPageRoute(
				ESearchType.SHOW,
				Number(myShow.id),
				myShow.name as string
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
						src={BASE_IMG_URL + showData?.showDetails?.poster_path}
						priority
						alt={showData?.showDetails?.name}
						layout='fill'
						onClick={handleGoToDetailsPage}
					/>
				</section>

				<section className='col-start-2 pl-4'>
					<h3 className='cursor-pointer' onClick={handleGoToDetailsPage}>
						{myShow.name}
					</h3>

					<p>
						{showData?.showDetails?.first_air_date
							? formatDate(showData.showDetails?.first_air_date)
							: 'First Air Date Not Available'}
					</p>
				</section>
			</td>

			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-lg'>{myShow.rating ?? 'N/A'}</p>
			</td>

			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-lg'>
					{myShow.current_episode}/{showData?.showDetails?.number_of_episodes}
				</p>
			</td>

			<td className='align-middle text-center border-x-2 border-gray-200'>
				<BsFillTrashFill
					size={20}
					className='cursor-pointer text-red-500 w-full'
					onClick={() => {
						deleteShow({
							variables: {
								showId: myShow.id as string,
							},
						});
					}}
				/>
			</td>
		</tr>
	);
};

export default MyShowEntry;
