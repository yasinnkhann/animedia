import { gql } from '@apollo/client';

// MOVIE
export const QUERY_POPULAR_MOVIES = gql`
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
`;

export const QUERY_SEARCHED_MOVIES = gql`
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
`;

export const QUERY_MOVIE_DETAILS = gql`
	query getMovieDetails($movieDetailsId: Int!) {
		movieDetails(id: $movieDetailsId) {
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
`;

export const QUERY_TRENDING_MOVIES = gql`
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
`;

export const QUERY_TOP_RATED_MOVIES = gql`
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
`;

export const QUERY_RECOMMENDED_MOVIES = gql`
	query RecommendedMovies($recommendedMoviesId: Int!, $page: Int) {
		recommendedMovies(id: $recommendedMoviesId, page: $page) {
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

export const QUERY_MOVIE_REVIEWS = gql`
	query MovieReviews($movieReviewsId: Int!, $page: Int) {
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
`;

export const QUERY_MOVIES_IN_THEATRES = gql`
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
`;

export const QUERY_POPULAR_MOVIES_BY_GENRE = gql`
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
`;

export const QUERY_TOP_RATED_MOVIES_BY_GENRE = gql`
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
`;

// SHOW
export const QUERY_POPULAR_SHOWS = gql`
	query PopularShows($page: Int) {
		popularShows(page: $page) {
			page
			total_pages
			total_results
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
		}
	}
`;

export const QUERY_SEARCHED_SHOWS = gql`
	query SearchedShows($q: String!, $page: Int) {
		searchedShows(q: $q, page: $page) {
			page
			total_pages
			total_results
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
		}
	}
`;

export const QUERY_SHOW_DETAILS = gql`
	query getShowDetails($showDetailsId: Int!) {
		showDetails(id: $showDetailsId) {
			adult
			backdrop_path
			created_by {
				id
				credit_id
				name
				gender
				profile_path
			}
			episode_run_time
			first_air_date
			genres {
				id
				name
			}
			homepage
			id
			in_production
			languages
			last_air_date
			last_episode_to_air {
				air_date
				episode_number
				id
				name
				overview
				production_code
				runtime
				season_number
				show_id
				still_path
				vote_average
				vote_count
			}
			name
			networks {
				id
				name
				logo_path
				origin_country
			}
			number_of_episodes
			number_of_seasons
			origin_country
			original_language
			original_name
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
			seasons {
				air_date
				episode_count
				id
				name
				overview
				poster_path
				season_number
			}
			spoken_languages {
				english_name
				iso_639_1
				name
			}
			status
			tagline
			type
			vote_average
			vote_count
			next_episode_to_air {
				air_date
				episode_number
				id
				name
				overview
				production_code
				runtime
				season_number
				show_id
				still_path
				vote_average
				vote_count
			}
		}
	}
`;

export const QUERY_POPULAR_ANIME_SHOWS = gql`
	query PopularAnimeShows($page: Int) {
		popularAnimeShows(page: $page) {
			page
			total_pages
			total_results
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
		}
	}
`;

export const QUERY_TRENDING_SHOWS = gql`
	query TrendingShows($timeWindow: TimeWindowTypes!, $page: Int) {
		trendingShows(timeWindow: $timeWindow, page: $page) {
			page
			total_pages
			total_results
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
		}
	}
`;

export const QUERY_TOP_RATED_SHOWS = gql`
	query TopRatedShows($page: Int) {
		topRatedShows(page: $page) {
			page
			total_pages
			total_results
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
		}
	}
`;

export const QUERY_RECOMMENDED_SHOWS = gql`
	query RecommendedShows($recommendedShowsId: Int!, $page: Int) {
		recommendedShows(id: $recommendedShowsId, page: $page) {
			page
			total_pages
			total_results
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
		}
	}
`;

export const QUERY_SHOW_REVIEWS = gql`
	query ShowReviews($showReviewsId: Int!, $page: Int) {
		showReviews(id: $showReviewsId, page: $page) {
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

export const QUERY_POPULAR_SHOWS_BY_GENRE = gql`
	query PopularShowsByGenre($page: Int, $genre: ShowGenreTypes!) {
		popularShowsByGenre(page: $page, genre: $genre) {
			page
			total_pages
			total_results
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
		}
	}
`;

export const QUERY_TOP_RATED_SHOWS_BY_GENRE = gql`
	query TopRatedShowsByGenre($genre: ShowGenreTypes!, $page: Int) {
		topRatedShowsByGenre(genre: $genre, page: $page) {
			page
			total_pages
			total_results
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
		}
	}
`;

// PERSON
export const QUERY_POPULAR_PEOPLE = gql`
	query PopularPeople($page: Int) {
		popularPeople(page: $page) {
			page
			total_pages
			total_results
			results {
				adult
				gender
				id
				known_for {
					adult
					backdrop_path
					genre_ids
					id
					media_type
					original_language
					original_title
					overview
					poster_path
					release_date
					title
					video
					vote_average
					vote_count
				}
				known_for_department
				name
				popularity
				profile_path
			}
		}
	}
`;

export const QUERY_PERSON_DETAILS = gql`
	query getPersonDetails($personDetailsId: Int!) {
		personDetails(id: $personDetailsId) {
			adult
			also_known_as
			biography
			birthday
			deathday
			gender
			homepage
			id
			imdb_id
			known_for_department
			name
			place_of_birth
			popularity
			profile_path
		}
	}
`;

export const QUERY_SEARCHED_PEOPLE = gql`
	query SearchedPeople($q: String!, $page: Int) {
		searchedPeople(q: $q, page: $page) {
			page
			total_pages
			total_results
			results {
				adult
				gender
				id
				known_for {
					adult
					backdrop_path
					genre_ids
					id
					media_type
					original_language
					original_title
					overview
					poster_path
					release_date
					title
					video
					vote_average
					vote_count
				}
				known_for_department
				name
				popularity
				profile_path
			}
		}
	}
`;

// USER
export const QUERY_GET_USER = gql`
	query User {
		user {
			id
			name
			email
			image
			movies {
				id
				name
				status
				rating
			}
			shows {
				id
				name
				status
				rating
				current_episode
			}
		}
	}
`;

export const QUERY_GET_USERS_MOVIE = gql`
	query UsersMovie($movieId: String!) {
		usersMovie(movieId: $movieId) {
			id
			name
			status
			rating
		}
	}
`;

export const QUERY_GET_USERS_MOVIES = gql`
	query UsersMovies($userId: String!) {
		usersMovies(userId: $userId) {
			id
			name
			status
			rating
		}
	}
`;

export const QUERY_GET_USERS_SHOW = gql`
	query UsersShow($showId: String!) {
		usersShow(showId: $showId) {
			id
			name
			status
			rating
			current_episode
		}
	}
`;

export const QUERY_GET_USERS_SHOWS = gql`
	query UsersShows($userId: String!) {
		usersShows(userId: $userId) {
			id
			name
			status
			rating
			current_episode
		}
	}
`;
