import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import MyShowsList from 'components/UI/MyMediaUI/MyShowsList';
import * as Queries from '../../graphql/queries';
import { Circles } from 'react-loading-icons';
import { statusParams } from 'utils/statusParams';
import { useRouter } from 'next/router';
import { TStatusParam } from '@ts/types';
import { useGQLQuery } from '../../hooks/useGQL';
import { useSession } from 'next-auth/react';
import {
	NexusGenObjects,
	NexusGenEnums,
} from '../../graphql/generated/nexus-typegen';
import { getClientAuthSession } from '../../lib/nextAuth/get-client-auth-session';

const Status = () => {
	const { data: session, status } = useSession();

	const router = useRouter();

	if (!session && status === 'unauthenticated') {
		router.push('/');
	}

	const { data: usersShowsData, loading: usersShowsLoading } = useGQLQuery<
		NexusGenObjects['UserShow'][]
	>(Queries.GET_USERS_SHOWS, {
		fetchPolicy: 'network-only',
	});

	const [myShows, setMyShows] = useState<NexusGenObjects['UserShow'][]>([]);

	useEffect(() => {
		if (usersShowsData) {
			let statusParam = router.query.status;
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

			const showsFiltered = usersShowsData.filter(
				(show: NexusGenObjects['UserShow']) => show.status === status
			);
			setMyShows(showsFiltered);
		}
	}, [router.query.status, usersShowsData]);

	if (usersShowsLoading) {
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
					.join(' ')} - Shows`}</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				<MyShowsList
					status={router.query.status as TStatusParam}
					myShows={myShows}
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
