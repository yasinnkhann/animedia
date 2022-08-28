import type { NextPage } from 'next';
import SearchBar from '../components/SearchBar';
import HorizontalScroller from '../components/HorizontalScrollerUI/HorizontalScroller';
import { useGetQuery } from '../hooks/useGetQuery';
import * as Queries from '../graphql/queries';

const Home: NextPage = () => {
	const {
		data: popularMovies,
		loading,
		error,
	} = useGetQuery(Queries.QUERY_POPULAR_MOVIES);

	console.log(popularMovies);

	if (loading) {
		return <div>Data Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<>
			{popularMovies ? (
				<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
					<SearchBar />
					<h1>Popular Movies:</h1>
					<HorizontalScroller items={popularMovies.results} />
				</div>
			) : (
				<div>Movies Not loaded...</div>
			)}
		</>
	);
};

export default Home;
