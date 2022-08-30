import type { NextPage } from 'next';
import SearchBar from '../components/SearchBar';
import { useState, useEffect } from 'react';
import HorizontalScroller from '../components/UI/HorizontalScrollerUI/HorizontalScroller';
import { useGetQuery } from '../hooks/useGetQuery';
import * as Queries from '../graphql/queries';
import { DocumentNode } from '@apollo/client';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen/index';

type THorizontalScrollerData =
	| NexusGenObjects['MoviesRes']['results']
	| NexusGenObjects['ShowsRes']['results'];

type THorizontalScrollerTimeWindow = 'day' | 'week';

const Home: NextPage = () => {
	const [whatsPopularQueryType, setWhatsPopularQueryType] = useState(
		Queries.QUERY_POPULAR_MOVIES
	);

	const [trendingQueryType, setTrendingQueryType] = useState(
		Queries.QUERY_TRENDING_MOVIES
	);

	const [trendingTimeWindow, setTrendingTimeWindow] =
		useState<THorizontalScrollerTimeWindow>('day');

	const { data: whatsPopularData } = useGetQuery(whatsPopularQueryType);

	const { data: trendingData, refetch: refetchTrendingData } = useGetQuery(
		trendingQueryType,
		{
			timeWindow: trendingTimeWindow,
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
	const { fetchData: _ } = useGetQuery(Queries.QUERY_POPULAR_SHOWS);
	const { fetchData: __ } = useGetQuery(Queries.QUERY_MOVIES_IN_THEATRES);
	const { fetchData: ___ } = useGetQuery<{
		timeWindow: THorizontalScrollerTimeWindow;
	}>(Queries.QUERY_TRENDING_MOVIES, {
		timeWindow: 'week',
	});
	const { fetchData: ____ } = useGetQuery<{
		timeWindow: THorizontalScrollerTimeWindow;
	}>(Queries.QUERY_TRENDING_SHOWS, {
		timeWindow: 'day',
	});
	const { fetchData: _____ } = useGetQuery<{
		timeWindow: THorizontalScrollerTimeWindow;
	}>(Queries.QUERY_TRENDING_SHOWS, {
		timeWindow: 'week',
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
							<p onClick={() => setTrendingTimeWindow('day')}>Today</p>
							<p onClick={() => setTrendingTimeWindow('week')}>This Week</p>
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
