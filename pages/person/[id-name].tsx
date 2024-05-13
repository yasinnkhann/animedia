import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import * as Queries from '../../graphql/queries';
import { Circles } from 'react-loading-icons';
import { IRelatedMedia } from '@ts/interfaces';
import { CommonMethods } from '../../utils/CommonMethods';
import RelatedHorizontalScroller from '../../components/HorizontalScroller/Related/RelatedHorizontalScroller';
import {
	KNOWN_FOR_MIN_EP_COUNT,
	KNOWN_FOR_CARDS_LIMIT,
	MAX_BIO_WORD_LENGTH,
} from '../../utils/constants';
import { useQuery } from '@apollo/client';
import _ from 'lodash';
import Modal from 'components/Modal';

const PersonDetails = () => {
	const router = useRouter();

	const id = (router.query?.['id-name'] as string)?.split('-')[0];

	const [showFullDescription, setShowFullDescription] = useState(false);

	const { data: personDetailsData, loading: personDetailsLoading } = useQuery(
		Queries.PERSON_DETAILS,
		{
			variables: {
				personDetailsId: id,
			},
			fetchPolicy: 'network-only',
		}
	);

	const { data: knownForMoviesData, loading: knownForMoviesLoading } = useQuery(
		Queries.GET_PERSONS_KNOWN_FOR_MOVIES,
		{
			variables: {
				personsKnownForMovieResId: id,
			},
			fetchPolicy: 'network-only',
		}
	);

	const { data: knownForShowsData, loading: knownForShowsLoading } = useQuery(
		Queries.GET_PERSONS_KNOWN_FOR_SHOWS,
		{
			variables: {
				personsKnownForShowResId: id,
			},
			fetchPolicy: 'network-only',
		}
	);

	const memoMappedMedia = useMemo(() => {
		const uniqueMovies: Set<string> = new Set();

		const mappedMoviesCast: IRelatedMedia[] = [];

		for (const castObj of knownForMoviesData?.personsKnownForMovie?.cast ??
			[]) {
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

		const uniqueShows: Set<string> = new Set();

		const mappedShowsCast: IRelatedMedia[] = [];

		for (const castObj of knownForShowsData?.personsKnownForShow?.cast ?? []) {
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
			<section className='flex h-screen items-center justify-center'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>{personDetailsData.personDetails.name}</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
				<section className='aspect-h-16 aspect-w-16 relative mx-4 mt-4'>
					<Image
						className='rounded-lg'
						src={CommonMethods.getImage(
							personDetailsData.personDetails.profile_path
						)}
						alt={personDetailsData.personDetails.name ?? undefined}
						layout='fill'
					/>
				</section>

				<section className='pb-48'>
					<h1>{personDetailsData.personDetails.name}</h1>
					<h3 className='my-4'>Biography</h3>
					<div>
						{personDetailsData.personDetails.biography ? (
							personDetailsData.personDetails.biography.split(' ').length <=
							MAX_BIO_WORD_LENGTH ? (
								personDetailsData.personDetails.biography
							) : (
								<div>
									<p>
										{personDetailsData.personDetails.biography
											.split(' ')
											.slice(0, MAX_BIO_WORD_LENGTH)
											.join(' ') + '...'}
									</p>
									<button
										className='mt-2 text-blue-500 underline'
										onClick={() => setShowFullDescription(state => !state)}
									>
										{showFullDescription ? 'See Less' : 'See More'}
									</button>
								</div>
							)
						) : (
							<i>No Bio Available</i>
						)}
					</div>
				</section>

				<section className='ml-8 mt-4'>
					<h3 className='mb-4 underline underline-offset-4'>Personal Info</h3>
					<h4>Known For</h4>
					<p className='ml-1'>
						{personDetailsData.personDetails.known_for_department}
					</p>
					<h4 className='mt-4'>Gender</h4>
					<p className='ml-1'>
						{personDetailsData.personDetails.gender === 1
							? 'Female'
							: personDetailsData.personDetails.gender === 2
								? 'Male'
								: 'Unknown'}
					</p>
					<h4 className='mt-4'>Date of Birth</h4>
					<p className='ml-1'>
						{personDetailsData.personDetails.birthday
							? `${CommonMethods.formatDate(
									personDetailsData.personDetails.birthday
								)}${
									!personDetailsData.personDetails.deathday
										? ` (${getAge(
												personDetailsData.personDetails.birthday
											)} years old)`
										: ''
								}`
							: 'Unknown'}
					</p>
					<h4 className='mt-4'>Born In</h4>
					<p className='ml-1'>
						{personDetailsData.personDetails.place_of_birth
							? personDetailsData.personDetails.place_of_birth
							: 'Unknown'}
					</p>
					{personDetailsData.personDetails.deathday && (
						<>
							<h4 className='mt-4'>Date of Death</h4>
							<p className='ml-1'>{`${CommonMethods.formatDate(
								personDetailsData.personDetails.deathday
							)}${
								personDetailsData.personDetails.birthday &&
								` (${
									getAge(personDetailsData.personDetails.birthday) -
									getAge(personDetailsData.personDetails.deathday)
								}`
							} years old)`}</p>
						</>
					)}
				</section>

				{!_.isEmpty(memoMappedMedia) && (
					<section className='col-start-2 mt-4 pb-4'>
						<h3 className='mb-4 ml-8'>Known For</h3>
						<RelatedHorizontalScroller items={memoMappedMedia} />
					</section>
				)}
			</main>

			{showFullDescription && (
				<Modal closeModal={() => setShowFullDescription(false)}>
					<h3 className='mb-4 text-xl font-semibold'>Biography</h3>
					<p>{personDetailsData.personDetails.biography}</p>
				</Modal>
			)}
		</>
	);
};

export default PersonDetails;
