import { useState } from 'react';
import Head from 'next/head';
import { Oval } from 'react-loading-icons';
import { GetServerSideProps } from 'next';
import { request } from 'graphql-request';
import { SERVER_BASE_URL } from '../utils/constants';
import * as Queries from '../graphql/queries';
import * as Mutations from '../graphql/mutations';
import { useMutation, useQuery } from '@apollo/client';
import _ from 'lodash';
import { RedisRes } from 'graphql/generated/code-gen/graphql';

interface Props {
	verifiedData: RedisRes;
}

const VerificationEmailSent = ({ verifiedData }: Props) => {
	const [isResending, setIsResending] = useState(false);
	const [reachedLimit, setReachedLimit] = useState(false);

	// maybe we can move into send email mutation
	const { data: checkRetryEmailVerificationLimitData } = useQuery(
		Queries.CHECK_RETRY_EMAIL_VERIFICATION_LIMIT,
		{
			variables: {
				email: verifiedData.userId!,
			},
		}
	);

	const [sendVerificationEmail] = useMutation(
		Mutations.SEND_VERIFICATION_EMAIL
	);

	const handleResendLink = async () => {
		// if (
		// 	process.env.NODE_ENV === 'production' &&
		// 	checkRetryEmailVerificationLimitData?.checkRetryEmailVerificationLimit
		// 		?.token === String(2)
		// ) {
		// 	setReachedLimit(true);
		// 	return;
		// }
		setIsResending(true);

		await sendVerificationEmail({
			variables: {
				userId: verifiedData.userId!,
			},
		});

		setIsResending(false);
	};

	return (
		<>
			<Head>
				<title>Verification Email Sent</title>
			</Head>

			<main className='flex h-screen flex-col items-center justify-center'>
				<section className='flex h-36 flex-col'>
					<p>
						A verification link has been sent to your email. If you cannot find
						it, be sure to check your spam folder.
					</p>
					<div className='mt-8 flex flex-col items-center'>
						<button
							className='rounded bg-blue-500 px-4 py-2 text-white'
							onClick={handleResendLink}
						>
							{isResending ? 'Resending Link...' : 'Resend Link'}
						</button>
						{isResending && (
							<div>
								<Oval className='mt-8' stroke='#00b3ff' />
							</div>
						)}
						{reachedLimit && (
							<p className='mt-8 text-red-500'>
								You have reached the limit of verification emails. Please wait
								24 hours to try again.
							</p>
						)}
					</div>
				</section>
			</main>
		</>
	);
};

export default VerificationEmailSent;

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
