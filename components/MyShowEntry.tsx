import React from 'react';
import Image from 'next/image';
import * as Queries from '../graphql/queries';
import * as Mutations from '../graphql/mutations';
import { getDetailsPageRoute } from '../utils/getDetailsPageRoute';
import { useRouter } from 'next/router';
import { ESearchType } from '@ts/enums';
import { IUseGQLMutation, IUseGQLQuery } from '@ts/interfaces';
import { useGQLMutation, useGQLQuery } from '../hooks/useGQL';
import { BASE_IMG_URL } from '../utils/URLs';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../graphql/generated/nexus-typegen';

interface Props {
	myShow: NexusGenObjects['UserShow'];
	count: number;
}

const MyShowEntry = ({ myShow, count }: Props) => {
	const router = useRouter();

	const {
		data: showData,
	}: IUseGQLQuery<
		NexusGenObjects['ShowDetailsRes'],
		NexusGenArgTypes['Query']['showDetails']
	> = useGQLQuery<NexusGenArgTypes['Query']['showDetails']>(
		Queries.QUERY_SHOW_DETAILS,
		{
			variables: {
				showDetailsId: Number(myShow.id),
			},
		}
	);

	const {
		mutateFunction: deleteShow,
	}: IUseGQLMutation<
		NexusGenObjects['UserShow'],
		NexusGenArgTypes['Mutation']['deletedShow']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['deletedShow']>(
		Mutations.MUTATION_DELETE_SHOW,
		{
			variables: {
				showId: String(myShow.id),
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_SHOWS,
				},
				'UsersShows',
			],
		}
	);

	console.log('SHOW!!!: ', showData);

	return (
		<tr className='border-2'>
			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-lg'>{count}</p>
			</td>
			<td className='align-middle text-center border-x-2 border-gray-200 flex justify-center py-[.5rem]'>
				<div className='row-start-1 w-full h-[7rem] relative cursor-pointer'>
					<Image
						className='rounded-lg'
						src={BASE_IMG_URL + showData?.poster_path}
						priority
						alt={showData?.name}
						layout='fill'
						onClick={() =>
							router.push(
								getDetailsPageRoute(
									ESearchType.SHOW,
									Number(myShow.id),
									myShow.name as string
								)
							)
						}
					/>
				</div>
			</td>
			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-lg'>{myShow.name}</p>
			</td>
			<td className='align-middle text-center border-x-2 border-gray-200'>
				<p className='text-lg'>{myShow.rating ?? 'N/A'}</p>
			</td>
			<td className='align-middle text-center border-x-2 border-gray-200'>
				<i
					className='fa fa-trash cursor-pointer text-red-600'
					aria-hidden='true'
					onClick={() => {
						deleteShow({
							variables: {
								showId: myShow.id as string,
							},
						});
					}}
				></i>
			</td>
		</tr>
	);
};

export default MyShowEntry;
