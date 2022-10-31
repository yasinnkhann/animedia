import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useGQLQuery } from '../../hooks/useGQL';
import { IUseGQLQuery } from '@ts/interfaces';
import * as Queries from '../../graphql/queries';
import {
	NexusGenArgTypes,
	NexusGenObjects,
} from '../../graphql/generated/nexus-typegen';

interface Props {}

const VerificationEmail = (props: Props) => {
	const router = useRouter();

	const {
		data: verificationEmailData,
		loading: verificationEmailLoading,
		error: verificationEmailError,
	}: IUseGQLQuery<
		NexusGenObjects['redisRes'],
		NexusGenArgTypes['Query']['checkEmailVerificationToken']
	> = useGQLQuery<NexusGenArgTypes['Query']['checkEmailVerificationToken']>(
		Queries.QUERY_CHECK_EMAIL_VERIFICATION_TOKEN,
		{
			variables: {
				token: router.query.token as string,
			},
		}
	);

	useEffect(() => {
		if (verificationEmailData) {
			console.log('IN EFF: ', verificationEmailData);
		}
	}, [verificationEmailData]);
	return (
		<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			verification-email-sent
		</main>
	);
};

export default VerificationEmail;
