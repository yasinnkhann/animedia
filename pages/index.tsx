import type { NextPage } from 'next';
import SearchBar from '../components/SearchBar';
import { useState } from 'react';
import HorizontalScroller from '../components/HorizontalScrollerUI/HorizontalScroller';
import { useGetQuery } from '../hooks/useGetQuery';
import * as Queries from '../graphql/queries';
import { DocumentNode } from '@apollo/client';

const Home: NextPage = () => {
	const [whatsPopularQueryType, setWhatsPopularQueryType] = useState(
		Queries.QUERY_POPULAR_MOVIES
	);

	const [trendingQueryType, setTrendingQueryType] = useState(
		Queries.QUERY_TRENDING_MOVIES
	);

	const { data: whatsPopularData } = useGetQuery(whatsPopularQueryType);

	const { data: trendingData, refetch: refetchTrendingData } = useGetQuery(
		trendingQueryType,
		{
			timeWindow: 'day',
		}
	);

	const handleChangePopularQueryType = (queryType: DocumentNode) => {
		setWhatsPopularQueryType(queryType);
	};

	const handleChangeTrendingQueryType = (queryType: DocumentNode) => {
		setTrendingQueryType(queryType);
	};

	// const { fetchData } = useGetQuery(Queries.QUERY_MOVIES_IN_THEATRES);
	// const { fetchData: _ } = useGetQuery(Queries.QUERY_POPULAR_SHOWS);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			{whatsPopularData && (
				<>
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

					<HorizontalScroller items={whatsPopularData.results} />
				</>
			)}
			{trendingData && (
				<>
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
									refetchTrendingData({
										timeWindow: 'day',
									})
								}
							>
								Today
							</p>
							<p
								onClick={() =>
									refetchTrendingData({
										timeWindow: 'week',
									})
								}
							>
								This Week
							</p>
						</section>
					</ul>

					<HorizontalScroller items={trendingData.results} />
				</>
			)}
		</div>
	);
};

export default Home;
