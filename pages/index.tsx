import type { NextPage } from 'next';
import SearchBar from '../components/SearchBar';
import HorizontalScroller from '../components/HorizontalScrollerUI/HorizontalScroller';
import { useQuery } from '@apollo/client';
import { QUERY_ALL_POPULAR_MOVIES } from '../graphql/queries';

const Home: NextPage = () => {
	const {
		data: popularMoviesData,
		loading,
		refetch,
	} = useQuery(QUERY_ALL_POPULAR_MOVIES);

	if (loading) {
		return <div>Data Loading...</div>;
	}

	console.log('DATA: ', popularMoviesData?.popularMovies);
	return (
		<>
			{popularMoviesData ? (
				<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
					<SearchBar />
					<HorizontalScroller items={popularMoviesData.popularMovies.results} />
				</div>
			) : (
				<div></div>
			)}
		</>
	);
};

export default Home;
