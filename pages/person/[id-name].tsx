import React from 'react';
import { request } from 'graphql-request';
import * as Queries from '../../graphql/queries';
import { NexusGenObjects } from '../../graphql/generated/nexus-typegen';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL } from '../../utils/URLs';

interface Props {
	personDetails: NexusGenObjects['PersonDetailsRes'];
}
const PersonDetails = ({ personDetails }: Props) => {
	console.log(personDetails);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<h1>{personDetails.name}</h1>
			<p>{personDetails.biography}</p>
		</div>
	);
};

export default PersonDetails;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const id = Number((ctx.params?.['id-name'] as string).split('-')[0]);
	const data = await request(SERVER_BASE_URL, Queries.QUERY_PERSON_DETAILS, {
		personDetailsId: id,
	});

	const { personDetails } = data;

	return {
		props: {
			personDetails,
		},
	};
};
