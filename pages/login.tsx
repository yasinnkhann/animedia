import Head from 'next/head';
import Link from 'next/link';
import loginValidate from '../lib/nextAuth/account-validate';
import * as Queries from '../graphql/queries';
import GoogleIcon from '../assets/google-icon.svg';
import FacebookIcon from '../assets/facebook-icon.svg';
import TwitterIcon from '../assets/twitter-icon.svg';
import { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { HiAtSymbol } from 'react-icons/hi';
import { getProviders, signIn } from 'next-auth/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { useGQLQuery } from '../hooks/useGQL';
import { IUseGQLQuery } from '@ts/interfaces';
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
					{formik.errors.email && formik.touched.email && (
						<span className='text-rose-500'>{formik.errors.email}</span>
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

					{formik.errors.password && formik.touched.password && (
						<span className='text-rose-500'>{formik.errors.password}</span>
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
							{showPW ? (
								<BsFillEyeFill size={25} />
							) : (
								<BsFillEyeSlashFill size={25} />
							)}
						</span>
					</div>

					<div>
						<button
							className='w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md py-3 text-gray-50 text-lg'
							type='submit'
						>
							Login
						</button>
					</div>

					<section className='flex flex-col justify-center'>
						<div className='flex justify-center'>
							<button
								className='w-1/2 border py-3 gap-2 hover:bg-gray-200 flex justify-center'
								type='button'
								onClick={() => signIn('google', { callbackUrl: '/' })}
							>
								<div className='w-[50%] flex justify-center items-center'>
									<div className='mr-3'>
										<GoogleIcon aria-label='Google Icon' />
									</div>
									<p>Sign in with Google</p>
								</div>
							</button>
						</div>

						<div className='flex justify-center'>
							<button
								className='w-1/2 border py-3 gap-2 hover:bg-gray-200 flex justify-center'
								type='button'
								onClick={() => signIn('facebook', { callbackUrl: '/' })}
							>
								<div className='w-[50%] flex justify-center items-center'>
									<div className='mr-3'>
										<FacebookIcon aria-label='Facebook Icon' />
									</div>
									<p>Sign in with Facebook</p>
								</div>
							</button>
						</div>

						<div className='flex justify-center'>
							<button
								className='w-1/2 border py-3 gap-2 hover:bg-gray-200 flex justify-center'
								type='button'
								onClick={() => signIn('twitter', { callbackUrl: '/' })}
							>
								<div className='w-[50%] flex justify-center items-center'>
									<div className='mr-3'>
										<TwitterIcon aria-label='Twitter Icon' />
									</div>
									<p>Sign in with Twitter</p>
								</div>
							</button>
						</div>
					</section>
				</form>

				{acctVerifiedErr.error && (
					<span className='text-rose-500 text-center'>
						{acctVerifiedErr.error}
					</span>
				)}

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
