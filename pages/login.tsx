import Head from 'next/head';
import Link from 'next/link';
import { HiAtSymbol, HiFingerPrint } from 'react-icons/hi';
import { useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { useFormik } from 'formik';
import loginValidate from '../lib/nextAuth/account-validate';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';

export default function Login({
	providers,
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [show, setShow] = useState(false);

	console.log('CSRF: ', csrfToken);

	const router = useRouter();

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validate: loginValidate,
		onSubmit,
	});

	const oAuthProviders = Object.values(providers).filter(
		(provider: any) => provider.type === 'oauth'
	);

	async function onSubmit(values: any) {
		const status = await signIn('credentials', {
			redirect: false,
			email: values.email,
			password: values.password,
			callbackUrl: '/',
		});

		if (status?.ok) router.push(status.url as any);
	}

	return (
		<>
			<Head>
				<title>Login</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				<div className='title'>
					<h1 className='text-gray-800 text-4xl font-bold py-4'>Login</h1>
				</div>

				<form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
					<div>
						<input
							{...formik.getFieldProps('email')}
							type='email'
							name='email'
							placeholder='Email'
						/>
						<span className='icon flex items-center px-4'>
							<HiAtSymbol size={25} />
						</span>
					</div>

					<div>
						<input
							{...formik.getFieldProps('password')}
							type={`${show ? 'text' : 'password'}`}
							name='password'
							placeholder='password'
						/>
						<span
							className='icon flex items-center px-4'
							onClick={() => setShow(!show)}
						>
							<HiFingerPrint size={25} />
						</span>
					</div>

					<div className='input-button'>
						<button type='submit'>Login</button>
					</div>

					<section>
						{oAuthProviders.map((provider: any) => (
							<div key={provider.id} className='input-button'>
								<button
									type='button'
									onClick={() => signIn(provider.id, { callbackUrl: '/' })}
								>
									Sign in with {provider.name}
								</button>
							</div>
						))}
					</section>
				</form>

				<p className='text-center text-gray-400 '>
					don&apos;t have an account yet?{' '}
					<Link href={'/register'}>
						<a className='text-blue-700'>Sign Up</a>
					</Link>
				</p>
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
