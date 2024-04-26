import Head from 'next/head';
import Link from 'next/link';
import { loginValidate } from '../../lib/nextAuth/account-validate';
import * as Queries from '../../graphql/queries';
import GoogleIcon from '../../assets/google-icon.svg';
import FacebookIcon from '../../assets/facebook-icon.svg';
import DiscordIcon from '../../assets/discord-icon.svg';
import { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { HiAtSymbol } from 'react-icons/hi';
import { getProviders, signIn } from 'next-auth/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { useQuery } from '@apollo/client';
import { ErrorRes } from 'graphql/generated/code-gen/graphql';

export default function Login({
	providers,
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [showPW, setShowPW] = useState(false);
	const [acctVerifiedErrs, setAcctVerifiedErrs] = useState<ErrorRes[]>([]);

	const router = useRouter();

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validate: loginValidate,
		onSubmit,
	});

	const { data: fetchAccountVerifiedData } = useQuery(
		Queries.ACCOUNT_VERIFIED,
		{
			variables: {
				email: formik.values.email,
			},
		}
	);

	async function onSubmit() {
		const { email, password } = formik.values;

		if (
			fetchAccountVerifiedData?.accountVerified?.errors?.length &&
			fetchAccountVerifiedData.accountVerified.errors.length > 0
		) {
			const filteredErrors =
				fetchAccountVerifiedData.accountVerified.errors.filter(
					(error): error is ErrorRes => error !== null
				);
			setAcctVerifiedErrs(filteredErrors);
			return;
		}

		const status = await signIn('credentials', {
			redirect: false,
			email: email,
			password: password,
			callbackUrl: '/',
		});

		if (status?.ok) {
			setAcctVerifiedErrs([]);
			router.push(status.url!);
		}
	}

	return (
		<>
			<Head>
				<title>Login</title>
			</Head>

			<main className='mx-auto mt-[calc(var(--header-height-mobile)+1rem)] flex w-3/4 flex-col gap-10'>
				<div>
					<h1 className='py-4 text-4xl font-bold text-gray-800'>Login</h1>
				</div>

				<form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
					{formik.errors.email && formik.touched.email && (
						<span className='text-rose-500'>{formik.errors.email}</span>
					)}

					<div
						className={`relative flex h-[2.5rem] rounded-xl border ${
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
							className='w-full border-none bg-inherit pl-4 outline-none'
						/>
						<span className='flex items-center px-4'>
							<HiAtSymbol size={25} />
						</span>
					</div>

					{formik.errors.password && formik.touched.password && (
						<span className='text-rose-500'>{formik.errors.password}</span>
					)}

					<div
						className={`relative flex h-[2.5rem] rounded-xl border ${
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
							className='w-full border-none bg-inherit pl-4 outline-none'
						/>
						<span
							className='flex cursor-pointer items-center px-4'
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
							className='w-full rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 py-3 text-lg text-gray-50'
							type='submit'
						>
							Login
						</button>
					</div>

					<section className='flex flex-col justify-center'>
						<div className='flex justify-center'>
							<button
								className='flex w-1/2 justify-center gap-2 border py-3 hover:bg-gray-200'
								type='button'
								onClick={() => signIn('google', { callbackUrl: '/' })}
							>
								<div className='flex w-[50%] items-center justify-center'>
									<div className='mr-3'>
										<GoogleIcon aria-label='Google Icon' />
									</div>
									<p>Sign in with Google</p>
								</div>
							</button>
						</div>

						<div className='flex justify-center'>
							<button
								className='flex w-1/2 justify-center gap-2 border py-3 hover:bg-gray-200'
								type='button'
								onClick={() => signIn('facebook', { callbackUrl: '/' })}
							>
								<div className='flex w-[50%] items-center justify-center'>
									<div className='mr-3'>
										<FacebookIcon aria-label='Facebook Icon' />
									</div>
									<p>Sign in with Facebook</p>
								</div>
							</button>
						</div>

						<div className='flex justify-center'>
							<button
								className='flex w-1/2 justify-center gap-2 border py-3 hover:bg-gray-200'
								type='button'
								onClick={() => signIn('discord', { callbackUrl: '/' })}
							>
								<div className='flex w-[50%] items-center justify-center'>
									<div className='mr-3'>
										<DiscordIcon aria-label='Twitter Icon' />
									</div>
									<p>Sign in with Discord</p>
								</div>
							</button>
						</div>
					</section>
				</form>

				{acctVerifiedErrs.map((err, idx) => (
					<span key={idx} className='text-center text-rose-500'>
						{err.message}
					</span>
				))}

				<div className='flex flex-col items-center'>
					<p className='text-center text-gray-400 '>
						Don&apos;t have an account yet?{' '}
					</p>
					<Link href='/auth/register'>Register</Link>
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
