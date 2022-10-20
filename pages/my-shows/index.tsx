import React from 'react';
import type { NextPage } from 'next';
import * as Queries from '../../graphql/queries';
import { useRouter } from 'next/router';
import { getClientAuthSession } from '../../lib/nextAuth/get-client-auth-session';
import { useGQLQuery } from '../../hooks/useGQL';
import { IUseGQLQuery } from '@ts/interfaces';
import { NexusGenObjects } from '../../graphql/generated/nexus-typegen';

const MyShows: NextPage = () => {
	const router = useRouter();

	const { data: usersShowsData }: IUseGQLQuery<NexusGenObjects['UserShow'][]> =
		useGQLQuery(Queries.QUERY_GET_USERS_SHOWS, {
			fetchPolicy: 'network-only',
		});

	return (
		<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<section className='flex justify-center'>
				<section className='w-[30rem] h-[30rem] mt-36'>
					<h1 className='text-center mb-4 !font-[Rubik]'>My Shows</h1>
					<section className='flex justify-center items-center'>
						<section className='bg-gray-200 flex flex-col justify-around items-center rounded-lg w-[25rem] h-[15rem]'>
							<div className='pt-4'>
								<a
									className='no-underline'
									onClick={() => router.push('/my-shows/watching')}
								>
									Watching:{' '}
								</a>
								<span>
									{
										usersShowsData?.filter(show => show.status === 'WATCHING')
											.length
									}
								</span>
							</div>

							<div>
								<a
									className='no-underline'
									onClick={() => router.push('/my-shows/completed')}
								>
									Completed:{' '}
								</a>
								<span>
									{
										usersShowsData?.filter(show => show.status === 'COMPLETED')
											.length
									}
								</span>
							</div>

							<div>
								<a
									className='no-underline'
									onClick={() => router.push('/my-shows/on-hold')}
								>
									On-Hold:{' '}
								</a>
								<span>
									{
										usersShowsData?.filter(show => show.status === 'ON_HOLD')
											.length
									}
								</span>
							</div>

							<div>
								<a
									className='no-underline'
									onClick={() => router.push('/my-shows/dropped')}
								>
									Dropped:{' '}
								</a>
								<span>
									{
										usersShowsData?.filter(show => show.status === 'DROPPED')
											.length
									}
								</span>
							</div>

							<div className='pb-4'>
								<a
									className='no-underline'
									onClick={() => router.push('/my-shows/plan-to-watch')}
								>
									Plan to Watch:{' '}
								</a>
								<span>
									{
										usersShowsData?.filter(
											show => show.status === 'PLAN_TO_WATCH'
										).length
									}
								</span>
							</div>
						</section>
					</section>
				</section>
			</section>
		</main>
	);
};

export default MyShows;

export const getServerSideProps = getClientAuthSession(async _ctx => {
	return { props: {} };
});
