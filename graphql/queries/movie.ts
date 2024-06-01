import { graphql } from '../generated/code-gen/gql';

export const POPULAR_MOVIES = graphql(`
	query PopularMovies($page: Int) {
		popularMovies(page: $page) {
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
`);

export const SEARCHED_MOVIES = graphql(`
	query SearchedMovies($q: String!, $page: Int) {
		searchedMovies(q: $q, page: $page) {
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
`);

export const MOVIE_DETAILS = graphql(`
	query MovieDetails($movieDetailsId: ID!) {
		movieDetails(movieDetailsId: $movieDetailsId) {
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
`);

export const POPULAR_ANIME_MOVIES = graphql(`
	query PopularAnimeMovies($page: Int) {
		popularAnimeMovies(page: $page) {
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
`);

export const TRENDING_MOVIES = graphql(`
	query TrendingMovies($timeWindow: TimeWindowTypes!, $page: Int) {
		trendingMovies(timeWindow: $timeWindow, page: $page) {
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
`);

export const TOP_RATED_MOVIES = graphql(`
	query TopRatedMovies($page: Int) {
		topRatedMovies(page: $page) {
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
`);

export const RECOMMENDED_MOVIES = graphql(`
	query RecommendedMovies($recommendedMoviesId: ID!, $page: Int) {
		recommendedMovies(recommendedMoviesId: $recommendedMoviesId, page: $page) {
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
`);

export const MOVIE_REVIEWS = graphql(`
	query MovieReviews($movieReviewsId: ID!, $page: Int) {
		movieReviews(id: $movieReviewsId, page: $page) {
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
`);

export const MOVIES_IN_THEATRES = graphql(`
	query MoviesInTheatres($page: Int) {
		moviesInTheatres(page: $page) {
			dates {
				maximum
				minimum
			}
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
`);

export const POPULAR_MOVIES_BY_GENRE = graphql(`
	query PopularMoviesByGenre($page: Int, $genre: MovieGenreTypes!) {
		popularMoviesByGenre(page: $page, genre: $genre) {
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
`);

export const TOP_RATED_MOVIES_BY_GENRE = graphql(`
	query TopRatedMoviesByGenre($page: Int, $genre: MovieGenreTypes!) {
		topRatedMoviesByGenre(page: $page, genre: $genre) {
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
`);

export const GET_MOVIES_CAST_CREW = graphql(`
	query MoviesCastCrew($movieId: ID!) {
		moviesCastCrew(movieId: $movieId) {
			id
			cast {
				adult
				gender
				id
				known_for_department
				name
				original_name
				popularity
				profile_path
				cast_id
				character
				credit_id
				order
			}
			crew {
				adult
				gender
				id
				known_for_department
				name
				original_name
				popularity
				profile_path
				credit_id
				department
				job
			}
		}
	}
`);
