import request from 'graphql-request';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL } from 'utils/constants';
import * as Queries from '../../graphql/queries';
import _ from 'lodash';
import Head from 'next/head';
import { RedisRes } from 'graphql/generated/code-gen/graphql';

interface Props {
	verifiedData: RedisRes;
}

const NewPassword = (_props: Props) => {
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
								Forgot your password?
							</h2>
							<p className='mt-8 text-center text-sm text-gray-600'>
								Enter your email address and well send you a link to reset your
								password.
							</p>
						</div>
						<form className='space-y-6'>
							<div className='-space-y-px rounded-md shadow-sm'>
								<div>
									<label htmlFor='email-address' className='sr-only'>
										Email address
									</label>
									<input
										// {...formik.getFieldProps('email')}
										type='email'
										name='email'
										required
										placeholder='Email address'
										className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
									/>
								</div>
							</div>
							{/* {loading && (
								<div className='flex justify-center'>
									<Oval stroke='#00b3ff' />
								</div>
							)} */}
							<div>
								<button
									type='submit'
									className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
								>
									Send reset link
								</button>
							</div>
						</form>
					</div>
				</section>
			</main>
		</>
	);
};

export default NewPassword;

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
