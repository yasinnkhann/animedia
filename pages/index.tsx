import type { NextPage } from 'next';
import SearchBar from '../components/SearchBar';
import { useState, useEffect } from 'react';
import HorizontalScroller from '../components/UI/HorizontalScrollerUI/HorizontalScroller';
import { useGetQuery } from '../hooks/useGetQuery';
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
		useGetQuery(whatsPopularQueryType);

	const {
		data: trendingData,
		refetch: refetchTrendingData,
	}: IUseGetQuery<NexusGenObjects['MoviesRes']> = useGetQuery<
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
	const { fetchData: _ }: IUseGetQuery<NexusGenObjects['MoviesRes']> =
		useGetQuery(Queries.QUERY_POPULAR_SHOWS);
	const {
		fetchData: __,
	}: IUseGetQuery<NexusGenObjects['MoviesInTheatresRes']> = useGetQuery(
		Queries.QUERY_MOVIES_IN_THEATRES
	);
	const { fetchData: ___ }: IUseGetQuery<NexusGenObjects['MoviesRes']> =
		useGetQuery<NexusGenArgTypes['Query']['trendingMovies']>(
			Queries.QUERY_TRENDING_MOVIES,
			{
				timeWindow: EHorizontalScrollerTimeWindow.WEEK,
			}
		);
	const { fetchData: ____ }: IUseGetQuery<NexusGenObjects['ShowsRes']> =
		useGetQuery<NexusGenArgTypes['Query']['trendingShows']>(
			Queries.QUERY_TRENDING_SHOWS,
			{
				timeWindow: EHorizontalScrollerTimeWindow.DAY,
			}
		);
	const { fetchData: _____ }: IUseGetQuery<NexusGenObjects['ShowsRes']> =
		useGetQuery<NexusGenArgTypes['Query']['trendingShows']>(
			Queries.QUERY_TRENDING_SHOWS,
			{
				timeWindow: EHorizontalScrollerTimeWindow.WEEK,
			}
		);

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

					<ul className='flex items-center'>
						<section className='mr-[3rem]'>
							<h1>What&apos;s Popular</h1>
						</section>
						<section className='flex'>
							<p
								onClick={() =>
									handleChangePopularQueryType(Queries.QUERY_POPULAR_MOVIES)
								}
							>
								Movies
							</p>
							<p
								onClick={() =>
									handleChangePopularQueryType(Queries.QUERY_POPULAR_SHOWS)
								}
							>
								Shows
							</p>
							<p
								onClick={() =>
									handleChangePopularQueryType(Queries.QUERY_MOVIES_IN_THEATRES)
								}
							>
								In Theatres
							</p>
						</section>
					</ul>
					<HorizontalScroller
						items={whatsPopularData.results as THorizontalScrollerData}
					/>

					<ul className='flex items-center'>
						<section className='mr-[3rem]'>
							<h1>Trending</h1>
						</section>
						<section className='flex'>
							<p
								onClick={() =>
									handleChangeTrendingQueryType(Queries.QUERY_TRENDING_MOVIES)
								}
							>
								Movies
							</p>
							<p
								onClick={() =>
									handleChangeTrendingQueryType(Queries.QUERY_TRENDING_SHOWS)
								}
							>
								Shows
							</p>
						</section>
						<section className='flex'>
							<p
								onClick={() =>
									setTrendingTimeWindow(EHorizontalScrollerTimeWindow.DAY)
								}
							>
								Today
							</p>
							<p
								onClick={() =>
									setTrendingTimeWindow(EHorizontalScrollerTimeWindow.WEEK)
								}
							>
								This Week
							</p>
						</section>
					</ul>
					<HorizontalScroller
						items={trendingData.results as THorizontalScrollerData}
					/>
				</div>
			)}
		</div>
	);
};

export default Home;
