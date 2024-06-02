import { useState, useEffect } from 'react';
import Head from 'next/head';
import MyMediaList from 'components/MyMedia/MyMediaList';
import * as Queries from '../graphql/queries';
import { Circles } from 'react-loading-icons';
import { CommonMethods } from 'utils/CommonMethods';
import { useRouter } from 'next/router';
import { TStatusParam } from '@ts/types';
import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client';
import {
	UserGame,
	UserShow,
	WatchStatusTypes,
} from 'graphql/generated/code-gen/graphql';

const MyGames = () => {
	const { data: session, status } = useSession();

	const router = useRouter();

	const { data: usersGamesData, loading: usersGamesLoading } = useQuery(
		Queries.USERS_GAMES,
		{
			fetchPolicy: 'network-only',
		}
	);

	const [myGames, setMyGames] = useState<UserGame[]>([]);

	useEffect(() => {
		if (
			usersGamesData?.usersGames &&
			Array.isArray(usersGamesData.usersGames)
		) {
			setMyGames(usersGamesData.usersGames as UserGame[]);
		}
	}, [usersGamesData?.usersGames]);

	if (usersGamesLoading || status === 'loading') {
		return (
			<section className='flex h-screen items-center justify-center'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>My Games</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				<MyMediaList
					status={router.query.status as TStatusParam}
					myMedias={myGames}
					mediaType='GAMES'
				/>
			</main>
		</>
	);
};

export default MyGames;
