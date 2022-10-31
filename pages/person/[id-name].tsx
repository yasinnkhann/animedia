import React, { useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import * as Queries from '../../graphql/queries';
import { request } from 'graphql-request';
import { NexusGenObjects } from '../../graphql/generated/nexus-typegen';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL, BASE_IMG_URL } from '../../utils/URLs';
import { IKnownForMedia } from '@ts/interfaces';
import { formatDate } from '../../utils/formatDate';
import KnownForHorizontalScroller from '../../components/UI/HorizontalScrollerUI/KnownForHorizontalScroller';
import {
	KNOWN_FOR_MIN_EP_COUNT,
	KNOWN_FOR_CARDS_LIMIT,
} from '../../utils/specificVals';

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
					poster_path: castObj!.poster_path,
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
					poster_path: castObj!.poster_path,
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

	const getAge = (dateStr: string) => {
		const today = new Date();
		const birthDate = new Date(dateStr);
		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	return (
		<main className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
			<section className='relative mx-4 mt-4'>
				<Image
					className='rounded-lg'
					src={BASE_IMG_URL + personDetails.profile_path}
					alt={personDetails.name ?? undefined}
					layout='fill'
				/>
			</section>

			<section className='pb-48'>
				<h1>{personDetails.name}</h1>
				<h3 className='my-4'>Biography</h3>
				<p>
					{personDetails.biography!.length > 0
						? personDetails.biography
						: `We don't have a biography for ${personDetails.name}.`}
				</p>
			</section>

			<section className='ml-8 mt-4'>
				<h3 className='mb-4 underline underline-offset-4'>Personal Info</h3>
				<h4>Known For</h4>
				<p className='ml-1'>{personDetails.known_for_department}</p>
				<h4 className='mt-4'>Gender</h4>
				<p className='ml-1'>
					{personDetails.gender === 1
						? 'Female'
						: personDetails.gender === 2
						? 'Male'
						: 'Unknown'}
				</p>
				<h4 className='mt-4'>Date of Birth</h4>
				<p className='ml-1'>
					{personDetails.birthday
						? `${formatDate(personDetails.birthday)}${
								!personDetails.deathday
									? ` (${getAge(personDetails.birthday)} years old)`
									: ''
						  }`
						: 'Unknown'}
				</p>
				<h4 className='mt-4'>Born In</h4>
				<p className='ml-1'>
					{personDetails.place_of_birth
						? personDetails.place_of_birth
						: 'Unknown'}
				</p>
				{personDetails.deathday && (
					<>
						<h4 className='mt-4'>Date of Death</h4>
						<p className='ml-1'>{`${formatDate(personDetails.deathday)}${
							personDetails.birthday &&
							` (${
								getAge(personDetails.birthday) - getAge(personDetails.deathday)
							}`
						} years old)`}</p>
					</>
				)}
			</section>

			<section className='col-start-2 mt-4' ref={knownForContainerRef}>
				<h3 className='mb-4 ml-8'>Known For</h3>
				<KnownForHorizontalScroller items={memoMappedMedia} />
			</section>
		</main>
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
