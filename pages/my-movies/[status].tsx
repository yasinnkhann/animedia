import React, { useState, useEffect } from 'react';
import MyMoviesList from 'components/MyMoviesList';
import * as Queries from '../../graphql/queries';
import { useRouter } from 'next/router';
import { TStatusParam } from '@ts/types';
import { IUseGQLQuery } from '@ts/interfaces';
import { useGQLQuery } from '../../hooks/useGQL';
import { useSession } from 'next-auth/react';
import {
	NexusGenObjects,
	NexusGenEnums,
} from '../../graphql/generated/nexus-typegen';

const Status = () => {
	const router = useRouter();
	const { data: session, status } = useSession();

	if (!session && status === 'unauthenticated') {
		router.push('/');
	}

	const {
		data: usersMoviesData,
	}: IUseGQLQuery<NexusGenObjects['UserMovie'][]> = useGQLQuery(
		Queries.QUERY_GET_USERS_MOVIES
	);

	const [myMovies, setMyMovies] = useState<NexusGenObjects['UserMovie'][]>([]);

	useEffect(() => {
		if (usersMoviesData) {
			let statusParam = router.query.status as TStatusParam;
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

			const moviesFiltered = usersMoviesData.filter(
				(movie: NexusGenObjects['UserMovie']) => movie.status === status
			);
			setMyMovies(moviesFiltered);
		}
	}, [router.query.status, usersMoviesData]);

	console.log('MOVIES: ', myMovies);

	return (
		<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<MyMoviesList
				status={router.query.status as TStatusParam}
				myMovies={myMovies}
			/>
		</main>
	);
};

export default Status;
