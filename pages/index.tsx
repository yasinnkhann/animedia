import type { NextPage } from 'next';
import SearchBar from '../components/SearchBar';
import HorizontalScroller from '../components/HorizontalScrollerUI/HorizontalScroller';
import { useQuery } from '@apollo/client';
import { QUERY_POPULAR_MOVIES } from '../graphql/queries';

const Home: NextPage = () => {
	const { data: popularMoviesData, loading } = useQuery(QUERY_POPULAR_MOVIES);

	const popularMovies = popularMoviesData?.popularMovies;

	if (loading) {
		return <div>Data Loading...</div>;
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
