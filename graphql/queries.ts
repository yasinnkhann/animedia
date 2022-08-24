import { gql } from '@apollo/client';

export const QUERY_ALL_POPULAR_MOVIES = gql`
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
