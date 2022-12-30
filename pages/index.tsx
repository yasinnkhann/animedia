import React, { useState } from 'react';
import Head from 'next/head';
import SearchBar from '../components/UI/SearchUI/SearchBar';
import HomeHorizontalScroller from '../components/UI/HorizontalScrollerUI/HomeHorizontalScroller';
import * as Queries from '../graphql/queries';
import { Circles } from 'react-loading-icons';
import { useGQLQuery } from '../hooks/useGQL';
import { DocumentNode } from '@apollo/client';
import { THorizontalScrollerData } from '@ts/types';
import type { NextPage, GetStaticProps } from 'next';
import {
	NexusGenArgTypes,
	NexusGenObjects,
	NexusGenEnums,
} from '../graphql/generated/nexus-typegen';

const Home: NextPage = () => {
	const [whatsPopularQueryType, setWhatsPopularQueryType] =
		useState<DocumentNode>(Queries.QUERY_POPULAR_MOVIES);

	const [trendingQueryType, setTrendingQueryType] = useState<DocumentNode>(
		Queries.QUERY_TRENDING_MOVIES
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

	// Preparing the lazy functions
	const { fetchData: fetchPopularShowsData } = useGQLQuery<
		NexusGenObjects['ShowsRes']
	>(Queries.QUERY_POPULAR_SHOWS);

	const { fetchData: fetchMoviesInTheatresData } = useGQLQuery<
		NexusGenObjects['MoviesInTheatresRes']
	>(Queries.QUERY_MOVIES_IN_THEATRES);

	const { fetchData: fetchWeeklyTrendingMoviesData } = useGQLQuery<
		NexusGenObjects['MoviesRes'],
		NexusGenArgTypes['Query']['trendingMovies']
	>(Queries.QUERY_TRENDING_MOVIES, {
		variables: {
			timeWindow: 'week',
		},
	});

	const { fetchData: fetchDailyTrendingShowsData } = useGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['trendingShows']
	>(Queries.QUERY_TRENDING_SHOWS, {
		variables: {
			timeWindow: 'day',
		},
	});

	const { fetchData: fetchWeeklyTrendingShowsData } = useGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['trendingShows']
	>(Queries.QUERY_TRENDING_SHOWS, {
		variables: {
			timeWindow: 'week',
		},
	});

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
								<div className='flex'>
									<h1>What&apos;s Popular</h1>
								</div>
								<ul className='flex w-[25%] justify-around'>
									<li
										className={`cursor-pointer ${
											whatsPopularQueryType === Queries.QUERY_POPULAR_MOVIES
												? 'border-b-4 border-indigo-500'
												: ''
										}`}
										onClick={() =>
											handleChangePopularQueryType(Queries.QUERY_POPULAR_MOVIES)
										}
									>
										Movies
									</li>
									<li
										className={`cursor-pointer ${
											whatsPopularQueryType === Queries.QUERY_POPULAR_SHOWS
												? 'border-b-4 border-indigo-500'
												: ''
										}`}
										onClick={() =>
											handleChangePopularQueryType(Queries.QUERY_POPULAR_SHOWS)
										}
									>
										Shows
									</li>
									<li
										className={`cursor-pointer ${
											whatsPopularQueryType === Queries.QUERY_MOVIES_IN_THEATRES
												? 'border-b-4 border-indigo-500'
												: ''
										}`}
										onClick={() =>
											handleChangePopularQueryType(
												Queries.QUERY_MOVIES_IN_THEATRES
											)
										}
									>
										In Theatres
									</li>
								</ul>
							</section>

							<section className='mt-4'>
								<HomeHorizontalScroller
									items={whatsPopularData.results as THorizontalScrollerData}
								/>
							</section>

							<section className='flex items-end ml-[3rem] mt-4'>
								<div className=''>
									<h1>Trending</h1>
								</div>
								<section className='flex w-full justify-around'>
									<ul className='flex w-[20%] justify-around'>
										<li
											className={`cursor-pointer ${
												trendingQueryType === Queries.QUERY_TRENDING_MOVIES
													? 'border-b-4 border-indigo-500'
													: ''
											}`}
											onClick={() =>
												handleChangeTrendingQueryType(
													Queries.QUERY_TRENDING_MOVIES
												)
											}
										>
											Movies
										</li>
										<li
											className={`cursor-pointer ${
												trendingQueryType === Queries.QUERY_TRENDING_SHOWS
													? 'border-b-4 border-indigo-500'
													: ''
											}`}
											onClick={() =>
												handleChangeTrendingQueryType(
													Queries.QUERY_TRENDING_SHOWS
												)
											}
										>
											Shows
										</li>
									</ul>
									<ul className='flex w-[20%] justify-around'>
										<li
											className={`cursor-pointer ${
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
									items={trendingData.results as THorizontalScrollerData}
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
