import Head from 'next/head';
import request from 'graphql-request';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL } from 'utils/constants';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import _ from 'lodash';
import { RedisRes } from 'graphql/generated/code-gen/graphql';
import { Oval } from 'react-loading-icons';
import { useFormik } from 'formik';
import { newPasswordValidate } from 'lib/nextAuth/account-validate';
import { useMutation } from '@apollo/client';
import { useState } from 'react';

interface Props {
	verifiedData: RedisRes;
}

const ChangePassword = ({ verifiedData }: Props) => {
	const [changePasswordErrors, setChangePasswordErrors] = useState<
		RedisRes['errors']
	>([]);

	const formik = useFormik({
		initialValues: {
			newPassword: '',
		},
		validate: newPasswordValidate,
		onSubmit,
	});

	const [changePassword, { loading }] = useMutation(Mutations.CHANGE_PASSWORD);

	async function onSubmit() {
		const { newPassword } = formik.values;

		const changePasswordRes = await changePassword({
			variables: { userId: verifiedData.userId!, newPassword },
		});

		if (
			changePasswordRes.data?.changePassword &&
			!_.isEmpty(changePasswordRes.data.changePassword.errors)
		) {
			setChangePasswordErrors(changePasswordRes.data.changePassword.errors);
		}
	}

	return (
		<>
			<Head>
				<title>New Password</title>
			</Head>

			<main className='mx-auto mt-[calc(var(--header-height-mobile)+1rem)] flex w-1/2 flex-col gap-10'>
				<section className='flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8'>
					<div className='w-full max-w-lg space-y-8'>
						<div>
							<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
								New Password
							</h2>
							<p className='mt-8 text-center text-sm text-gray-600'>
								Please enter your new password.
							</p>
						</div>
						<form className='space-y-6'>
							<div className='-space-y-px rounded-md shadow-sm'>
								<div>
									<label htmlFor='email-address' className='sr-only'>
										Email address
									</label>
									<input
										{...formik.getFieldProps('newPassword')}
										type='password'
										name='password'
										required
										placeholder='Password'
										className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
									/>
								</div>
							</div>
							<div>
								<button
									type='submit'
									className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
								>
									Change Password
								</button>
							</div>

							{loading && (
								<div className='flex justify-center'>
									<Oval stroke='#00b3ff' />
								</div>
							)}

							{!_.isEmpty(changePasswordErrors) &&
								changePasswordErrors.map((err, idx) => (
									<div key={idx} className='flex flex-col'>
										<p className='mt-8 text-red-500'>{err.message}</p>
									</div>
								))}
						</form>
					</div>
				</section>
			</main>
		</>
	);
};

export default ChangePassword;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const { uid, token } = ctx.query;

	try {
		const checkForgotPWTokenRes = await request(
			SERVER_BASE_URL,
			Queries.CHECK_FORGOT_PASSWORD_TOKEN,
			{
				token: token as string,
				userId: uid as string,
			}
		);

		const checkForgotPWTokenData =
			checkForgotPWTokenRes.checkForgotPasswordToken;

		if (!checkForgotPWTokenData || !_.isEmpty(checkForgotPWTokenData.errors)) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			};
		}

		return {
			props: {
				verifiedData: checkForgotPWTokenData,
			},
		};
	} catch (err) {
		console.error(err);
		// return {
		// 	redirect: {
		// 		destination: '/',
		// 		permanent: false,
		// 	},
		// };
		return {
			props: {},
		};
	}
};
