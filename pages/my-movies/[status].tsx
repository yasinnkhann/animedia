import React from 'react';
import { request } from 'graphql-request';
import { GetServerSideProps } from 'next';
import * as Queries from '../../graphql/queries';
import { SERVER_BASE_URL } from '../../utils/URLs';
import { getClientAuthSession } from '../../lib/nextAuth/get-client-auth-session';
import { useSession } from 'next-auth/react';
import { authOptions as nextAuthOptions } from '../../pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { context as graphqlCtx } from '../../graphql/context';

interface Props {}

const Status = (props: Props) => {
	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>status</div>
	);
};

export default Status;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const status = ctx.params?.status as string;
	console.log('STATUS: ', status);
	await graphqlCtx(ctx);

	// const session = await unstable_getServerSession(
	// 	ctx.req,
	// 	ctx.res,
	// 	nextAuthOptions
	// );

	// console.log('SESSION: ', session);

	const data = await request(SERVER_BASE_URL, Queries.QUERY_GET_USERS_MOVIES);

	console.log('DATA: ', data);

	return { props: {} };
};

// export const getServerSideProps: GetServerSideProps = async ctx => {
// 	const status = ctx.params?.status as string;
// 	console.log('STATUS: ', status);
// 	const data = await request(SERVER_BASE_URL, Queries.QUERY_GET_USERS_MOVIES);
// 	console.log('DATA: ', data);

// 	const movies = data.filter((movie: any) => movie.status === status);
// 	console.log('MOVIES: ', movies);
// 	return {
// 		props: {
// 			movies,
// 		},
// 	};
// };
