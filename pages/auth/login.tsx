import Head from 'next/head';
import Link from 'next/link';
import { loginValidate } from '../../lib/nextAuth/account-validate';
import * as Queries from '../../graphql/queries';
import GoogleIcon from '../../assets/google-icon.svg';
import FacebookIcon from '../../assets/facebook-icon.svg';
import DiscordIcon from '../../assets/discord-icon.svg';
import { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { getProviders, signIn } from 'next-auth/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { useLazyQuery } from '@apollo/client';
import _ from 'lodash';

export default function Login({
	providers,
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [showPW, setShowPW] = useState(false);

	const router = useRouter();

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validate: loginValidate,
		onSubmit,
	});

	const [fetchAccountVerifiedData, { data, loading, error }] = useLazyQuery(
		Queries.ACCOUNT_VERIFIED
	);

	async function onSubmit() {
		const { email, password } = formik.values;

		await fetchAccountVerifiedData({
			variables: { email: formik.values.email },
		});

		if (
			error ||
			!data ||
			(data.accountVerified && data.accountVerified.errors.length > 0)
		) {
			return;
		}

		const status = await signIn('credentials', {
			redirect: false,
			email: email,
			password: password,
			callbackUrl: '/',
		});

		if (status?.ok && status.url) {
			router.push(status.url);
		}
	}

	return (
		<>
			<Head>
				<title>Login</title>
			</Head>

			<main className='mx-auto mt-[calc(var(--header-height-mobile))] flex w-full items-center justify-center'>
				<section className='mt-8 w-full max-w-md rounded-lg bg-white p-8 shadow-md'>
					<div className='mb-6 flex items-center justify-center'>
						<h1 className='text-4xl font-bold text-gray-800'>Animedia</h1>
					</div>

					<form className='flex flex-col gap-4' onSubmit={formik.handleSubmit}>
						<div className='relative'>
							<input
								{...formik.getFieldProps('email')}
								type='email'
								name='email'
								placeholder='Email'
								className='w-full rounded-lg border py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none'
							/>
						</div>

						<div className='relative'>
							<input
								{...formik.getFieldProps('password')}
								type={showPW ? 'text' : 'password'}
								name='password'
								placeholder='Password'
								className='w-full rounded-lg border py-3 pl-10 pr-12 focus:border-blue-500 focus:outline-none'
							/>
							<div className='absolute right-3 top-1/2 -translate-y-1/2 transform'>
								<button
									type='button'
									onClick={() => setShowPW(!showPW)}
									className='text-gray-500 hover:text-blue-500 focus:outline-none'
								>
									{showPW ? (
										<BsFillEyeSlashFill size={24} />
									) : (
										<BsFillEyeFill size={24} />
									)}
								</button>
							</div>
						</div>

						<button
							className='rounded-lg bg-blue-500 py-3 font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none'
							type='submit'
						>
							Login
						</button>
					</form>

					<div className='mt-4 flex flex-col gap-4'>
						<button
							className='flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 font-semibold hover:bg-gray-100 focus:outline-none'
							type='button'
							onClick={() => signIn('google', { callbackUrl: '/' })}
						>
							<GoogleIcon aria-label='Google Icon' />
							<span>Sign in with Google</span>
						</button>

						<button
							className='flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 font-semibold hover:bg-gray-100 focus:outline-none'
							type='button'
							onClick={() => signIn('facebook', { callbackUrl: '/' })}
						>
							<FacebookIcon aria-label='Facebook Icon' />
							<span>Sign in with Facebook</span>
						</button>

						<button
							className='flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 font-semibold hover:bg-gray-100 focus:outline-none'
							type='button'
							onClick={() => signIn('discord', { callbackUrl: '/' })}
						>
							<DiscordIcon aria-label='Twitter Icon' />
							<span>Sign in with Discord</span>
						</button>
					</div>

					{data &&
						data.accountVerified &&
						data.accountVerified.errors.length > 0 && (
							<div className='mt-4 flex flex-col'>
								{data.accountVerified.errors.map((err, idx) => (
									<span key={idx} className='text-center text-red-500'>
										{err.message}
									</span>
								))}
							</div>
						)}

					<div className='mt-4 flex flex-col items-center'>
						<Link href='/auth/register'>
							<a className='mb-2 text-center text-gray-600 hover:text-blue-500'>
								Don&apos;t have an account?
							</a>
						</Link>
						<Link href='/auth/forgot-password'>
							<a className='text-center text-gray-600 hover:text-blue-500'>
								Forgot your password?
							</a>
						</Link>
					</div>
				</section>
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
