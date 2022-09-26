import React from 'react';
import type { NextPage } from 'next';
import { getClientAuthSession } from '../lib/nextAuth/get-client-auth-session';
import { useGQLQuery } from '../hooks/useGQL';
import { IUseGQLQuery } from '@ts/interfaces';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import * as Queries from '../graphql/queries';

const MyShows: NextPage = () => {
	const { data: usersShowsData }: IUseGQLQuery<NexusGenObjects['UserShow'][]> =
		useGQLQuery(Queries.QUERY_GET_USERS_SHOWS);

	console.log('USERS SHOWS DATA: ', usersShowsData);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<h1>My Shows</h1>
			<section>
				{/* {usersShowsData?.map(show => (
					<div key={show.id}>
						<p>{show.name}</p>
					</div>
				))} */}
				<div>
					<a>Watching:</a>
					<span>
						{usersShowsData?.filter(show => show.status === 'WATCHING').length}
					</span>
				</div>

				<div>
					<a>Completed:</a>
					<span>
						{usersShowsData?.filter(show => show.status === 'COMPLETED').length}
					</span>
				</div>

				<div>
					<a>On-Hold:</a>
					<span>
						{usersShowsData?.filter(show => show.status === 'ON_HOLD').length}
					</span>
				</div>

				<div>
					<a>Dropped:</a>
					<span>
						{usersShowsData?.filter(show => show.status === 'DROPPED').length}
					</span>
				</div>

				<div>
					<a>Plan to Watch:</a>
					<span>
						{
							usersShowsData?.filter(show => show.status === 'PLAN_TO_WATCH')
								.length
						}
					</span>
				</div>
			</section>
		</div>
	);
};

export default MyShows;

export const getServerSideProps = getClientAuthSession(async _ctx => {
	return { props: {} };
});
