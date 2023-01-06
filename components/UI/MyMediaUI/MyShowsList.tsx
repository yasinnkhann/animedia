import React from 'react';
import MyShowEntry from './MyShowEntry';
import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen';
import { TStatusParam } from '@ts/types';

interface Props {
	status: TStatusParam;
	myShows: NexusGenObjects['UserShow'][];
}

const MyShowsList = ({ status, myShows }: Props) => {
	const adjustedStatus = status?.toUpperCase().split('-').join(' ') ?? '';

	return (
		<section className='w-full px-4 sm:px-10 md:px-20 lg:px-40'>
			<section className='flex flex-col pb-4'>
				<div className='bg-gray-200 flex justify-center items-center h-[3rem] mt-8'>
					<h4 className='text-blue-500'>{adjustedStatus} SHOWS:</h4>
					<h4 className='text-green-700 ml-2'>{myShows.length}</h4>
				</div>
				<table>
					<thead>
						<tr className='border-2 border-gray-200'>
							<th className='border-r-2 border-gray-200 w-[5rem] p-4'>#</th>

							<th className='border-r-2 border-gray-200 p-4'>Title</th>

							<th className='border-x-2 border-gray-200 w-[7rem] p-4'>
								My Rating
							</th>

							<th className='border-x-2 border-gray-200 w-[7.5rem] p-4'>
								Current Ep.
							</th>

							<th className='border-x-2 border-gray-200 w-[7rem] p-4'>
								Remove
							</th>
						</tr>
					</thead>

					<tbody className='!border-b-2 !border-gray-200'>
						{myShows?.map((myShow, idx) => (
							<MyShowEntry key={myShow.id} myShow={myShow} count={idx + 1} />
						))}
					</tbody>
				</table>
			</section>
		</section>
	);
};

export default MyShowsList;
