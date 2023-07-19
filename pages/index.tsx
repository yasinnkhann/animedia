import React, { useState } from 'react';
import Head from 'next/head';
import SearchBar from '../components/UI/SearchUI/SearchBar';
import HomeHorizontalScroller from '../components/UI/HorizontalScrollerUI/Home/HomeHorizontalScroller';
import * as Queries from '../graphql/queries';
import { Circles } from 'react-loading-icons';
import { TypedDocumentNode, useQuery } from '@apollo/client';
import {
	THomeHorizontalScrollerData,
	TWhatsPopularData,
	TTrendingData,
} from '@ts/types';
import type { NextPage, GetStaticProps } from 'next';
import {
	PopularMoviesQuery,
	Exact,
	InputMaybe,
	PopularShowsQuery,
	MoviesInTheatresQuery,
	TimeWindowTypes,
	TrendingMoviesQuery,
	TrendingShowsQuery,
} from 'graphql/generated/code-gen/graphql';

const Home: NextPage = () => {
	const [whatsPopularQueryType, setWhatsPopularQueryType] = useState<
		TypedDocumentNode<
			PopularMoviesQuery | PopularShowsQuery | MoviesInTheatresQuery,
			Exact<{
				page?: InputMaybe<number> | undefined;
			}>
		>
	>(Queries.POPULAR_MOVIES);

	const [trendingQueryType, setTrendingQueryType] = useState<
		TypedDocumentNode<
			TrendingMoviesQuery | TrendingShowsQuery,
			Exact<{
				timeWindow: TimeWindowTypes;
				page?: InputMaybe<number> | undefined;
			}>
		>
	>(Queries.TRENDING_MOVIES);

	const [trendingTimeWindow, setTrendingTimeWindow] = useState<TimeWindowTypes>(
		TimeWindowTypes.Day
	);

	const { data: whatsPopularData, loading: whatsPopularLoading } = useQuery(
		whatsPopularQueryType
	);

	const { data: trendingData, loading: trendingLoading } = useQuery(
		trendingQueryType,
		{
			variables: {
				timeWindow: trendingTimeWindow,
			},
		}
	);

	// Preparing the queries
	const {} = useQuery(Queries.POPULAR_SHOWS);

	const {} = useQuery(Queries.MOVIES_IN_THEATRES);

	const {} = useQuery(Queries.TRENDING_MOVIES, {
		variables: {
			timeWindow: TimeWindowTypes.Week,
		},
	});

	const {} = useQuery(Queries.TRENDING_SHOWS, {
		variables: {
			timeWindow: TimeWindowTypes.Day,
		},
	});

	const {} = useQuery(Queries.TRENDING_SHOWS, {
		variables: {
			timeWindow: TimeWindowTypes.Week,
		},
	});

	const allDataLoaded =
		whatsPopularData &&
		!whatsPopularLoading &&
		trendingData &&
		!trendingLoading;

	const handleChangePopularQueryType = (
		queryType: TypedDocumentNode<
			PopularMoviesQuery | PopularShowsQuery | MoviesInTheatresQuery,
			Exact<{
				page?: InputMaybe<number> | undefined;
			}>
		>
	) => {
		setWhatsPopularQueryType(queryType);
	};

	const handleChangeTrendingQueryType = (
		queryType: TypedDocumentNode<
			TrendingMoviesQuery | TrendingShowsQuery,
			Exact<{
				timeWindow: TimeWindowTypes;
				page?: InputMaybe<number> | undefined;
			}>
		>
	) => {
		setTrendingQueryType(queryType);
	};

	if (trendingLoading || whatsPopularLoading) {
		return (
			<section className='flex h-screen items-center justify-center'>
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
							<section className='ml-[3rem] flex w-full items-end'>
								<div>
									<h1 className='text-xl sm:text-3xl'>What&apos;s Popular</h1>
								</div>
								<ul className='flex w-[15rem] justify-around md:w-[25rem]'>
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
										(
											whatsPopularData[
												Object.keys(
													whatsPopularData
												)[0] as keyof typeof whatsPopularData
											] as unknown as TWhatsPopularData
										).results as THomeHorizontalScrollerData
									}
								/>
							</section>

							<section className='ml-[3rem] mt-4 flex items-end'>
								<div>
									<h1 className='text-xl sm:text-3xl'>Trending</h1>
								</div>
								<section className='flex w-full justify-around'>
									<ul className='flex justify-around'>
										<li
											className={`mr-4 cursor-pointer md:mr-20 ${
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
											className={`mr-4 cursor-pointer md:mr-20 ${
												trendingTimeWindow === 'day'
													? 'border-b-4 border-indigo-500'
													: ''
											}`}
											onClick={() => setTrendingTimeWindow(TimeWindowTypes.Day)}
										>
											Today
										</li>
										<li
											className={`cursor-pointer ${
												trendingTimeWindow === 'week'
													? 'border-b-4 border-indigo-500'
													: ''
											}`}
											onClick={() =>
												setTrendingTimeWindow(TimeWindowTypes.Week)
											}
										>
											This Week
										</li>
									</ul>
								</section>
							</section>

							<section className='mt-4 pb-4'>
								<HomeHorizontalScroller
									items={
										(
											trendingData[
												Object.keys(
													trendingData
												)[0] as keyof typeof trendingData
											] as unknown as TTrendingData
										).results as THomeHorizontalScrollerData
									}
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
