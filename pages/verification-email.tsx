import { useEffect, useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import * as Queries from '../graphql/queries';
import * as Mutations from '../graphql/mutations';
import { request } from 'graphql-request';
import { SERVER_BASE_URL } from '../utils/constants';
import { useMutation } from '@apollo/client';
import { RedisRes } from 'graphql/generated/code-gen/graphql';
import _ from 'lodash';

interface Props {
	verifiedData: RedisRes;
}

const VerificationEmail = ({ verifiedData }: Props) => {
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
		props: {
			verifiedData: verifyTokenData,
		},
	};
};
