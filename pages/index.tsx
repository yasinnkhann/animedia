import type { NextPage } from 'next';
import SearchBar from '../components/SearchBar';
import HorizontalScroller from '../components/HorizontalScrollerUI/HorizontalScroller';
import useGetQuery from '../hooks/UseGetQuery';

const Home: NextPage = () => {
	const { data: popularMovies, loading } = useGetQuery('popular movies');

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
