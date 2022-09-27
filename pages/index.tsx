import type { NextPage } from 'next';
import SearchBar from '../components/UI/SearchUI/SearchBar';
import { useState } from 'react';
import HorizontalScroller from '../components/UI/HorizontalScrollerUI/HorizontalScroller';
import { useGQLQuery } from '../hooks/useGQL';
import * as Queries from '../graphql/queries';
import { DocumentNode } from '@apollo/client';
import { THorizontalScrollerData } from '@ts/types';
import { IUseGQLQuery } from '@ts/interfaces';
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

	const { data: whatsPopularData }: IUseGQLQuery<NexusGenObjects['MoviesRes']> =
		useGQLQuery(whatsPopularQueryType);

	const {
		data: trendingData,
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

	const allDataLoaded = whatsPopularData && trendingData;

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

						<section className='mt-4'>
							<HorizontalScroller
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

						<section className='mt-4'>
							<HorizontalScroller
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
