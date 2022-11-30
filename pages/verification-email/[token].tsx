import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useGQLMutation } from '../../hooks/useGQL';
import { IUseGQLMutation } from '@ts/interfaces';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import {
	NexusGenArgTypes,
	NexusGenObjects,
} from '../../graphql/generated/nexus-typegen';
import { request } from 'graphql-request';
import { SERVER_BASE_URL } from '../../utils/URLs';

interface Props {
	verificationEmailData: NexusGenObjects['redisRes'];
}

const VerificationEmail = ({ verificationEmailData }: Props) => {
	const router = useRouter();
	const [verified, setVerified] = useState<boolean>(false);

	const {
		mutateFunction: verifyUserEmail,
		mutateData: verifyUserEmailData,
	}: IUseGQLMutation<number, NexusGenArgTypes['Mutation']['verifyUserEmail']> =
		useGQLMutation<NexusGenArgTypes['Mutation']['verifyUserEmail']>(
			Mutations.MUTATION_VERIFY_USER_EMAIL,
			{
				variables: {
					userId: verificationEmailData.userId!,
				},
			}
		);

	const {
		mutateFunction: deleteEmailVerificationToken,
		mutateData: deleteEmailVerificationTokenData,
	}: IUseGQLMutation<
		NexusGenObjects['redisRes'],
		NexusGenArgTypes['Mutation']['deleteEmailVerificationToken']
	> = useGQLMutation<
		NexusGenArgTypes['Mutation']['deleteEmailVerificationToken']
	>(Mutations.MUTATION_DELETE_EMAIL_VERIFICATION_TOKEN, {
		variables: {
			token: verificationEmailData.token!,
		},
	});

	useEffect(() => {
		(async () => {
			try {
				const updatedUserVerificationRes = await verifyUserEmail({
					variables: {
						userId: verificationEmailData.userId!,
					},
				});

				const updatedUserVerificationData: typeof verifyUserEmailData =
					updatedUserVerificationRes.data?.[
						Object.keys(updatedUserVerificationRes.data)[0]
					];

				if (updatedUserVerificationData === 200) {
					const deleteRes = await deleteEmailVerificationToken({
						variables: {
							token: verificationEmailData.token!,
						},
					});

					const deleteData: typeof deleteEmailVerificationTokenData =
						deleteRes.data?.[Object.keys(deleteRes.data)[0]];

					if (deleteData?.successMsg) {
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
				{verified && <div>You have been successfully verified!</div>}
			</main>
		</>
	);
};

export default VerificationEmail;

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
		props: {
			verificationEmailData: data,
		},
	};
};
