import React, { useState, useEffect } from 'react';
import MyShowsList from 'components/UI/MyMediaUI/MyShowsList';
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
import { getClientAuthSession } from '../../lib/nextAuth/get-client-auth-session';

const Status = () => {
	const { data: session, status } = useSession();

	const router = useRouter();

	if (!session && status === 'unauthenticated') {
		router.push('/');
	}

	const { data: usersShowsData }: IUseGQLQuery<NexusGenObjects['UserShow'][]> =
		useGQLQuery(Queries.QUERY_GET_USERS_SHOWS, {
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

	return (
		<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<MyShowsList
				status={router.query.status as TStatusParam}
				myShows={myShows}
			/>
		</main>
	);
};

export default Status;

export const getServerSideProps = getClientAuthSession(async _ctx => {
	return { props: {} };
});
