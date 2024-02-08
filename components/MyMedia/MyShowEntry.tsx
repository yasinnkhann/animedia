import React from 'react';
import Image from 'next/image';
import { BsFillTrashFill } from 'react-icons/bs';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { CommonMethods } from '../../utils/CommonMethods';
import { EContent } from '@ts/enums';
import { useMutation, useQuery } from '@apollo/client';
import { UserShow } from 'graphql/generated/code-gen/graphql';
import { WatchStatusTypes } from 'graphql/generated/code-gen/graphql';
import Link from 'next/link';

interface Props {
	myShow: UserShow;
	count: number;
}

const MyShowEntry = ({ myShow, count }: Props) => {
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

	return (
		<tr className='border-2'>
			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-lg'>{count}</p>
			</td>

			<td className='grid grid-cols-[5rem_calc(100%-5rem)] grid-rows-[100%] break-words p-4'>
				<Link
					href={CommonMethods.getDetailsPageRoute(
						EContent.SHOW,
						Number(myShow.id),
						myShow.name as string
					)}
					passHref
				>
					<a className='text-inherit no-underline'>
						<section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer'>
							<Image
								className='rounded-lg'
								src={CommonMethods.getImage(showData?.showDetails?.poster_path)}
								priority
								alt={showData?.showDetails?.name}
								layout='fill'
							/>
						</section>
					</a>
				</Link>
				<section className='col-start-2 pl-4'>
					<Link
						href={CommonMethods.getDetailsPageRoute(
							EContent.SHOW,
							Number(myShow.id),
							myShow.name as string
						)}
						passHref
					>
						<a className='text-inherit no-underline'>
							<h3 className='cursor-pointer'>{myShow.name}</h3>
						</a>
					</Link>
					<p>
						{showData?.showDetails?.first_air_date
							? CommonMethods.formatDate(showData.showDetails?.first_air_date)
							: 'First Air Date Not Available'}
					</p>
				</section>
			</td>

			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-lg'>{myShow.rating ?? 'N/A'}</p>
			</td>

			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-lg'>
					{myShow.status === WatchStatusTypes.PlanToWatch
						? 0
						: myShow.current_episode}
					/
					{myShow.status === WatchStatusTypes.Completed
						? myShow.current_episode
						: showData?.showDetails?.number_of_episodes}
				</p>
			</td>

			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<BsFillTrashFill
					size={20}
					className='w-full cursor-pointer text-red-500'
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
