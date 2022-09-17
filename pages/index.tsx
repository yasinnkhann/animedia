import type { NextPage } from 'next';
import SearchBar from '../components/UI/SearchUI/SearchBar';
import { useState, useEffect } from 'react';
import HorizontalScroller from '../components/UI/HorizontalScrollerUI/HorizontalScroller';
import { useGQLQuery } from '../hooks/useGQL';
import * as Queries from '../graphql/queries';
import { DocumentNode } from '@apollo/client';
import { THorizontalScrollerData } from '@ts/types';
import { EHorizontalScrollerTimeWindow } from '@ts/enums';
import { IUseGetQuery } from '@ts/interfaces';
import {
	NexusGenArgTypes,
	NexusGenObjects,
} from '../graphql/generated/nexus-typegen';

const Home: NextPage = () => {
	const [whatsPopularQueryType, setWhatsPopularQueryType] =
		useState<DocumentNode>(Queries.QUERY_POPULAR_MOVIES);

	const [trendingQueryType, setTrendingQueryType] = useState<DocumentNode>(
		Queries.QUERY_TRENDING_MOVIES
	);

	const [trendingTimeWindow, setTrendingTimeWindow] =
		useState<EHorizontalScrollerTimeWindow>(EHorizontalScrollerTimeWindow.DAY);

	const { data: whatsPopularData }: IUseGetQuery<NexusGenObjects['MoviesRes']> =
		useGQLQuery(whatsPopularQueryType);

	const {
		data: trendingData,
		refetch: refetchTrendingData,
	}: IUseGetQuery<NexusGenObjects['MoviesRes']> = useGQLQuery<
		NexusGenArgTypes['Query']['trendingMovies']
	>(trendingQueryType, {
		timeWindow: trendingTimeWindow,
	});

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
	}: IUseGetQuery<NexusGenObjects['ShowsRes']> = useGQLQuery(
		Queries.QUERY_POPULAR_SHOWS
	);
	const {
		fetchData: fetchMoviesInTheatresData,
	}: IUseGetQuery<NexusGenObjects['MoviesInTheatresRes']> = useGQLQuery(
		Queries.QUERY_MOVIES_IN_THEATRES
	);
	const {
		fetchData: fetchWeeklyTrendingMoviesData,
	}: IUseGetQuery<NexusGenObjects['MoviesRes']> = useGQLQuery<
		NexusGenArgTypes['Query']['trendingMovies']
	>(Queries.QUERY_TRENDING_MOVIES, {
		timeWindow: EHorizontalScrollerTimeWindow.WEEK,
	});
	const {
		fetchData: fetchDailyTrendingShowsData,
	}: IUseGetQuery<NexusGenObjects['ShowsRes']> = useGQLQuery<
		NexusGenArgTypes['Query']['trendingShows']
	>(Queries.QUERY_TRENDING_SHOWS, {
		timeWindow: EHorizontalScrollerTimeWindow.DAY,
	});
	const {
		fetchData: fetchWeeklyTrendingShowsData,
	}: IUseGetQuery<NexusGenObjects['ShowsRes']> = useGQLQuery<
		NexusGenArgTypes['Query']['trendingShows']
	>(Queries.QUERY_TRENDING_SHOWS, {
		timeWindow: EHorizontalScrollerTimeWindow.WEEK,
	});

	useEffect(() => {
		refetchTrendingData({
			timeWindow: trendingTimeWindow,
		});
	}, [refetchTrendingData, trendingTimeWindow]);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{allDataLoaded && (
				<div>
					<SearchBar />
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
									handleChangePopularQueryType(Queries.QUERY_MOVIES_IN_THEATRES)
								}
							>
								In Theatres
							</li>
						</ul>
					</section>
					<HorizontalScroller
						items={whatsPopularData.results as THorizontalScrollerData}
					/>
					<section className='flex items-end ml-[3rem]'>
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
										handleChangeTrendingQueryType(Queries.QUERY_TRENDING_MOVIES)
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
										handleChangeTrendingQueryType(Queries.QUERY_TRENDING_SHOWS)
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
											trendingTimeWindow === EHorizontalScrollerTimeWindow.DAY
												? '5px solid black'
												: undefined,
									}}
									onClick={() =>
										setTrendingTimeWindow(EHorizontalScrollerTimeWindow.DAY)
									}
								>
									Today
								</li>
								<li
									className='cursor-pointer'
									style={{
										borderBottom:
											trendingTimeWindow === EHorizontalScrollerTimeWindow.WEEK
												? '5px solid black'
												: undefined,
									}}
									onClick={() =>
										setTrendingTimeWindow(EHorizontalScrollerTimeWindow.WEEK)
									}
								>
									This Week
								</li>
							</ul>
						</section>
					</section>
					<HorizontalScroller
						items={trendingData.results as THorizontalScrollerData}
					/>
				</div>
			)}
		</div>
	);
};

export default Home;
