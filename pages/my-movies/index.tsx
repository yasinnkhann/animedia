import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Circles } from 'react-loading-icons';
import * as Queries from '../../graphql/queries';
import { getClientAuthSession } from '../../lib/nextAuth/get-client-auth-session';
import { useGQLQuery } from '../../hooks/useGQL';
import { NexusGenObjects } from '../../graphql/generated/nexus-typegen';
import { useRouter } from 'next/router';

const MyMovies: NextPage = () => {
	const router = useRouter();

	const { data: usersMoviesData, loading: usersMoviesLoading } = useGQLQuery<
		NexusGenObjects['UserMovie'][]
	>(Queries.GET_USERS_MOVIES, {
		fetchPolicy: 'network-only',
	});

	if (usersMoviesLoading) {
		return (
			<section className='flex justify-center items-center h-screen'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>My Movies</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				<section className='flex justify-center'>
					<section className='w-[30rem] h-[30rem] mt-36'>
						<h1 className='text-center mb-4 !font-[Rubik]'>My Movies</h1>
						<section className='flex justify-center items-center'>
							<section className='bg-gray-200 flex flex-col justify-around items-center rounded-lg w-[25rem] h-[15rem]'>
								<div className='pt-4'>
									<a
										className='no-underline cursor-pointer'
										onClick={() => router.push('/my-movies/watching')}
									>
										Watching:{' '}
									</a>
									<span>
										{
											usersMoviesData?.filter(
												movie => movie.status === 'WATCHING'
											).length
										}
									</span>
								</div>

								<div>
									<a
										className='no-underline cursor-pointer'
										onClick={() => router.push('/my-movies/completed')}
									>
										Completed:{' '}
									</a>
									<span>
										{
											usersMoviesData?.filter(
												movie => movie.status === 'COMPLETED'
											).length
										}
									</span>
								</div>

								<div>
									<a
										className='no-underline cursor-pointer'
										onClick={() => router.push('/my-movies/on-hold')}
									>
										On-Hold:{' '}
									</a>
									<span>
										{
											usersMoviesData?.filter(
												movie => movie.status === 'ON_HOLD'
											).length
										}
									</span>
								</div>

								<div>
									<a
										className='no-underline cursor-pointer'
										onClick={() => router.push('/my-movies/dropped')}
									>
										Dropped:{' '}
									</a>
									<span>
										{
											usersMoviesData?.filter(
												movie => movie.status === 'DROPPED'
											).length
										}
									</span>
								</div>

								<div className='pb-4'>
									<a
										className='no-underline cursor-pointer'
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
					</section>
				</section>
			</main>
		</>
	);
};

export default MyMovies;

export const getServerSideProps = getClientAuthSession(async _ctx => {
	return { props: { hideScrollBar: true } };
});
