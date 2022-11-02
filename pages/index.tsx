import React, { useEffect, useState, useRef } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import SearchBar from '../components/UI/SearchUI/SearchBar';
import HomeHorizontalScroller from '../components/UI/HorizontalScrollerUI/HomeHorizontalScroller';
import * as Queries from '../graphql/queries';
import { Circles } from 'react-loading-icons';
import { useGQLQuery } from '../hooks/useGQL';
import { IUseGQLQuery } from '@ts/interfaces';
import { DocumentNode } from '@apollo/client';
import { THorizontalScrollerData } from '@ts/types';
import {
	NexusGenArgTypes,
	NexusGenObjects,
	NexusGenEnums,
} from '../graphql/generated/nexus-typegen';
import { useSession } from 'next-auth/react';

const Home: NextPage = () => {
	const { data: session } = useSession();

	const whatsPopularContainerRef = useRef<HTMLElement>(null);
	const trendingContainerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (whatsPopularContainerRef.current && trendingContainerRef.current) {
			const scrollerClass =
				'.react-horizontal-scrolling-menu--scroll-container';

			const whatsPopularScroller =
				whatsPopularContainerRef.current.querySelector(
					scrollerClass
				) as HTMLDivElement;

			whatsPopularScroller.style.height = '25rem';

			const trendingScroller = trendingContainerRef.current.querySelector(
				scrollerClass
			) as HTMLDivElement;

			trendingScroller.style.height = '25rem';
		}
	});

	const [whatsPopularQueryType, setWhatsPopularQueryType] =
		useState<DocumentNode>(Queries.QUERY_POPULAR_MOVIES);

	const [trendingQueryType, setTrendingQueryType] = useState<DocumentNode>(
		Queries.QUERY_TRENDING_MOVIES
	);

	const [trendingTimeWindow, setTrendingTimeWindow] =
		useState<NexusGenEnums['TimeWindowTypes']>('day');

	const {
		data: whatsPopularData,
		loading: whatsPopularLoading,
	}: IUseGQLQuery<NexusGenObjects['MoviesRes']> = useGQLQuery(
		whatsPopularQueryType
	);

	const {
		data: trendingData,
		loading: trendingLoading,
	}: IUseGQLQuery<
		NexusGenObjects['MoviesRes'],
		NexusGenArgTypes['Query']['trendingMovies']
	> = useGQLQuery<NexusGenArgTypes['Query']['trendingMovies']>(
		trendingQueryType,
		{
			variables: {
				timeWindow: trendingTimeWindow,
			},
		}
	);

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
	const {
		fetchData: fetchPopularShowsData,
	}: IUseGQLQuery<NexusGenObjects['ShowsRes']> = useGQLQuery(
		Queries.QUERY_POPULAR_SHOWS
	);
	const {
		fetchData: fetchMoviesInTheatresData,
	}: IUseGQLQuery<NexusGenObjects['MoviesInTheatresRes']> = useGQLQuery(
		Queries.QUERY_MOVIES_IN_THEATRES
	);
	const {
		fetchData: fetchWeeklyTrendingMoviesData,
	}: IUseGQLQuery<
		NexusGenObjects['MoviesRes'],
		NexusGenArgTypes['Query']['trendingMovies']
	> = useGQLQuery<NexusGenArgTypes['Query']['trendingMovies']>(
		Queries.QUERY_TRENDING_MOVIES,
		{
			variables: {
				timeWindow: 'week',
			},
		}
	);

	const {
		fetchData: fetchDailyTrendingShowsData,
	}: IUseGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['trendingShows']
	> = useGQLQuery<NexusGenArgTypes['Query']['trendingShows']>(
		Queries.QUERY_TRENDING_SHOWS,
		{
			variables: {
				timeWindow: 'day',
			},
		}
	);
	const {
		fetchData: fetchWeeklyTrendingShowsData,
	}: IUseGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['trendingShows']
	> = useGQLQuery<NexusGenArgTypes['Query']['trendingShows']>(
		Queries.QUERY_TRENDING_SHOWS,
		{
			variables: {
				timeWindow: 'week',
			},
		}
	);

	if (trendingLoading || whatsPopularLoading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</div>
		);
	}

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
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
									className='cursor-pointer'
									style={{
										borderBottom:
											whatsPopularQueryType === Queries.QUERY_POPULAR_MOVIES
												? '5px solid black'
												: undefined,
									}}
									onClick={() =>
										handleChangePopularQueryType(Queries.QUERY_POPULAR_MOVIES)
									}
								>
									Movies
								</li>
								<li
									className='cursor-pointer'
									style={{
										borderBottom:
											whatsPopularQueryType === Queries.QUERY_POPULAR_SHOWS
												? '5px solid black'
												: undefined,
									}}
									onClick={() =>
										handleChangePopularQueryType(Queries.QUERY_POPULAR_SHOWS)
									}
								>
									Shows
								</li>
								<li
									className='cursor-pointer'
									style={{
										borderBottom:
											whatsPopularQueryType === Queries.QUERY_MOVIES_IN_THEATRES
												? '5px solid black'
												: undefined,
									}}
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

						<section className='mt-4' ref={whatsPopularContainerRef}>
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
										className='cursor-pointer'
										style={{
											borderBottom:
												trendingQueryType === Queries.QUERY_TRENDING_MOVIES
													? '5px solid black'
													: undefined,
										}}
										onClick={() =>
											handleChangeTrendingQueryType(
												Queries.QUERY_TRENDING_MOVIES
											)
										}
									>
										Movies
									</li>
									<li
										className='cursor-pointer'
										style={{
											borderBottom:
												trendingQueryType === Queries.QUERY_TRENDING_SHOWS
													? '5px solid black'
													: undefined,
										}}
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
										className='cursor-pointer'
										style={{
											borderBottom:
												trendingTimeWindow === 'day'
													? '5px solid black'
													: undefined,
										}}
										onClick={() => setTrendingTimeWindow('day')}
									>
										Today
									</li>
									<li
										className='cursor-pointer'
										style={{
											borderBottom:
												trendingTimeWindow === 'week'
													? '5px solid black'
													: undefined,
										}}
										onClick={() => setTrendingTimeWindow('week')}
									>
										This Week
									</li>
								</ul>
							</section>
						</section>

						<section className='mt-4' ref={trendingContainerRef}>
							<HomeHorizontalScroller
								items={trendingData.results as THorizontalScrollerData}
							/>
						</section>
					</section>
				</div>
			)}
		</div>
	);
};

export default Home;

export const getStaticProps: GetStaticProps = async _ctx => {
	return { props: { hideScrollBar: true } };
};
