import React from 'react';
import { request } from 'graphql-request';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL } from '../../utils/URLs';
import * as Queries from '../../graphql/queries';

const VerificationEmailSent = () => {
	return (
		<main className='flex items-center justify-center h-screen'>
			A verification link has been sent to your email.
		</main>
	);
};

export default VerificationEmailSent;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const token = ctx.params?.token as string;

	const res = await request(
		SERVER_BASE_URL,
		Queries.QUERY_CHECK_EMAIL_VERIFICATION_TOKEN,
		{
			token,
		}
	);

	const data = res?.[Object.keys(res)[0]];

	if (data.error) {
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
};
