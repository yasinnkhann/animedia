import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useGQLQuery, useGQLMutation } from '../../hooks/useGQL';
import { IUseGQLQuery, IUseGQLMutation } from '@ts/interfaces';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import {
	NexusGenArgTypes,
	NexusGenObjects,
} from '../../graphql/generated/nexus-typegen';
import { signIn } from 'next-auth/react';

const VerificationEmail = () => {
	const router = useRouter();
	const [verified, setVerified] = useState<boolean>(false);

	const {
		data: verificationEmailData,
		loading: verificationEmailLoading,
	}: IUseGQLQuery<
		NexusGenObjects['redisRes'],
		NexusGenArgTypes['Query']['checkEmailVerificationToken']
	> = useGQLQuery<NexusGenArgTypes['Query']['checkEmailVerificationToken']>(
		Queries.QUERY_CHECK_EMAIL_VERIFICATION_TOKEN,
		{
			variables: {
				token: router.query.token as string,
			},
			fetchPolicy: 'network-only',
		}
	);

	const {
		mutateFunction: verifyUserEmail,
		mutateData: verifyUserEmailData,
	}: IUseGQLMutation<number, NexusGenArgTypes['Mutation']['verifyUserEmail']> =
		useGQLMutation<NexusGenArgTypes['Mutation']['verifyUserEmail']>(
			Mutations.MUTATION_VERIFY_USER_EMAIL,
			{
				variables: {
					userId: verificationEmailData?.userId ?? '',
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
			token: verificationEmailData?.token ?? '',
		},
	});

	useEffect(() => {
		(async () => {
			if (
				router.query.token &&
				!verificationEmailLoading &&
				verificationEmailData?.successMsg
			) {
				console.log('verificationEmailData: ', verificationEmailData);
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

					console.log(
						'updatedUserVerificationData: ',
						updatedUserVerificationData
					);

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
			}

			if (
				router.query.token &&
				!verificationEmailLoading &&
				verificationEmailData?.error
			) {
				console.log('VERIF ERR: ', verificationEmailData.error);
			}
		})();
	}, [
		verificationEmailLoading,
		verificationEmailData,
		router.query.token,
		verifyUserEmail,
		deleteEmailVerificationToken,
	]);

	return (
		<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{verificationEmailLoading && <div>Loading...</div>}

			{verified && (
				<div>
					You have been successfully verified! Go ahead and login to enjoy the
					full benefits of animedia!
				</div>
			)}
		</main>
	);
};

export default VerificationEmail;
