import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import { HiAtSymbol, HiFingerPrint } from 'react-icons/hi';
import { getProviders, signIn } from 'next-auth/react';
import { useFormik } from 'formik';
import loginValidate from '../lib/nextAuth/account-validate';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { useGQLQuery } from '../hooks/useGQL';
import { IUseGQLQuery } from '@ts/interfaces';
import * as Queries from '../graphql/queries';
import {
	NexusGenArgTypes,
	NexusGenObjects,
} from '../graphql/generated/nexus-typegen';

export default function Login({
	providers,
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [showPW, setShowPW] = useState(false);
	const [acctVerifiedErr, setAcctVerifiedErr] = useState<{
		error: null | string;
	}>({ error: null });

	const router = useRouter();

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validate: loginValidate,
		onSubmit,
	});

	console.log('AcctVerifiedErr: ', acctVerifiedErr);

	const {
		fetchData: fetchAccountVerifiedData,
		lazyData: fetchAccountVerifiedLazyData,
	}: IUseGQLQuery<
		NexusGenObjects['accountVerifiedRes'],
		NexusGenArgTypes['Query']['accountVerified']
	> = useGQLQuery<NexusGenArgTypes['Query']['accountVerified']>(
		Queries.QUERY_ACCOUNT_VERIFIED,
		{
			variables: {
				email: formik.values.email,
			},
		}
	);

	const oAuthProviders = Object.values(providers).filter(
		(provider: any) => provider.type === 'oauth'
	);

	async function onSubmit() {
		const { email, password } = formik.values;

		const { data } = await fetchAccountVerifiedData({
			variables: {
				email: formik.values.email,
			},
		});

		const acctVerifiedData: typeof fetchAccountVerifiedLazyData =
			data?.[Object.keys(data)[0]];

		console.log('acctVerifiedData: ', acctVerifiedData);

		if (acctVerifiedData?.error) {
			setAcctVerifiedErr({
				error: acctVerifiedData.error,
			});
			return;
		}
		const status = await signIn('credentials', {
			redirect: false,
			email: email,
			password: password,
			callbackUrl: '/',
		});

		if (status?.ok) {
			setAcctVerifiedErr({
				error: null,
			});
			router.push(status.url as any);
		}
	}

	return (
		<>
			<Head>
				<title>Login</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)] w-3/4 mx-auto flex flex-col gap-10'>
				<div>
					<h1 className='text-gray-800 text-4xl font-bold py-4'>Login</h1>
				</div>

				<form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
					{formik.errors.email && formik.touched.email ? (
						<span className='text-rose-500'>{formik.errors.email}</span>
					) : (
						<></>
					)}

					<div
						className={`border rounded-xl relative flex h-[2.5rem] ${
							formik.errors.email && formik.touched.email
								? 'border-rose-600'
								: ''
						}`}
					>
						<input
							{...formik.getFieldProps('email')}
							type='email'
							name='email'
							placeholder='Email'
							className='w-full border-none outline-none bg-inherit pl-4'
						/>
						<span className='flex items-center px-4'>
							<HiAtSymbol size={25} />
						</span>
					</div>

					{formik.errors.password && formik.touched.password ? (
						<span className='text-rose-500'>{formik.errors.password}</span>
					) : (
						<></>
					)}
					<div
						className={`border rounded-xl relative flex h-[2.5rem] ${
							formik.errors.password && formik.touched.password
								? 'border-rose-600'
								: ''
						}`}
					>
						<input
							{...formik.getFieldProps('password')}
							type={`${showPW ? 'text' : 'password'}`}
							name='password'
							placeholder='Password'
							className='w-full border-none outline-none bg-inherit pl-4'
						/>
						<span
							className='flex items-center px-4 cursor-pointer'
							onClick={() => setShowPW(!showPW)}
						>
							<HiFingerPrint size={25} />
						</span>
					</div>

					<div>
						<button
							type='submit'
							className='w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md py-3 text-gray-50 text-lg'
						>
							Login
						</button>
					</div>

					<section>
						{oAuthProviders.map((provider: any) => (
							<div key={provider.id}>
								<button
									type='button'
									onClick={() => signIn(provider.id, { callbackUrl: '/' })}
									className='w-full border py-3 flex justify-center gap-2 hover:bg-gray-200'
								>
									Sign in with {provider.name}{' '}
									{/* <Image
										src={'/assets/github.svg'}
										alt=''
										width={25}
										height={25}
									/> */}
								</button>
							</div>
						))}
					</section>
				</form>

				<div className='flex flex-col items-center'>
					<p className='text-center text-gray-400 '>
						Don&apos;t have an account yet?{' '}
					</p>
					<Link href='/register'>Register</Link>
				</div>
			</main>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const providers = await getProviders();
	const csrfToken = await getCsrfToken({ req });

	return {
		props: {
			providers,
			csrfToken,
		},
	};
};
