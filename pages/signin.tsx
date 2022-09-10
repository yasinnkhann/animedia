import React from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';

const SignIn = ({
	providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	{
		console.log(providers);
	}
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

export const getServerSideProps: GetServerSideProps = async () => {
	const providers = await getProviders();
	return {
		props: {
			providers,
		},
	};
};
