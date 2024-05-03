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

interface Props {
	verifiedData: RedisRes;
}

const ChangePassword = ({ verifiedData }: Props) => {
	const formik = useFormik({
		initialValues: {
			newPassword: '',
		},
		validate: newPasswordValidate,
		onSubmit,
	});

	const [changePassword, { loading, data }] = useMutation(
		Mutations.CHANGE_PASSWORD
	);

	async function onSubmit() {
		const { newPassword } = formik.values;
		await changePassword({
			variables: { userId: verifiedData.userId!, newPassword },
		});
		formik.resetForm();
	}

	return (
		<>
			<Head>
				<title>New Password</title>
			</Head>

			<main className='mx-auto mt-[calc(var(--header-height-mobile))] flex w-full items-center justify-center'>
				<section className='w-full max-w-md translate-y-1/2 transform rounded-lg bg-white p-8 shadow-md'>
					<h2 className='mb-4 text-center text-3xl font-extrabold text-gray-900'>
						New Password
					</h2>
					<p className='mb-8 text-center text-sm text-gray-600'>
						Please enter your new password
					</p>
					<form className='space-y-4' onSubmit={formik.handleSubmit}>
						<div>
							<label htmlFor='newPassword' className='sr-only'>
								New Password
							</label>
							<input
								{...formik.getFieldProps('newPassword')}
								type='password'
								name='newPassword'
								required
								placeholder='New Password...'
								className='w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
							/>
						</div>
						<div>
							<button
								type='submit'
								className='w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
							>
								Change Password
							</button>
						</div>

						{loading && !data && (
							<div className='flex justify-center'>
								<Oval stroke='#00b3ff' />
							</div>
						)}

						{!loading && data && !_.isEmpty(data.changePassword?.errors) && (
							<div className='text-center text-red-500'>
								{data.changePassword?.errors.map((err, idx) => (
									<p key={idx}>{err.message}</p>
								))}
							</div>
						)}

						{!loading && data && _.isEmpty(data.changePassword?.errors) && (
							<p className='text-center'>Your password has been changed!</p>
						)}
					</form>
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
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
};
