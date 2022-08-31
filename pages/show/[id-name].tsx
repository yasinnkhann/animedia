import React from 'react';
import { request } from 'graphql-request';
import * as Queries from '../../graphql/queries';
import { NexusGenObjects } from '../../graphql/generated/nexus-typegen';
import { GetServerSideProps } from 'next';

type Props = {
	showDetails: NexusGenObjects['ShowDetailsRes'];
};

const ShowDetails = ({ showDetails }: Props) => {
	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<h1>{showDetails.name}</h1>
			<p>{showDetails.overview}</p>
		</div>
	);
};
export default ShowDetails;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const id = Number((ctx.params?.['id-name'] as string).split('-')[0]);
	const data = await request(
		'http://localhost:3000/api/graphql',
		Queries.QUERY_SHOW_DETAILS,
		{
			showDetailsId: id,
		}
	);

	const { showDetails } = data;

	return {
		props: {
			showDetails,
		},
	};
};
