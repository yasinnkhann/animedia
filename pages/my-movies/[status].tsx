import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { getClientAuthSession } from '../../lib/nextAuth/get-client-auth-session';
import * as Queries from '../../graphql/queries';
import MyMoviesList from 'components/UI/MyMediaUI/MyMoviesList';
import { Circles } from 'react-loading-icons';
import { statusParams } from 'utils/statusParams';
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
	const { data: session, status } = useSession();

	const router = useRouter();

	if (!session && status === 'unauthenticated') {
		router.push('/');
	}

	const {
		data: usersMoviesData,
		loading: usersMoviesLoading,
	}: IUseGQLQuery<NexusGenObjects['UserMovie'][]> = useGQLQuery(
		Queries.QUERY_GET_USERS_MOVIES,
		{
			fetchPolicy: 'network-only',
		}
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

	if (usersMoviesLoading) {
		return (
			<section className='flex justify-center items-center h-screen'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>{`${(router.query.status as string)
					.split('-')
					.map(word => word[0].toUpperCase() + word.slice(1))
					.join(' ')} - Movies`}</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				<MyMoviesList
					status={router.query.status as TStatusParam}
					myMovies={myMovies}
				/>
			</main>
		</>
	);
};

export default Status;

export const getServerSideProps = getClientAuthSession(async ctx => {
	if (!statusParams.has(ctx.query.status as string)) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return { props: {} };
});
