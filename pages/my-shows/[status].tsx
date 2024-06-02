import { useState, useEffect } from 'react';
import Head from 'next/head';
import MyMediaList from 'components/MyMedia/MyMediaList';
import * as Queries from '../../graphql/queries';
import { Circles } from 'react-loading-icons';
import { CommonMethods } from 'utils/CommonMethods';
import { useRouter } from 'next/router';
import { TStatusParam } from '@ts/types';
import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client';
import { UserShow, WatchStatusTypes } from 'graphql/generated/code-gen/graphql';

const Status = () => {
	const { data: session, status } = useSession();

	const router = useRouter();

	const { data: usersShowsData, loading: usersShowsLoading } = useQuery(
		Queries.USERS_SHOWS,
		{
			fetchPolicy: 'network-only',
		}
	);

	const [myShows, setMyShows] = useState<UserShow[]>([]);

	useEffect(() => {
		if (status && status !== 'loading' && router.query.status) {
			if (
				!session ||
				!CommonMethods.statusParams.has(router.query.status as string)
			) {
				router.replace('/');
				return;
			}

			if (usersShowsData?.usersShows) {
				const statusParam = router.query.status;
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
		}
	}, [router, session, status, usersShowsData?.usersShows]);

	if (
		usersShowsLoading ||
		status === 'loading' ||
		router.query.status === undefined
	) {
		return (
			<section className='flex h-screen items-center justify-center'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	if (
		!CommonMethods.statusParams.has(router.query.status as string) ||
		!session
	) {
		router.replace('/');
		return;
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
				<MyMediaList
					status={router.query.status as TStatusParam}
					myMedias={myShows}
					mediaType='SHOWS'
				/>
			</main>
		</>
	);
};

export default Status;
