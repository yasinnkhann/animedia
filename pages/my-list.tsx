import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const MyList = () => {
	const router = useRouter();

	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated: () => {
			router.push('/signin');
		},
	});

	if (status === 'loading') {
		return (
			<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				Loading...
			</div>
		);
	}

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{session?.user?.email}
		</div>
	);
};

export default MyList;
