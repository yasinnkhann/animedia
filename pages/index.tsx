import React, { useState } from 'react';
import Head from 'next/head';
import SearchBar from '../components/UI/SearchUI/SearchBar';
import HomeHorizontalScroller from '../components/UI/HorizontalScrollerUI/Home/HomeHorizontalScroller';
import * as Queries from '../graphql/queries';
import { Circles } from 'react-loading-icons';
import { useGQLQuery } from '../hooks/useGQL';
import { DocumentNode } from '@apollo/client';
import { THomeHorizontalScrollerData } from '@ts/types';
import type { NextPage, GetStaticProps } from 'next';
import {
	NexusGenArgTypes,
	NexusGenObjects,
	NexusGenEnums,
} from '../graphql/generated/nexus-typegen';

const Home: NextPage = () => {
	const [whatsPopularQueryType, setWhatsPopularQueryType] =
		useState<DocumentNode>(Queries.POPULAR_MOVIES);

	const [trendingQueryType, setTrendingQueryType] = useState<DocumentNode>(
		Queries.TRENDING_MOVIES
	);

	const [trendingTimeWindow, setTrendingTimeWindow] =
		useState<NexusGenEnums['TimeWindowTypes']>('day');

	const { data: whatsPopularData, loading: whatsPopularLoading } = useGQLQuery<
		NexusGenObjects['MoviesRes']
	>(whatsPopularQueryType);

	const { data: trendingData, loading: trendingLoading } = useGQLQuery<
		NexusGenObjects['MoviesRes'],
		NexusGenArgTypes['Query']['trendingMovies']
	>(trendingQueryType, {
		variables: {
			timeWindow: trendingTimeWindow,
		},
	});

	// Preparing the queries
	const {} = useGQLQuery<NexusGenObjects['ShowsRes']>(Queries.POPULAR_SHOWS);

	const {} = useGQLQuery<NexusGenObjects['MoviesInTheatresRes']>(
		Queries.MOVIES_IN_THEATRES
	);

	const {} = useGQLQuery<
		NexusGenObjects['MoviesRes'],
		NexusGenArgTypes['Query']['trendingMovies']
	>(Queries.TRENDING_MOVIES, {
		variables: {
			timeWindow: 'week',
		},
	});

	const {} = useGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['trendingShows']
	>(Queries.TRENDING_SHOWS, {
		variables: {
			timeWindow: 'day',
		},
	});

	const {} = useGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['trendingShows']
	>(Queries.TRENDING_SHOWS, {
		variables: {
			timeWindow: 'week',
		},
	});

	const allDataLoaded =
		whatsPopularData &&
		!whatsPopularLoading &&
		trendingData &&
		!trendingLoading;

	const handleChangePopularQueryType = (queryType: DocumentNode) => {
		setWhatsPopularQueryType(queryType);
	};

	const handleChangeTrendingQueryType = (queryType: DocumentNode) => {
		setTrendingQueryType(queryType);
	};

	if (trendingLoading || whatsPopularLoading) {
		return (
			<section className='flex justify-center items-center h-screen'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>Home</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				{allDataLoaded && (
					<div>
						<SearchBar />
						<section className='mt-4'>
							<section className='flex w-full ml-[3rem] items-end'>
								<div>
									<h1 className='text-xl sm:text-3xl'>What&apos;s Popular</h1>
								</div>
								<ul className='flex w-[15rem] md:w-[25rem] justify-around'>
									<li
										className={`cursor-pointer ${
											whatsPopularQueryType === Queries.POPULAR_MOVIES
												? 'border-b-4 border-indigo-500'
												: ''
										}`}
										onClick={() =>
											handleChangePopularQueryType(Queries.POPULAR_MOVIES)
										}
									>
										Movies
									</li>
									<li
										className={`cursor-pointer ${
											whatsPopularQueryType === Queries.POPULAR_SHOWS
												? 'border-b-4 border-indigo-500'
												: ''
										}`}
										onClick={() =>
											handleChangePopularQueryType(Queries.POPULAR_SHOWS)
										}
									>
										Shows
									</li>
									<li
										className={`cursor-pointer ${
											whatsPopularQueryType === Queries.MOVIES_IN_THEATRES
												? 'border-b-4 border-indigo-500'
												: ''
										}`}
										onClick={() =>
											handleChangePopularQueryType(Queries.MOVIES_IN_THEATRES)
										}
									>
										In Theatres
									</li>
								</ul>
							</section>

							<section className='mt-4'>
								<HomeHorizontalScroller
									items={
										whatsPopularData.results as THomeHorizontalScrollerData
									}
								/>
							</section>

							<section className='flex items-end ml-[3rem] mt-4'>
								<div>
									<h1 className='text-xl sm:text-3xl'>Trending</h1>
								</div>
								<section className='flex w-full justify-around'>
									<ul className='flex justify-around'>
										<li
											className={`cursor-pointer mr-4 md:mr-20 ${
												trendingQueryType === Queries.TRENDING_MOVIES
													? 'border-b-4 border-indigo-500'
													: ''
											}`}
											onClick={() =>
												handleChangeTrendingQueryType(Queries.TRENDING_MOVIES)
											}
										>
											Movies
										</li>
										<li
											className={`cursor-pointer ${
												trendingQueryType === Queries.TRENDING_SHOWS
													? 'border-b-4 border-indigo-500'
													: ''
											}`}
											onClick={() =>
												handleChangeTrendingQueryType(Queries.TRENDING_SHOWS)
											}
										>
											Shows
										</li>
									</ul>
									<ul className='flex justify-around'>
										<li
											className={`cursor-pointer mr-4 md:mr-20 ${
												trendingTimeWindow === 'day'
													? 'border-b-4 border-indigo-500'
													: ''
											}`}
											onClick={() => setTrendingTimeWindow('day')}
										>
											Today
										</li>
										<li
											className={`cursor-pointer ${
												trendingTimeWindow === 'week'
													? 'border-b-4 border-indigo-500'
													: ''
											}`}
											onClick={() => setTrendingTimeWindow('week')}
										>
											This Week
										</li>
									</ul>
								</section>
							</section>

							<section className='mt-4 pb-4'>
								<HomeHorizontalScroller
									items={trendingData.results as THomeHorizontalScrollerData}
								/>
							</section>
						</section>
					</div>
				)}
			</main>
		</>
	);
};

export default Home;

export const getStaticProps: GetStaticProps = async _ctx => {
	return { props: { hideScrollBar: true } };
};
