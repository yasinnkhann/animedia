import MyShowEntry from './MyShowEntry';
import { TStatusParam } from '@ts/types';
import { UserShow } from 'graphql/generated/code-gen/graphql';

interface Props {
	status: TStatusParam;
	myShows: UserShow[];
}

const MyShowsList = ({ status, myShows }: Props) => {
	const adjustedStatus = status?.toUpperCase().split('-').join(' ') ?? '';

	return (
		<section className='w-full px-4 sm:px-10 md:px-20 lg:px-40'>
			<section className='flex flex-col pb-4'>
				<div className='mt-8 flex h-[3rem] items-center justify-center bg-gray-200'>
					<h4 className='text-blue-500'>{adjustedStatus} SHOWS:</h4>
					<h4 className='ml-2 text-green-700'>{myShows.length}</h4>
				</div>
				<table>
					<thead>
						<tr className='border-2 border-gray-200'>
							<th className='w-[5rem] border-r-2 border-gray-200 p-4'>#</th>

							<th className='border-r-2 border-gray-200 p-4'>Title</th>

							<th className='w-[7rem] border-x-2 border-gray-200 p-4'>
								My Rating
							</th>

							<th className='w-[7.5rem] border-x-2 border-gray-200 p-4'>
								Current Ep.
							</th>

							<th className='w-[7rem] border-x-2 border-gray-200 p-4'>
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
