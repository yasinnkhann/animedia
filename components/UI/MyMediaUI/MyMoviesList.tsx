import React from 'react';
import MyMovieEntry from './MyMovieEntry';
import { TStatusParam } from '@ts/types';
import { UserMovie } from 'graphql/generated/code-gen/graphql';

interface Props {
	status: TStatusParam;
	myMovies: UserMovie[];
}

const MyMoviesList = ({ status, myMovies }: Props) => {
	const adjustedStatus = status?.toUpperCase().split('-').join(' ') ?? '';

	return (
		<section className='w-full px-4 sm:px-10 md:px-20 lg:px-40'>
			<section className='flex flex-col pb-4'>
				<div className='relative mt-8 flex h-[3rem] items-center justify-center bg-gray-200'>
					<h4 className='text-center text-blue-500'>
						{adjustedStatus} MOVIES:
					</h4>
					<h4 className='ml-2 text-green-700'>{myMovies.length}</h4>
				</div>
				<table>
					<thead>
						<tr className='border-2 border-gray-200'>
							<th className='w-[5rem] border-r-2 border-gray-200 p-4'>#</th>

							<th className='border-r-2 border-gray-200 p-4'>Title</th>

							<th className='w-[7rem] border-x-2 border-gray-200 p-4'>
								My Rating
							</th>

							<th className='w-[7rem] border-x-2 border-gray-200 p-4'>
								Remove
							</th>
						</tr>
					</thead>

					<tbody className='!border-b-2 !border-gray-200'>
						{myMovies?.map((myMovie, idx) => (
							<MyMovieEntry
								key={myMovie.id}
								myMovie={myMovie}
								count={idx + 1}
							/>
						))}
					</tbody>
				</table>
			</section>
		</section>
	);
};

export default MyMoviesList;
