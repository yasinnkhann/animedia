import React from 'react';
import MyMovieEntry from './MyMovieEntry';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { TStatusParam } from '@ts/types';

interface Props {
	status: TStatusParam;
	movies: NexusGenObjects['UserMovie'][];
}

const MyMoviesList = ({ status, movies }: Props) => {
	const adjustedStatus = status?.toUpperCase().split('-').join(' ') ?? '';

	return (
		<main className='flex flex-col items-center'>
			<div>{adjustedStatus}</div>
			<table>
				<thead>
					<tr className='border-2 border-gray-200'>
						<th className='border-r-2 border-gray-200 min-w-[5rem] p-4'>#</th>
						<th className='border-r-2 border-gray-200 min-w-[5rem] p-4'>
							Image
						</th>
						<th className='border-r-2 border-gray-200 p-4'>Title</th>
						<th className='border-x-2 border-gray-200 min-w-[7rem] p-4'>
							My Rating
						</th>
						<th className='border-x-2 border-gray-200 min-w-[7rem] p-4'>
							Remove
						</th>
					</tr>
				</thead>

				<tbody className='!border-b-2 !border-gray-200'>
					{movies.map((movie, idx) => (
						<MyMovieEntry key={movie.id} movie={movie} count={idx + 1} />
					))}
				</tbody>
			</table>
		</main>
	);
};

export default MyMoviesList;
