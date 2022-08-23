import type { NextPage } from 'next';
import SearchBar from '../components/SearchBar';
import HorizontalScroller from '../components/HorizontalScrollerUI/HorizontalScroller';
import { gql, useQuery } from '@apollo/client';

const QUERY_ALL_POPULAR_MOVIES = gql`
	query getPopularMovies {
		popularMovies {
			page
			total_pages
			total_results
			results {
				original_title
				overview
				adult
				backdrop_path
				genre_ids
				id
				original_language
				popularity
				poster_path
				release_date
				title
				video
				vote_average
				vote_count
			}
		}
	}
`;

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
