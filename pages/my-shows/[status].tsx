import React from 'react';
import { request } from 'graphql-request';
import { GetServerSideProps } from 'next';
import * as Queries from '../../graphql/queries';
import { SERVER_BASE_URL } from '../../utils/URLs';
import { authOptions as nextAuthOptions } from '../../pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import {
	NexusGenObjects,
	NexusGenEnums,
} from '../../graphql/generated/nexus-typegen';

interface Props {
	shows: NexusGenObjects['UserShow'][];
}

const Status = ({ shows }: Props) => {
	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<section>
				{shows.map(show => (
					<div key={show.id}>
						<p>{show.name}</p>
					</div>
				))}
			</section>
		</section>
	);
};

export default Status;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const statusParam = ctx.params?.status as string;
	console.log('STATUS: ', statusParam);

	let status: NexusGenEnums['WatchStatusTypes'];

	if (statusParam === 'watching') {
		status = 'WATCHING';
	} else if (statusParam === 'completed') {
		status = 'COMPLETED';
	} else if (statusParam === 'on-hold') {
		status = 'ON_HOLD';
	} else if (statusParam === 'dropped') {
		status = 'DROPPED';
	} else if (statusParam === 'plan-to-watch') {
		status = 'PLAN_TO_WATCH';
	}

	const session = await unstable_getServerSession(
		ctx.req,
		ctx.res,
		nextAuthOptions
	);

	const data = await request(SERVER_BASE_URL, Queries.QUERY_GET_USERS_SHOWS, {
		userId: session?.user?.id,
	});

	const shows = data.usersShows.filter(
		(show: NexusGenObjects['UserShow']) => show.status === status
	);

	return { props: { shows } };
};
