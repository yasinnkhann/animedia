import React from 'react';
import { request, gql } from 'graphql-request';
// import * as Queries from '../../graphql/queries';
import { NexusGenObjects } from '../../graphql/generated/nexus-typegen';
import { GetServerSideProps } from 'next';

type Props = {
	movieDetails: NexusGenObjects['MovieDetailsRes'];
};

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
	const query = gql`
		query getMovieDetails($movieDetailsId: Int!) {
			movieDetails(id: $movieDetailsId) {
				adult
				backdrop_path
				genres {
					id
					name
				}
				homepage
				id
				imdb_id
				original_language
				original_title
				overview
				popularity
				poster_path
				production_companies {
					id
					logo_path
					name
					origin_country
				}
				production_countries {
					iso_3166_1
					name
				}
				release_date
				revenue
				runtime
				spoken_languages {
					english_name
					iso_639_1
					name
				}
				status
				tagline
				title
				video
				vote_average
				vote_count
			}
		}
	`;
	const id = Number((ctx.params?.['id-name'] as string).split('-')[0]);
	const data = await request(
		'http://localhost:3000/api/graphql',
		// Queries.QUERY_MOVIE_DETAILS,
		query,
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
