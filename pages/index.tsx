import type { NextPage } from 'next';
import SearchBar from '../components/SearchBar';
import { useState } from 'react';
import HorizontalScroller from '../components/HorizontalScrollerUI/HorizontalScroller';
import { useGetQuery } from '../hooks/useGetQuery';
import * as Queries from '../graphql/queries';
import { DocumentNode } from '@apollo/client';

const Home: NextPage = () => {
	const [queryType, setQueryType] = useState(Queries.QUERY_POPULAR_MOVIES);

	const { data, loading, error } = useGetQuery(queryType);

	const { fetchData } = useGetQuery(Queries.QUERY_MOVIES_IN_THEATRES);
	const { fetchData: _ } = useGetQuery(Queries.QUERY_POPULAR_SHOWS);

	if (loading) {
		return <div>Data Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const handleChangeQueryType = (queryType: DocumentNode) => {
		setQueryType(queryType);
	};

	return (
		<>
			{data ? (
				<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
					<SearchBar />
					<ul className='flex items-center'>
						<section className='mr-[3rem]'>
							<h1>What&apos;s Popular</h1>
						</section>
						<section className='flex'>
							<p
								onClick={() =>
									handleChangeQueryType(Queries.QUERY_POPULAR_MOVIES)
								}
							>
								Movies
							</p>
							<p
								onClick={() =>
									handleChangeQueryType(Queries.QUERY_POPULAR_SHOWS)
								}
							>
								Shows
							</p>
							<p
								onClick={() =>
									handleChangeQueryType(Queries.QUERY_MOVIES_IN_THEATRES)
								}
							>
								In Theatres
							</p>
						</section>
					</ul>
					<HorizontalScroller items={data.results} />
				</div>
			) : (
				<div>Movies Not loaded...</div>
			)}
		</>
	);
};

export default Home;
