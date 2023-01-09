import React, { useState } from 'react';
import Head from 'next/head';
import { Oval } from 'react-loading-icons';
import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { CLIENT_BASE_URL } from '../../utils/URLs';
import { request } from 'graphql-request';
import { SERVER_BASE_URL } from '../../utils/URLs';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { useGQLMutation, useGQLQuery } from '../../hooks/useGQL';
import {
	NexusGenArgTypes,
	NexusGenObjects,
} from '../../graphql/generated/nexus-typegen';

const VerificationEmailSent = ({
	token,
	email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const [isResending, setIsResending] = useState(false);
	const [reachedLimit, setReachedLimit] = useState(false);

	const {
		mutateFunction: writeEmailVerificationToken,
		mutateData: writeEmailVerificationTokenData,
		extractData: extractWriteEmailVerificationTokenData,
	} = useGQLMutation<
		NexusGenObjects['RedisRes'],
		NexusGenArgTypes['Mutation']['writeEmailVerificationToken']
	>(Mutations.WRITE_EMAIL_VERIFICATION_TOKEN, {
		variables: {
			email,
		},
	});

	const { data: checkRetryEmailVerificationLimitData } = useGQLQuery<
		NexusGenObjects['RedisRes'],
		NexusGenArgTypes['Query']['checkRetryEmailVerificationLimit']
	>(Queries.CHECK_RETRY_EMAIL_VERIFICATION_LIMIT, {
		variables: {
			email,
		},
	});

	const { mutateFunction: writeRetryEmailVerificationToken } = useGQLMutation<
		NexusGenObjects['RedisRes'],
		NexusGenArgTypes['Mutation']['writeRetryEmailVerificationLimit']
	>(Mutations.WRITE_RETRY_EMAIL_VERIFICATION_LIMIT, {
		variables: {
			email,
		},
		refetchQueries: () => [
			{
				query: Queries.CHECK_RETRY_EMAIL_VERIFICATION_LIMIT,
			},
			'CheckRetryEmailVerificationLimit',
		],
	});

	const { mutateFunction: sendVerificationEmail } = useGQLMutation<
		NexusGenObjects['NodeRes'],
		NexusGenArgTypes['Mutation']['sendVerificationEmail']
	>(Mutations.SEND_VERIFICATION_EMAIL);

	const handleResendLink = async () => {
		if (checkRetryEmailVerificationLimitData?.token === String(3)) {
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

		const writtenTokenData = extractWriteEmailVerificationTokenData(
			writtenTokenRes as any
		);

		if (!writtenTokenData?.token) throw new Error('No Token');

		await sendVerificationEmail({
			variables: {
				recipientEmail: email,
				subject: 'Email Verification Link',
				text: 'This is the text',
				html: `<a href="${CLIENT_BASE_URL}/verification-email/${writtenTokenData.token}">Verify Email</a>`,
			},
		});

		setIsResending(false);
	};

	return (
		<>
			<Head>
				<title>Verification Email Sent</title>
			</Head>

			<main className='flex flex-col items-center justify-center h-screen'>
				<section className='flex flex-col h-36'>
					<p>
						A verification link has been sent to your email. If you cannot find
						it, be sure to check your spam folder.
					</p>
					<div className='flex flex-col items-center mt-8'>
						<button
							className='rounded bg-blue-500 py-2 px-4 text-white'
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

	const hasTokenData = hasTokenRes?.[Object.keys(hasTokenRes)[0]];

	if (hasTokenData.error) {
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

	const email = emailRes?.[Object.keys(emailRes)[0]];

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
