import Head from 'next/head';
import { GetServerSideProps } from 'next';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { request } from 'graphql-request';
import { SERVER_BASE_URL } from '../../utils/constants';
import _ from 'lodash';

const VerificationEmail = () => {
	return (
		<>
			<Head>
				<title>Verification Email</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				<div className='flex h-[80vh] items-center justify-center'>
					You have been successfully verified! Please login to get redirected to
					your account.
				</div>
			</main>
		</>
	);
};

export default VerificationEmail;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const { uid, token } = ctx.query;

	try {
		const verifyTokenRes = await request(
			SERVER_BASE_URL,
			Queries.CHECK_EMAIL_VERIFICATION_TOKEN,
			{
				token: token as string,
				userId: uid as string,
			}
		);

		const verifyTokenData = verifyTokenRes.checkEmailVerificationToken;

		if (!verifyTokenData?.userId || !_.isEmpty(verifyTokenData.errors)) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			};
		}

		const verifyUserEmailRes = await request(
			SERVER_BASE_URL,
			Mutations.VERIFY_USER_EMAIL,
			{
				userId: verifyTokenData.userId,
			}
		);

		if (
			!verifyUserEmailRes.verifyUserEmail ||
			!_.isEmpty(verifyUserEmailRes.verifyUserEmail?.errors)
		) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			};
		}

		return {
			props: {},
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
