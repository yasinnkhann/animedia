import React from 'react';
import type { NextPage } from 'next';
import { getClientAuthSession } from '../../lib/nextAuth/get-client-auth-session';
import { useGQLQuery } from '../../hooks/useGQL';
import { IUseGQLQuery } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';
import * as Queries from '../../graphql/queries';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const MyShows: NextPage = () => {
	const router = useRouter();
	const { data: session } = useSession();

	const {
		data: usersShowsData,
	}: IUseGQLQuery<
		NexusGenObjects['UserShow'][],
		NexusGenArgTypes['Query']['usersShows']
	> = useGQLQuery<NexusGenArgTypes['Query']['usersShows']>(
		Queries.QUERY_GET_USERS_SHOWS,
		{
			variables: { userId: session?.user?.id as string },
		}
	);

	console.log('USERS SHOWS DATA: ', usersShowsData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<h1>My Shows</h1>
			<section>
				<div>
					<a onClick={() => router.push('/my-shows/watching')}>Watching:</a>
					<span>
						{usersShowsData?.filter(show => show.status === 'WATCHING').length}
					</span>
				</div>

				<div>
					<a onClick={() => router.push('/my-shows/completed')}>Completed:</a>
					<span>
						{usersShowsData?.filter(show => show.status === 'COMPLETED').length}
					</span>
				</div>

				<div>
					<a onClick={() => router.push('/my-shows/on-hold')}>On-Hold:</a>
					<span>
						{usersShowsData?.filter(show => show.status === 'ON_HOLD').length}
					</span>
				</div>

				<div>
					<a onClick={() => router.push('/my-shows/dropped')}>Dropped:</a>
					<span>
						{usersShowsData?.filter(show => show.status === 'DROPPED').length}
					</span>
				</div>

				<div>
					<a onClick={() => router.push('/my-shows/plan-to-watch')}>
						Plan to Watch:
					</a>
					<span>
						{
							usersShowsData?.filter(show => show.status === 'PLAN_TO_WATCH')
								.length
						}
					</span>
				</div>
			</section>
		</section>
	);
};

export default MyShows;

export const getServerSideProps = getClientAuthSession(async _ctx => {
	return { props: {} };
});
