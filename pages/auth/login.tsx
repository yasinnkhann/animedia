import Head from 'next/head';
import Link from 'next/link';
import loginValidate from '../../lib/nextAuth/account-validate';
import * as Queries from '../../graphql/queries';
import GoogleIcon from '../../assets/google-icon.svg';
import FacebookIcon from '../../assets/facebook-icon.svg';
import TwitterIcon from '../../assets/twitter-icon.svg';
import { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { HiAtSymbol } from 'react-icons/hi';
import { getProviders, signIn } from 'next-auth/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { useGQLQuery } from '../../hooks/useGQL';
import { IUseGQLQuery } from '@ts/interfaces';
import {
	NexusGenArgTypes,
	NexusGenObjects,
} from '../../graphql/generated/nexus-typegen';

export default function Login({
	providers,
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<div className='mt-40'>
			{providers &&
				Object.values(providers).map((provider: any) => (
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
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const providers = await getProviders();
	const csrfToken = await getCsrfToken({ req });

	console.log('PROVIDERS: ', providers);

	return {
		props: {
			providers,
			csrfToken,
		},
	};
};
