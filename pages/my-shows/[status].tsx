import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import MyShowsList from 'components/UI/MyMediaUI/MyShowsList';
import * as Queries from '../../graphql/queries';
import { Circles } from 'react-loading-icons';
import { statusParams } from 'utils/statusParams';
import { useRouter } from 'next/router';
import { TStatusParam } from '@ts/types';
import { useSession } from 'next-auth/react';
import { getClientAuthSession } from '../../lib/nextAuth/get-client-auth-session';
import { useQuery } from '@apollo/client';
import { UserShow, WatchStatusTypes } from 'graphql/generated/code-gen/graphql';

const Status = () => {
	const { data: session, status } = useSession();

	const router = useRouter();

	if (!session && status === 'unauthenticated') {
		router.push('/');
	}

	const { data: usersShowsData, loading: usersShowsLoading } = useQuery(
		Queries.GET_USERS_SHOWS,
		{
			fetchPolicy: 'network-only',
		}
	);

	const [myShows, setMyShows] = useState<UserShow[]>([]);

	useEffect(() => {
		if (usersShowsData?.usersShows) {
			let statusParam = router.query.status;
			let status: WatchStatusTypes;

			if (statusParam === 'watching') {
				status = WatchStatusTypes.Watching;
			} else if (statusParam === 'completed') {
				status = WatchStatusTypes.Completed;
			} else if (statusParam === 'on-hold') {
				status = WatchStatusTypes.OnHold;
			} else if (statusParam === 'dropped') {
				status = WatchStatusTypes.Dropped;
			} else if (statusParam === 'plan-to-watch') {
				status = WatchStatusTypes.PlanToWatch;
			}

			const showsFiltered = usersShowsData.usersShows.filter(
				show => show?.status === status
			);
			setMyShows(showsFiltered as UserShow[]);
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
