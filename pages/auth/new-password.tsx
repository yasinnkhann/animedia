import request from 'graphql-request';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL } from 'utils/constants';
import * as Queries from '../../graphql/queries';
import _ from 'lodash';
import Head from 'next/head';

interface Props {}

const NewPassword = (props: Props) => {
	return (
		<>
			<Head>
				<title>New Password</title>
			</Head>

			<main></main>
		</>
	);
};

export default NewPassword;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const { uid, token } = ctx.query;

	const verifyTokenRes = await request(
		SERVER_BASE_URL,
		Queries.CHECK_EMAIL_VERIFICATION_TOKEN,
		{
			token: token as string,
			userId: uid as string,
		}
	);

	const verifyTokenData = verifyTokenRes.checkEmailVerificationToken;

	if (!verifyTokenData || !_.isEmpty(verifyTokenData.errors)) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {
			verifiedData: verifyTokenData,
		},
	};
};
