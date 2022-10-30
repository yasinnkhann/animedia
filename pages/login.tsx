import Head from 'next/head';
import Link from 'next/link';
import { HiAtSymbol, HiFingerPrint } from 'react-icons/hi';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useFormik } from 'formik';
import loginValidate from '../lib/nextAuth/account-validate';
import { useRouter } from 'next/router';

export default function Login() {
	const [show, setShow] = useState(false);
	const router = useRouter();
	// formik hook
	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validate: loginValidate,
		onSubmit,
	});

	/**
	 * haleykennedy@gmail.com
	 * admin123
	 */

	async function onSubmit(values: any) {
		const status = await signIn('credentials', {
			redirect: false,
			email: values.email,
			password: values.password,
			callbackUrl: '/',
		});

		if (status?.ok) router.push(status.url as any);
	}

	// Google Handler function
	async function handleGoogleSignin() {
		signIn('google', { callbackUrl: '/' });
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

				{/* form */}
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
					{/* {formik.errors.email && formik.touched.email ? <span className='text-rose-500'>{formik.errors.email}</span> : <></>} */}

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

					{/* {formik.errors.password && formik.touched.password ? <span className='text-rose-500'>{formik.errors.password}</span> : <></>} */}
					{/* login buttons */}
					<div className='input-button'>
						<button type='submit'>Login</button>
					</div>
					<div className='input-button'>
						<button type='button' onClick={handleGoogleSignin}>
							Sign In with Google
						</button>
					</div>
				</form>

				{/* bottom */}
				<p className='text-center text-gray-400 '>
					don&apos;t have an account yet?{' '}
					<Link href={'/register'}>
						<a className='text-blue-700'>Sign Up</a>
					</Link>
				</p>
				{/* <button onClick={() => sendVerificationEmail()}>SEND EMAIL</button> */}
			</main>
		</>
	);
}

// import React from 'react';
// import { getProviders, signIn } from 'next-auth/react';
// import { GetServerSideProps } from 'next';
// import { InferGetServerSidePropsType } from 'next';

// const Login = ({
// 	providers,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
// 	{
// 		console.log(providers);
// 	}
// 	return (
// 		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
// 			{Object.values(providers).map((provider: any) => (
// 				<div key={provider.name}>
// 					<button
// 						className='p-3 bg-blue-500 rounded-lg text-white'
// 						onClick={() => signIn(provider.id, { callbackUrl: '/' })}
// 					>
// 						Sign in with {provider.name}
// 					</button>
// 				</div>
// 			))}
// 		</div>
// 	);
// };

// export default Login;

// export const getServerSideProps: GetServerSideProps = async () => {
// 	const providers = await getProviders();
// 	return {
// 		props: {
// 			providers,
// 		},
// 	};
// };
