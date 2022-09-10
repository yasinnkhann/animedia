import React from 'react';
import { getProviders, signIn } from 'next-auth/react';

const SignIn = ({ providers }: any) => {
	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{Object.values(providers).map((provider: any) => (
				<div key={provider.name}>
					<button
						className='p-3 bg-blue-500 rounded-lg text-white'
						onClick={() => signIn(provider.id, { callbackUrl: '/' })}
					>
						Sign in with {provider.name}
					</button>
				</div>
			))}
		</div>
	);
};

export default SignIn;

export async function getServerSideProps(ctx: any) {
	const providers = await getProviders();
	return {
		props: {
			providers,
		},
	};
}
