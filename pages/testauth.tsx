import { useSession, signIn, signOut } from 'next-auth/react';

const TestAuth = () => {
	const { data: session } = useSession();
	if (session) {
		return (
			<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				Signed in as {session.user!.email} <br />
				<button onClick={() => signOut()} className='bg-green-500'>
					Sign out
				</button>
			</div>
		);
	}
	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			Not signed in <br />
			<button onClick={() => signIn()} className='bg-red-500'>
				Sign in
			</button>
		</div>
	);
};

export default TestAuth;
