import React from 'react';
import { request } from 'graphql-request';
import * as Queries from '../../graphql/queries';
import { NexusGenObjects } from '../../graphql/generated/nexus-typegen';
import { GetServerSideProps } from 'next';

interface Props {
	movieDetails: NexusGenObjects['MovieDetailsRes'];
}

const MovieDetails = ({ movieDetails }: Props) => {
	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<h1>{movieDetails.title}</h1>
			<p>{movieDetails.overview}</p>
		</div>
	);
};
export default MovieDetails;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const id = Number((ctx.params?.['id-name'] as string).split('-')[0]);
	const data = await request(
		process.env.NODE_ENV === 'production'
			? 'https://animedia.vercel.app/api/graphql'
			: 'http://localhost:3000/api/graphql',
		Queries.QUERY_MOVIE_DETAILS,
		{
			movieDetailsId: id,
		}
	);

	const { movieDetails } = data;

	return {
		props: {
			movieDetails,
		},
	};
};
