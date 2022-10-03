import React, { useEffect, useRef, useMemo } from 'react';
import { request } from 'graphql-request';
import * as Queries from '../../graphql/queries';
import { NexusGenObjects } from '../../graphql/generated/nexus-typegen';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL, BASE_IMG_URL } from '../../utils/URLs';
import Image from 'next/image';
import KnownForHorizontalScroller from '../../components/UI/HorizontalScrollerUI/KnownForHorizontalScroller';
import { IKnownForMedia } from '@ts/interfaces';
import {
	KNOWN_FOR_MIN_EP_COUNT,
	KNOWN_FOR_CARDS_LIMIT,
} from '../../utils/specificNums';

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
	const knownForContainerRef = useRef<HTMLElement>(null);

	const memoMappedMedia = useMemo(() => {
		const moviesTracker: { [id: string]: boolean } = {};

		const mappedMoviesCast: IKnownForMedia[] = [];

		for (const castObj of personsKnownForMovieRes.cast) {
			if (!moviesTracker.hasOwnProperty(castObj!.id)) {
				moviesTracker[String(castObj!.id)] = true;

				mappedMoviesCast.push({
					id: castObj!.id,
					image: castObj!.poster_path,
					title: castObj!.title,
					popularity: castObj!.popularity,
				});
			}
		}

		const showsTracker: { [id: string]: boolean } = {};

		const mappedShowsCast: IKnownForMedia[] = [];

		for (const castObj of personsKnownForShowRes.cast) {
			if (
				!showsTracker.hasOwnProperty(castObj!.id) &&
				castObj!.episode_count! > KNOWN_FOR_MIN_EP_COUNT
			) {
				showsTracker[String(castObj!.id)] = true;

				mappedShowsCast.push({
					id: castObj!.id,
					image: castObj!.poster_path,
					name: castObj!.name,
					popularity: castObj!.popularity,
				});
			}
		}

		return mappedMoviesCast
			.concat(mappedShowsCast)
			.sort((a, b) => b.popularity! - a.popularity!)
			.slice(0, KNOWN_FOR_CARDS_LIMIT);
	}, [personsKnownForMovieRes, personsKnownForShowRes]);

	useEffect(() => {
		if (knownForContainerRef.current) {
			const scrollerClass =
				'.react-horizontal-scrolling-menu--scroll-container';

			const knownForScroller = knownForContainerRef.current.querySelector(
				scrollerClass
			) as HTMLDivElement;

			knownForScroller.style.height = '23rem';
		}
	});

	console.log('PERSON DETAILS: ', personDetails);

	console.log('MAPPED MEDIA: ', memoMappedMedia);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-rows-2 grid-cols-[20vw_80vw]'>
			<section className='relative'>
				<Image
					className='rounded-lg'
					src={BASE_IMG_URL + personDetails.profile_path}
					alt={personDetails.name ?? undefined}
					layout='fill'
				/>
			</section>
			<section>
				<h1>{personDetails.name}</h1>
				<h3>Biography</h3>
				<p>
					{personDetails.biography!.length > 0
						? personDetails.biography
						: `We don't have a biography for ${personDetails.name}.

`}
				</p>
			</section>
			<section>
				<h3>Personal Info</h3>
				<h4>Known For</h4>
				<p>{personDetails.known_for_department}</p>
				<h4>Gender</h4>
				<p>{personDetails.gender === 2 ? 'Male' : 'Female'}</p>
			</section>
			<section className='col-start-2' ref={knownForContainerRef}>
				<h3 className='mb-4 ml-8'>Known For</h3>
				<KnownForHorizontalScroller items={memoMappedMedia} />
			</section>
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
