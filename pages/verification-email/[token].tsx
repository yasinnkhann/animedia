import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { request } from 'graphql-request';
import { SERVER_BASE_URL } from '../../utils/constants';
import { useMutation } from '@apollo/client';
import { RedisRes } from 'graphql/generated/code-gen/graphql';

interface Props {
	verificationEmailData: RedisRes;
}

const VerificationEmail = ({ verificationEmailData }: Props) => {
	const router = useRouter();
	const [verified, setVerified] = useState<boolean>(false);

	const [verifyUserEmail] = useMutation(Mutations.VERIFY_USER_EMAIL, {
		variables: {
			userId: verificationEmailData.userId!,
		},
	});

	const [deleteEmailVerificationToken] = useMutation(
		Mutations.DELETE_EMAIL_VERIFICATION_TOKEN,
		{
			variables: {
				token: verificationEmailData.token!,
			},
		}
	);

	useEffect(() => {
		(async () => {
			try {
				const updatedUserVerificationRes = await verifyUserEmail({
					variables: {
						userId: verificationEmailData.userId!,
					},
				});

				if (updatedUserVerificationRes.data?.verifyUserEmail === 200) {
					const deleteRes = await deleteEmailVerificationToken({
						variables: {
							token: verificationEmailData.token!,
						},
					});

					if (deleteRes.data?.deleteEmailVerificationToken?.successMsg) {
						setVerified(true);
					}
				}
			} catch (err) {
				console.error(err);
			}
		})();
	}, [
		verificationEmailData.token,
		verificationEmailData.userId,
		router.query.token,
		verifyUserEmail,
		deleteEmailVerificationToken,
	]);

	return (
		<>
			<Head>
				<title>Verification Email</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				{verified && (
					<div className='flex justify-center items-center h-[80vh]'>
						You have been successfully verified! Please login to get redirected
						to your account.
					</div>
				)}
			</main>
		</>
	);
};

export default VerificationEmail;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const token = ctx.params?.token as string;

	const res = await request(
		SERVER_BASE_URL,
		Queries.CHECK_EMAIL_VERIFICATION_TOKEN,
		{
			token,
		}
	);

	const data = res.checkEmailVerificationToken;

	if (data?.error) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {
			verificationEmailData: data,
		},
	};
};
