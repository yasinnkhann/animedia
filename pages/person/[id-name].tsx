import React, { useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import * as Queries from '../../graphql/queries';
import { Circles } from 'react-loading-icons';
import { useGQLQuery } from '../../hooks/useGQL';
import { IUseGQLQuery } from '@ts/interfaces';
import { BASE_IMG_URL } from '../../utils/URLs';
import { IKnownForMedia } from '@ts/interfaces';
import { formatDate } from '../../utils/formatDate';
import KnownForHorizontalScroller from '../../components/UI/HorizontalScrollerUI/KnownForHorizontalScroller';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';
import {
	KNOWN_FOR_MIN_EP_COUNT,
	KNOWN_FOR_CARDS_LIMIT,
} from '../../utils/specificVals';

const PersonDetails = () => {
	const router = useRouter();
	const id = Number((router.query?.['id-name'] as string)?.split('-')[0]);

	const {
		data: personDetailsData,
		loading: personDetailsLoading,
	}: IUseGQLQuery<
		NexusGenObjects['PersonDetailsRes'],
		NexusGenArgTypes['Query']['personDetails']
	> = useGQLQuery<NexusGenArgTypes['Query']['personDetails']>(
		Queries.QUERY_PERSON_DETAILS,
		{
			variables: {
				personDetailsId: id,
			},
			fetchPolicy: 'network-only',
		}
	);

	const {
		data: knownForMoviesData,
		loading: knownForMoviesLoading,
	}: IUseGQLQuery<
		NexusGenObjects['PersonsKnownForMovieRes'],
		NexusGenArgTypes['Query']['personsKnownForMovieRes']
	> = useGQLQuery<NexusGenArgTypes['Query']['personsKnownForMovieRes']>(
		Queries.QUERY_GET_PERSONS_KNOWN_FOR_MOVIES,
		{
			variables: {
				personsKnownForMovieResId: id,
			},
			fetchPolicy: 'network-only',
		}
	);

	const {
		data: knownForShowsData,
		loading: knownForShowsLoading,
	}: IUseGQLQuery<
		NexusGenObjects['PersonsKnownForShowRes'],
		NexusGenArgTypes['Query']['personsKnownForShowRes']
	> = useGQLQuery<NexusGenArgTypes['Query']['personsKnownForShowRes']>(
		Queries.QUERY_GET_PERSONS_KNOWN_FOR_SHOWS,
		{
			variables: {
				personsKnownForShowResId: id,
			},
			fetchPolicy: 'network-only',
		}
	);

	const knownForContainerRef = useRef<HTMLElement>(null);

	const memoMappedMedia = useMemo(() => {
		const uniqueMovies: Set<number> = new Set();

		const mappedMoviesCast: IKnownForMedia[] = [];

		for (const castObj of knownForMoviesData?.cast ?? []) {
			if (!uniqueMovies.has(castObj!.id)) {
				uniqueMovies.add(castObj!.id);

				mappedMoviesCast.push({
					id: castObj!.id,
					poster_path: castObj!.poster_path,
					title: castObj!.title,
					popularity: castObj!.popularity,
				});
			}
		}

		const uniqueShows: Set<number> = new Set();

		const mappedShowsCast: IKnownForMedia[] = [];

		for (const castObj of knownForShowsData?.cast ?? []) {
			if (
				!uniqueShows.has(castObj!.id) &&
				castObj!.episode_count! > KNOWN_FOR_MIN_EP_COUNT
			) {
				uniqueShows.add(castObj!.id);

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
	}, [knownForMoviesData, knownForShowsData]);

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

	if (
		personDetailsLoading ||
		!personDetailsData ||
		knownForMoviesLoading ||
		knownForShowsLoading
	) {
		return (
			<section className='flex justify-center items-center h-screen'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>{personDetailsData.name}</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
				<section className='relative mx-4 mt-4'>
					<Image
						className='rounded-lg'
						src={BASE_IMG_URL + personDetailsData.profile_path}
						alt={personDetailsData.name ?? undefined}
						layout='fill'
					/>
				</section>

				<section className='pb-48'>
					<h1>{personDetailsData.name}</h1>
					<h3 className='my-4'>Biography</h3>
					<p>
						{personDetailsData.biography!.length > 0
							? personDetailsData.biography
							: `We don't have a biography for ${personDetailsData.name}.`}
					</p>
				</section>

				<section className='ml-8 mt-4'>
					<h3 className='mb-4 underline underline-offset-4'>Personal Info</h3>
					<h4>Known For</h4>
					<p className='ml-1'>{personDetailsData.known_for_department}</p>
					<h4 className='mt-4'>Gender</h4>
					<p className='ml-1'>
						{personDetailsData.gender === 1
							? 'Female'
							: personDetailsData.gender === 2
							? 'Male'
							: 'Unknown'}
					</p>
					<h4 className='mt-4'>Date of Birth</h4>
					<p className='ml-1'>
						{personDetailsData.birthday
							? `${formatDate(personDetailsData.birthday)}${
									!personDetailsData.deathday
										? ` (${getAge(personDetailsData.birthday)} years old)`
										: ''
							  }`
							: 'Unknown'}
					</p>
					<h4 className='mt-4'>Born In</h4>
					<p className='ml-1'>
						{personDetailsData.place_of_birth
							? personDetailsData.place_of_birth
							: 'Unknown'}
					</p>
					{personDetailsData.deathday && (
						<>
							<h4 className='mt-4'>Date of Death</h4>
							<p className='ml-1'>{`${formatDate(personDetailsData.deathday)}${
								personDetailsData.birthday &&
								` (${
									getAge(personDetailsData.birthday) -
									getAge(personDetailsData.deathday)
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
		</>
	);
};

export default PersonDetails;
