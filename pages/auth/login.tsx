import Head from 'next/head';
import Link from 'next/link';
import { loginValidate } from '../../lib/nextAuth/account-validate';
import * as Queries from '../../graphql/queries';
import GoogleIcon from '../../assets/google-icon.svg';
import FacebookIcon from '../../assets/facebook-icon.svg';
import DiscordIcon from '../../assets/discord-icon.svg';
import _ from 'lodash';
import { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { signIn } from 'next-auth/react';
import { Field, Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import { ILogin } from '@ts/interfaces';
import { ThreeDots } from 'react-loading-icons';
import { CommonMethods } from 'utils/CommonMethods';
import { ACCOUNT_NOT_FOUND_MESSAGE } from 'utils/constants';

export default function Login() {
	const [showPW, setShowPW] = useState(false);

	const router = useRouter();

	const [fetchAccountVerifiedData, { loading, error }] = useLazyQuery(
		Queries.ACCOUNT_VERIFIED
	);

	const handleSubmitBtnClick = (
		formikErrors: FormikErrors<{
			email: string;
			password: string;
		}>
	) => {
		if (formikErrors.email || formikErrors.password) {
			CommonMethods.notifyError(
				ACCOUNT_NOT_FOUND_MESSAGE,
				'bottom-center',
				3000
			);
		} else return;
	};

	const handleSubmit = async (
		values: ILogin,
		_formikHelpers: FormikHelpers<ILogin>
	) => {
		const { email, password } = values;

		const { data: { accountVerified } = {} } = await fetchAccountVerifiedData({
			variables: { email },
		});

		if (error || (accountVerified && accountVerified.errors.length > 0)) {
			CommonMethods.notifyError(
				ACCOUNT_NOT_FOUND_MESSAGE,
				'bottom-center',
				3000
			);
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
									onClick={() => handleSubmitBtnClick(formikProps.errors)}
								>
									Login
								</button>
								{loading && (
									<div className='flex justify-center'>
										<ThreeDots className='h-[2rem] w-[4rem]' stroke='#00b3ff' />
									</div>
								)}
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
