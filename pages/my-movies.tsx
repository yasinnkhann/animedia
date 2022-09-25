import React from 'react';
import type { NextPage } from 'next';
import { getClientAuthSession } from '../lib/nextAuth/get-client-auth-session';
import { useGQLQuery } from '../hooks/useGQL';
import { IUseGQLQuery } from '@ts/interfaces';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import * as Queries from '../graphql/queries';

const MyMovies: NextPage = () => {
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
				{usersMoviesData?.map(movie => (
					<div key={movie.id}>
						<p>{movie.name}</p>
					</div>
				))}
			</section>
		</section>
	);
};

export default MyMovies;

export const getServerSideProps = getClientAuthSession(async _ctx => {
	return { props: {} };
});
