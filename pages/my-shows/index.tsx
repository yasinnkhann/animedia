import type { NextPage } from 'next';
import Head from 'next/head';
import { Circles } from 'react-loading-icons';
import * as Queries from '../../graphql/queries';
import { useRouter } from 'next/router';
import { getClientAuthSession } from '../../lib/nextAuth/get-client-auth-session';
import { useQuery } from '@apollo/client';
import { WatchStatusTypes } from 'graphql/generated/code-gen/graphql';

const MyShows: NextPage = () => {
	const router = useRouter();

	const { data: usersShowsData, loading: usersShowsLoading } = useQuery(
		Queries.GET_USERS_SHOWS,
		{
			fetchPolicy: 'network-only',
		}
	);

	if (usersShowsLoading) {
		return (
			<section className='flex h-screen items-center justify-center'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>My Shows</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				<section className='flex justify-center'>
					<section className='mt-36 h-[30rem] w-[30rem]'>
						<h1 className='mb-4 text-center !font-[Rubik]'>My Shows</h1>
						<section className='flex items-center justify-center'>
							<section className='flex h-[15rem] w-[25rem] flex-col items-center justify-around rounded-lg bg-gray-200'>
								<div className='pt-4'>
									<a
										className='cursor-pointer no-underline'
										onClick={() => router.push('/my-shows/watching')}
									>
										Watching:{' '}
									</a>
									<span>
										{
											usersShowsData?.usersShows?.filter(
												show => show?.status === WatchStatusTypes.Watching
											).length
										}
									</span>
								</div>

								<div>
									<a
										className='cursor-pointer no-underline'
										onClick={() => router.push('/my-shows/completed')}
									>
										Completed:{' '}
									</a>
									<span>
										{
											usersShowsData?.usersShows?.filter(
												show => show?.status === WatchStatusTypes.Completed
											).length
										}
									</span>
								</div>

								<div>
									<a
										className='cursor-pointer no-underline'
										onClick={() => router.push('/my-shows/on-hold')}
									>
										On-Hold:{' '}
									</a>
									<span>
										{
											usersShowsData?.usersShows?.filter(
												show => show?.status === WatchStatusTypes.OnHold
											).length
										}
									</span>
								</div>

								<div>
									<a
										className='cursor-pointer no-underline'
										onClick={() => router.push('/my-shows/dropped')}
									>
										Dropped:{' '}
									</a>
									<span>
										{
											usersShowsData?.usersShows?.filter(
												show => show?.status === WatchStatusTypes.Dropped
											).length
										}
									</span>
								</div>

								<div className='pb-4'>
									<a
										className='cursor-pointer no-underline'
										onClick={() => router.push('/my-shows/plan-to-watch')}
									>
										Plan to Watch:{' '}
									</a>
									<span>
										{
											usersShowsData?.usersShows?.filter(
												show => show?.status === WatchStatusTypes.Dropped
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

export default MyShows;

export const getServerSideProps = getClientAuthSession(async _ctx => {
	return { props: { hideScrollBar: true } };
});
