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

	console.log('USERS MOVIES DATA: ', usersMoviesData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<h1>My Movies</h1>
			<section>
				<div>
					<a onClick={() => router.push('/my-movies/watching')}>Watching:</a>
					<span>
						{
							usersMoviesData?.filter(movie => movie.status === 'WATCHING')
								.length
						}
					</span>
				</div>

				<div>
					<a onClick={() => router.push('/my-movies/completed')}>Completed:</a>
					<span>
						{
							usersMoviesData?.filter(movie => movie.status === 'COMPLETED')
								.length
						}
					</span>
				</div>

				<div>
					<a onClick={() => router.push('/my-movies/on-hold')}>On-Hold:</a>
					<span>
						{
							usersMoviesData?.filter(movie => movie.status === 'ON_HOLD')
								.length
						}
					</span>
				</div>

				<div>
					<a onClick={() => router.push('/my-movies/dropped')}>Dropped:</a>
					<span>
						{
							usersMoviesData?.filter(movie => movie.status === 'DROPPED')
								.length
						}
					</span>
				</div>

				<div>
					<a onClick={() => router.push('/my-movies/plan-to-watch')}>
						Plan to Watch:
					</a>
					<span>
						{
							usersMoviesData?.filter(movie => movie.status === 'PLAN_TO_WATCH')
								.length
						}
					</span>
				</div>
			</section>
		</section>
	);
};

export default MyMovies;

export const getServerSideProps = getClientAuthSession(async _ctx => {
	return { props: {} };
});
