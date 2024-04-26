import { useState } from 'react';
import Head from 'next/head';
import { Oval } from 'react-loading-icons';
import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { CLIENT_BASE_URL } from '../../utils/constants';
import { request } from 'graphql-request';
import { SERVER_BASE_URL } from '../../utils/constants';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { useMutation, useQuery } from '@apollo/client';

const VerificationEmailSent = ({
	token,
	email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const [isResending, setIsResending] = useState(false);
	const [reachedLimit, setReachedLimit] = useState(false);

	const [writeEmailVerificationToken] = useMutation(
		Mutations.WRITE_EMAIL_VERIFICATION_TOKEN,
		{
			variables: {
				email,
			},
		}
	);

	const { data: checkRetryEmailVerificationLimitData } = useQuery(
		Queries.CHECK_RETRY_EMAIL_VERIFICATION_LIMIT,
		{
			variables: {
				email,
			},
		}
	);

	const [writeRetryEmailVerificationToken] = useMutation(
		Mutations.WRITE_RETRY_EMAIL_VERIFICATION_LIMIT,
		{
			variables: {
				email,
			},
			refetchQueries: () => [
				{
					query: Queries.CHECK_RETRY_EMAIL_VERIFICATION_LIMIT,
				},
				'CheckRetryEmailVerificationLimit',
			],
		}
	);

	const [sendVerificationEmail] = useMutation(
		Mutations.SEND_VERIFICATION_EMAIL
	);

	const handleResendLink = async () => {
		if (
			checkRetryEmailVerificationLimitData?.checkRetryEmailVerificationLimit
				?.token === String(5)
		) {
			setReachedLimit(true);
			return;
		}
		setIsResending(true);
		await writeRetryEmailVerificationToken({
			variables: {
				email,
			},
		});

		const writtenTokenRes = await writeEmailVerificationToken({
			variables: {
				email,
			},
		});

		if (!writtenTokenRes.data?.writeEmailVerificationToken?.token)
			throw new Error('No Token');

		await sendVerificationEmail({
			variables: {
				recipientEmail: email,
				subject: 'Email Verification Link',
				text: 'This is the text',
				html: `<a href="${CLIENT_BASE_URL}/verification-email/${writtenTokenRes.data.writeEmailVerificationToken.token}">Verify Email</a>`,
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
	const token = ctx.params?.token as string;

	const hasTokenRes = await request(
		SERVER_BASE_URL,
		Queries.CHECK_EMAIL_VERIFICATION_TOKEN,
		{
			token,
		}
	);

	if (hasTokenRes.checkEmailVerificationToken?.errors?.length) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const emailRes = await request(
		SERVER_BASE_URL,
		Queries.EMAIL_FROM_REDIS_TOKEN,
		{
			token,
		}
	);

	const email = emailRes.emailFromRedisToken;

	if (!email) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: { token, email },
	};
};
