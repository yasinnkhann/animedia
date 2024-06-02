import Head from 'next/head';
import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import { forgotPasswordValidate } from 'lib/nextAuth/account-validate';
import * as Mutations from '../../graphql/mutations';
import { Oval } from 'react-loading-icons';
import _ from 'lodash';

const ForgotPassword = () => {
	const [sendForgotPasswordEmail, { loading, data }] = useMutation(
		Mutations.SEND_FORGOT_PASSWORD_EMAIL
	);

	const formik = useFormik({
		initialValues: {
			email: '',
		},
		validate: forgotPasswordValidate,
		onSubmit,
	});

	async function onSubmit() {
		const { email } = formik.values;
		try {
			await sendForgotPasswordEmail({
				variables: {
					email,
				},
			});
		} catch (err) {
			console.error(err);
		}
	}
	return (
		<>
			<Head>
				<title>Forgot your Password</title>
			</Head>

			<main className='mx-auto mt-[calc(var(--header-height-mobile))] flex w-full items-center justify-center'>
				<section className='mt-16 w-full max-w-md rounded-lg bg-white p-8 shadow-md'>
					<div className='w-full max-w-lg space-y-8'>
						<div>
							<h2 className='text-center text-3xl font-extrabold text-gray-900'>
								Forgot your password?
							</h2>

							<p className='mt-8 text-center text-sm text-gray-600'>
								Enter your email address and we&apos;ll send you a link to reset your password.
							</p>
						</div>
						<form className='space-y-6' onSubmit={formik.handleSubmit}>
							<div className='-space-y-px rounded-md shadow-sm'>
								<div>
									<label htmlFor='email-address' className='sr-only'>
										Email address
									</label>
									<input
										{...formik.getFieldProps('email')}
										type='email'
										name='email'
										required
										placeholder='Email address'
										className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
									/>
								</div>
							</div>

							<div>
								<button
									type='submit'
									className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
								>
									Send reset link
								</button>
							</div>

							{loading && !data && (
								<div className='flex justify-center'>
									<Oval stroke='#00b3ff' />
								</div>
							)}

							{!loading && data && _.isEmpty(data.sendForgotPasswordEmail?.errors) && (
								<p className='text-center text-green-600'>Reset link has been sent</p>
							)}

							{!loading &&
								data &&
								!_.isEmpty(data.sendForgotPasswordEmail?.errors) &&
								data.sendForgotPasswordEmail?.errors.map((err, idx) => (
									<div key={idx} className='flex flex-col items-center'>
										<p className='text-red-500'>{err.message}</p>
									</div>
								))}

							{!loading && data && _.isEmpty(data.sendForgotPasswordEmail?.errors) && (
								<div>
									<p className='text-center'>
										Please check your email to click the link and enter your new password.
									</p>
								</div>
							)}
						</form>
					</div>
				</section>
			</main>
		</>
	);
};

export default ForgotPassword;
