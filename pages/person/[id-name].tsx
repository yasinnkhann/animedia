import React, { useState, useEffect, useMemo } from 'react';
import { request } from 'graphql-request';
import * as Queries from '../../graphql/queries';
import { NexusGenObjects } from '../../graphql/generated/nexus-typegen';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL, BASE_IMG_URL } from '../../utils/URLs';
import Image from 'next/image';
import KnownForHorizontalScroller from '../../components/UI/HorizontalScrollerUI/KnownForHorizontalScroller';
import { IKnownForMedia } from '@ts/interfaces';

interface Props {
	personDetails: NexusGenObjects['PersonDetailsRes'];
	personsKnownForMovieRes: NexusGenObjects['PersonsKnownForMovieRes'];
	personsKnownForShowRes: NexusGenObjects['PersonsKnownForShowRes'];
}
const PersonDetails = ({
	personDetails,
	personsKnownForMovieRes,
	personsKnownForShowRes,
}: Props) => {
	const memoMappedMedia = useMemo(() => {
		const mappedMoviesCast: IKnownForMedia[] =
			personsKnownForMovieRes!.cast.map(castObj => ({
				id: castObj?.id!,
				image: castObj?.poster_path,
				title: castObj?.title!,
				popularity: castObj?.popularity!,
			}));
		console.log('movies cast: ', mappedMoviesCast);

		const mappedShowsCast: IKnownForMedia[] = personsKnownForShowRes!.cast.map(
			castObj => ({
				id: castObj?.id!,
				image: castObj?.poster_path,
				name: castObj?.name!,
				popularity: castObj?.popularity!,
			})
		);
		console.log('shows cast: ', mappedShowsCast);

		return mappedMoviesCast
			.concat(mappedShowsCast)
			.sort((a, b) => b.popularity! - a.popularity!)
			.slice(0, 10);
	}, [personsKnownForMovieRes, personsKnownForShowRes]);

	console.log('PERSON DETAILS: ', personDetails);

	console.log('MAPPED MEDIA: ', memoMappedMedia);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<div className='w-[15rem] h-[20rem] relative'>
				<Image
					className='rounded-lg'
					src={BASE_IMG_URL + personDetails.profile_path}
					alt={personDetails.name ?? undefined}
					layout='fill'
				/>
			</div>
			<div>
				<h1>{personDetails.name}</h1>
				<h3>Biography</h3>
				<p>{personDetails.biography}</p>
			</div>
			<div>
				<KnownForHorizontalScroller items={memoMappedMedia} />
			</div>
		</section>
	);
};

export default PersonDetails;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const id = Number((ctx.params?.['id-name'] as string).split('-')[0]);

	const personDetailsData = await request(
		SERVER_BASE_URL,
		Queries.QUERY_PERSON_DETAILS,
		{
			personDetailsId: id,
		}
	);

	const { personDetails } = personDetailsData;

	const knownForMoviesData = await request(
		SERVER_BASE_URL,
		Queries.QUERY_GET_PERSONS_KNOWN_FOR_MOVIES,
		{
			personsKnownForMovieResId: id,
		}
	);

	const { personsKnownForMovieRes } = knownForMoviesData;

	const knownForShowsData = await request(
		SERVER_BASE_URL,
		Queries.QUERY_GET_PERSONS_KNOWN_FOR_SHOWS,
		{
			personsKnownForShowResId: id,
		}
	);

	const { personsKnownForShowRes } = knownForShowsData;

	return {
		props: {
			personDetails,
			personsKnownForMovieRes,
			personsKnownForShowRes,
		},
	};
};
