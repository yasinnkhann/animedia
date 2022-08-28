import { gql } from '@apollo/client';

export const QUERY_POPULAR_MOVIES = gql`
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

export const QUERY_SEARCHED_MOVIES = gql`
	query getSearchMovies($q: String!) {
		searchedMovies(q: $q) {
			results {
				original_title
				vote_average
				id
			}
		}
	}
`;

export const QUERY_MOVIE_DETAILS = gql`
	query getMovieDetails($id: Int!) {
		movieDetails(id: $id) {
			adult
			backdrop_path
			genres {
				id
				name
			}
			homepage
			id
			imdb_id
			original_language
			original_title
			overview
			popularity
			poster_path
			production_companies {
				id
				logo_path
				name
				origin_country
			}
			production_countries {
				iso_3166_1
				name
			}
			release_date
			revenue
			runtime
			spoken_languages {
				english_name
				iso_639_1
				name
			}
			status
			tagline
			title
			video
			vote_average
			vote_count
		}
	}
`;

export const QUERY_POPULAR_ANIME_MOVIES = gql`
	query getPopularAnimeMovies {
		popularAnimeMovies {
			results {
				original_title
				title
				overview
			}
		}
	}
`;

export const QUERY_TRENDING_MOVIES = gql`
	query getTrendingMovies {
		trendingMovies {
			results {
				id
				genre_ids
				adult
				backdrop_path
				original_language
				overview
				popularity
				poster_path
				vote_average
				vote_count
				original_title
				release_date
				title
				video
			}
			page
			total_pages
			total_results
		}
		trendingShows {
			results {
				backdrop_path
				first_air_date
				genre_ids
				id
				name
				origin_country
				original_language
				original_name
				overview
				popularity
				poster_path
				vote_average
				vote_count
			}
			page
			total_pages
			total_results
		}
	}
`;

export const QUERY_TOP_RATED_MOVIES = gql`
	query getTopRatedMovies {
		topRatedMovies {
			page
			total_pages
			results {
				adult
				backdrop_path
				genre_ids
				id
				original_language
				original_title
				overview
				popularity
				poster_path
				release_date
				title
				video
				vote_average
				vote_count
			}
			total_results
		}
	}
`;

export const QUERY_RECOMMENDED_MOVIES = gql`
	query getRecommendedMovies($id: Int!) {
		recommendedMovies(id: $id) {
			results {
				original_title
			}
		}
	}
`;

export const QUERY_MOVIE_REVIEWS = gql`
	query getMovieReviews($id: Int!) {
		movieReviews(id: $id) {
			id
			page
			total_pages
			total_results
			results {
				author
				author_details {
					name
					username
					avatar_path
					rating
				}
				content
				created_at
				id
				updated_at
				url
			}
		}
	}
`;

export const QUERY_MOVIES_IN_THEATRES = gql`
	query getMoviesInTheatres {
		moviesInTheatres {
			dates {
				maximum
				minimum
			}
			page
			total_results
			total_pages
			results {
				adult
				backdrop_path
				genre_ids
				id
				original_language
				original_title
				overview
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

export const QUERY_POPULAR_MOVIES_BY_GENRE = gql`
	query getPopularMoviesByGenre($genre: String!, $mediaType: String!) {
		popularMoviesByGenre(genre: $genre, mediaType: $mediaType) {
			page
			total_pages

			total_results
			results {
				adult
				backdrop_path
				genre_ids
				id
				original_language
				original_title
				overview
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

export const QUERY_TOP_RATED_MOVIES_BY_GENRE = gql`
	query getTopRatedMoviesByGenre($genre: String!, $mediaType: String!) {
		topRatedMoviesByGenre(genre: $genre, mediaType: $mediaType) {
			results {
				id
				original_language
				original_title
				overview
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
