import { useState } from 'react';
import Head from 'next/head';
import { Oval } from 'react-loading-icons';
import { GetServerSideProps } from 'next';
import { request } from 'graphql-request';
import { SERVER_BASE_URL } from '../utils/constants';
import * as Queries from '../graphql/queries';
import * as Mutations from '../graphql/mutations';
import { useMutation } from '@apollo/client';
import _ from 'lodash';
import { RedisRes } from 'graphql/generated/code-gen/graphql';

interface Props {
	verifiedData: RedisRes;
}

const VerificationEmailSent = ({ verifiedData }: Props) => {
	const [errors, setErrors] = useState<RedisRes['errors']>(verifiedData.errors);

	const [isResending, setIsResending] = useState(false);

	const [sendVerificationEmail] = useMutation(
		Mutations.SEND_VERIFICATION_EMAIL
	);

	const handleResendLink = async () => {
		setIsResending(true);
		try {
			const sendVerificationEmailRes = await sendVerificationEmail({
				variables: {
					userId: verifiedData.userId!,
				},
			});
			setErrors(
				sendVerificationEmailRes.data?.sendVerificationEmail?.errors ?? [
					{ message: 'Error ocurred while resending link.' },
				]
			);
			setIsResending(false);
		} catch (err) {
			console.error(err);
		}
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
						{!_.isEmpty(errors) &&
							errors.map((err, idx) => (
								<div key={idx} className='flex flex-col'>
									<p className='mt-8 text-red-500'>{err.message}</p>
								</div>
							))}
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
