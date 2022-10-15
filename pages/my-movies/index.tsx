import React from 'react';
import type { NextPage } from 'next';
import { getClientAuthSession } from '../../lib/nextAuth/get-client-auth-session';
import { useGQLQuery } from '../../hooks/useGQL';
import { IUseGQLQuery } from '@ts/interfaces';
import { NexusGenObjects } from '../../graphql/generated/nexus-typegen';
import * as Queries from '../../graphql/queries';
import { useRouter } from 'next/router';

const MyMovies: NextPage = () => {
	const router = useRouter();

	const {
		data: usersMoviesData,
	}: IUseGQLQuery<NexusGenObjects['UserMovie'][]> = useGQLQuery(
		Queries.QUERY_GET_USERS_MOVIES
	);

	return (
		<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<h1>My Movies</h1>
			<section className='flex justify-center items-center h-[35rem]'>
				<section className='bg-gray-300 h-[70%] w-[30%] flex flex-col justify-center items-center rounded-lg'>
					<div>
						<a
							className='no-underline'
							onClick={() => router.push('/my-movies/watching')}
						>
							Watching:{' '}
						</a>
						<span>
							{
								usersMoviesData?.filter(movie => movie.status === 'WATCHING')
									.length
							}
						</span>
					</div>

					<div>
						<a
							className='no-underline'
							onClick={() => router.push('/my-movies/completed')}
						>
							Completed:{' '}
						</a>
						<span>
							{
								usersMoviesData?.filter(movie => movie.status === 'COMPLETED')
									.length
							}
						</span>
					</div>

					<div>
						<a
							className='no-underline'
							onClick={() => router.push('/my-movies/on-hold')}
						>
							On-Hold:{' '}
						</a>
						<span>
							{
								usersMoviesData?.filter(movie => movie.status === 'ON_HOLD')
									.length
							}
						</span>
					</div>

					<div>
						<a
							className='no-underline'
							onClick={() => router.push('/my-movies/dropped')}
						>
							Dropped:{' '}
						</a>
						<span>
							{
								usersMoviesData?.filter(movie => movie.status === 'DROPPED')
									.length
							}
						</span>
					</div>

					<div>
						<a
							className='no-underline'
							onClick={() => router.push('/my-movies/plan-to-watch')}
						>
							Plan to Watch:{' '}
						</a>
						<span>
							{
								usersMoviesData?.filter(
									movie => movie.status === 'PLAN_TO_WATCH'
								).length
							}
						</span>
					</div>
				</section>
			</section>
		</main>
	);
};

export default MyMovies;

export const getServerSideProps = getClientAuthSession(async _ctx => {
	return { props: {} };
});
