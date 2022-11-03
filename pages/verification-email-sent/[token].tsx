import React, { useState } from 'react';
import { Oval } from 'react-loading-icons';
import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { CLIENT_BASE_URL } from '../../utils/URLs';
import { request } from 'graphql-request';
import { SERVER_BASE_URL } from '../../utils/URLs';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { useGQLMutation } from '../../hooks/useGQL';
import { IUseGQLMutation, INodeMailerInfo } from '@ts/interfaces';
import {
	NexusGenArgTypes,
	NexusGenObjects,
} from '../../graphql/generated/nexus-typegen';

const VerificationEmailSent = ({
	token,
	email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const [isResending, setIsResending] = useState(false);
	const {
		mutateFunction: writeEmailVerificationToken,
		mutateData: writeEmailVerificationTokenData,
	}: IUseGQLMutation<
		NexusGenObjects['redisRes'],
		NexusGenArgTypes['Mutation']['writeEmailVerificationToken']
	> = useGQLMutation<
		NexusGenArgTypes['Mutation']['writeEmailVerificationToken']
	>(Mutations.MUTATION_WRITE_EMAIL_VERIFICATION_TOKEN, {
		variables: {
			email,
		},
	});

	const handleResendLink = async () => {
		setIsResending(true);
		try {
			const writtenTokenRes = await writeEmailVerificationToken({
				variables: {
					email,
				},
			});

			const writtenTokenData: typeof writeEmailVerificationTokenData =
				writtenTokenRes.data?.[Object.keys(writtenTokenRes.data)[0]];

			if (!writtenTokenData?.token) throw new Error('No Token');

			const nodeMailerInfo: INodeMailerInfo = {
				recipientEmail: email,
				subject: 'Email Verification Link',
				text: 'This is the text',
				html: `<a href="${CLIENT_BASE_URL}/verification-email/${writtenTokenData.token}">Verify Email</a>`,
			};

			const nodeMailerOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(nodeMailerInfo),
			};

			const nodeMailerRes = await fetch(
				`${CLIENT_BASE_URL}/api/auth/send-verification-email`,
				nodeMailerOptions
			);

			const nodeMailerData = await nodeMailerRes.json();
		} catch (err) {
			console.error(err);
		}
		setIsResending(false);
	};

	return (
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
				</div>
			</section>
		</main>
	);
};

export default VerificationEmailSent;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const token = ctx.params?.token as string;

	const hasTokenRes = await request(
		SERVER_BASE_URL,
		Queries.QUERY_CHECK_EMAIL_VERIFICATION_TOKEN,
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
		Queries.QUERY_EMAIL_FROM_REDIS_TOKEN,
		{
			token,
		}
	);

	const email = emailRes?.[Object.keys(emailRes)[0]];

	return {
		props: { token, email },
	};
};
