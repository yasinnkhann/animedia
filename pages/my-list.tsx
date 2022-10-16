// HANDLED ON SERVER SIDE, (DOESN'T SHOW LOADER)
import React from 'react';
import type { NextPage } from 'next';
import * as Queries from '../graphql/queries';
import { useSession } from 'next-auth/react';
import { getClientAuthSession } from '../lib/nextAuth/get-client-auth-session';
import { useGQLQuery } from '../hooks/useGQL';
import { IUseGQLQuery } from '@ts/interfaces';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';

const MyList: NextPage = () => {
	const { data: session } = useSession();

	const { data: userData }: IUseGQLQuery<NexusGenObjects['User']> = useGQLQuery(
		Queries.QUERY_GET_USER
	);

	console.log('USER DATA: ', userData);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<h1>{session?.user?.email!}</h1>
		</div>
	);
};

export default MyList;

export const getServerSideProps = getClientAuthSession(async _ctx => {
	return { props: {} };
});

// HANDLED ON CLIENT SIDE, (SHOWS LOADER)
// import React from 'react';
// import { useRouter } from 'next/router';
// import { useSession } from 'next-auth/react';
// import type { NextPage } from 'next';

// const MyList: NextPage = () => {
// 	const router = useRouter();

// 	const { data: session, status } = useSession({
// 		required: true,
// 		onUnauthenticated: () => {
// 			router.push('/');
// 		},
// 	});

// 	if (status === 'loading') {
// 		return (
// 			<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
// 				Loading...
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
// 			{session?.user?.email}
// 		</div>
// 	);
// };

// export default MyList;
