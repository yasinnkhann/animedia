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
import { getDetailsPageRoute } from '../../utils/getDetailsPageRoute';
import { useRouter } from 'next/router';
import { ESearchType } from '@ts/enums';

interface Props {
	movies: NexusGenObjects['UserMovie'][];
}

const Status = ({ movies }: Props) => {
	const router = useRouter();
	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<section>
				{movies.map(movie => (
					<div key={movie.id}>
						<a
							onClick={() =>
								router.push(
									getDetailsPageRoute(
										ESearchType.MOVIE,
										String(movie.id),
										movie.name
									)
								)
							}
						>
							{movie.name}
						</a>
					</div>
				))}
			</section>
		</section>
	);
};

export default Status;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const statusParam = ctx.params?.status as string;

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

	const data = await request(SERVER_BASE_URL, Queries.QUERY_GET_USERS_MOVIES, {
		userId: session?.user?.id,
	});

	const movies = data.usersMovies.filter(
		(movie: NexusGenObjects['UserMovie']) => movie.status === status
	);

	return { props: { movies } };
};
