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
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { useLazyQuery } from '@apollo/client';
import _ from 'lodash';
import { toast } from 'react-hot-toast';
import { ILogin } from '@ts/interfaces';

export default function Login({
	_providers,
	_csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [showPW, setShowPW] = useState(false);

	const router = useRouter();

	const [fetchAccountVerifiedData, { data, error }] = useLazyQuery(
		Queries.ACCOUNT_VERIFIED
	);

	const notifyError = (error: string) => {
		toast.error(error, {
			position: 'bottom-center',
			duration: 3000,
		});
	};

	const handleSubmit = async (
		values: ILogin,
		_formikHelpers: FormikHelpers<ILogin>
	) => {
		const { email, password } = values;

		await fetchAccountVerifiedData({
			variables: { email },
		});

		if (
			error ||
			!data ||
			(data.accountVerified && data.accountVerified.errors.length > 0)
		) {
			notifyError('Failed to verify account.');
			return;
		}

		const status = await signIn('credentials', {
			redirect: false,
			email,
			password,
			callbackUrl: '/',
		});

		if (status?.ok && status.url) {
			router.push(status.url);
		}
	};

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

					<Formik
						initialValues={{
							email: '',
							password: '',
						}}
						validate={loginValidate}
						onSubmit={(values, formikHelpers) => {
							handleSubmit(values, formikHelpers);
						}}
					>
						{formikProps => (
							<Form className='flex flex-col gap-4'>
								<div className='relative'>
									<Field
										type='email'
										name='email'
										placeholder='Email'
										className='w-full rounded-lg border py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none'
									/>
								</div>
								<div className='relative'>
									<Field
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
							</Form>
						)}
					</Formik>

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
