// HANDLED ON SERVER SIDE, (DOESN'T SHOW LOADER)
import React from 'react';
import { useSession } from 'next-auth/react';
import type { NextPage } from 'next';
import { getClientAuthSession } from '../lib/nextAuth/get-client-auth-session';

const MyList: NextPage = () => {
	const { data: session } = useSession();
	console.log('SESSION: ', session);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<h1>{session?.user?.email!}</h1>
		</div>
	);
};

export default MyList;

export const getServerSideProps = getClientAuthSession(async ctx => {
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