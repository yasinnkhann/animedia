'use client';

import { useMutation } from '@apollo/client/react';
import { useFormik } from 'formik';
import { forgotPasswordValidate } from '../../../lib/nextAuth/account-validate';
import * as Mutations from '../../../graphql/mutations';
import { Oval } from 'react-loading-icons';
import _ from 'lodash';

export default function ForgotPasswordPage() {
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
		<main className='mx-auto mt-[calc(var(--header-height-mobile)+2rem)] flex w-full items-center justify-center px-4'>
			<section className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg'>
				<div className='mb-8 text-center'>
					<h2 className='text-3xl font-extrabold tracking-tight text-gray-900'>Forgot Password</h2>
					<p className='mt-3 text-sm text-gray-500'>
						Enter your email address and we&apos;ll send you a link to reset your password.
					</p>
				</div>

				<form className='flex flex-col gap-6' onSubmit={formik.handleSubmit}>
					<div className='flex flex-col gap-1'>
						<label htmlFor='email' className='text-sm font-medium text-gray-700'>
							Email Address
						</label>
						<input
							{...formik.getFieldProps('email')}
							type='email'
							id='email'
							placeholder='you@example.com'
							className={`w-full rounded-lg border px-4 py-3 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
								formik.errors.email && formik.touched.email
									? 'border-rose-600 bg-rose-50'
									: 'border-gray-300 bg-gray-50'
							}`}
						/>
						{formik.errors.email && formik.touched.email && (
							<span className='text-xs font-medium text-rose-600'>{formik.errors.email}</span>
						)}
					</div>

					<button
						type='submit'
						disabled={loading}
						className='rounded-lg bg-blue-600 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none active:scale-[0.98] disabled:opacity-50'
					>
						{loading ? 'Sending link...' : 'Send reset link'}
					</button>

					{loading && !data && (
						<div className='flex justify-center'>
							<Oval className='h-8 w-8' stroke='#00b3ff' />
						</div>
					)}

					{!loading && data && _.isEmpty(data.sendForgotPasswordEmail?.errors) && (
						<div className='rounded-lg bg-green-50 p-4 text-center'>
							<p className='text-sm font-medium text-green-800'>Reset link has been sent!</p>
							<p className='mt-1 text-xs text-green-700'>
								Please check your email to follow the instructions.
							</p>
						</div>
					)}

					{!loading &&
						data &&
						!_.isEmpty(data.sendForgotPasswordEmail?.errors) &&
						data.sendForgotPasswordEmail?.errors.map((err: any, idx: number) => (
							<div key={idx} className='rounded-lg bg-rose-50 p-3'>
								<p className='text-center text-sm font-medium text-rose-600'>{err.message}</p>
							</div>
						))}
				</form>
			</section>
		</main>
	);
}
