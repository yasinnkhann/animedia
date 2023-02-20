import { graphql } from './generated/code-gen/gql';

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
	query getMovieDetails($movieDetailsId: Int!) {
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
	query RecommendedMovies($recommendedMoviesId: Int!, $page: Int) {
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

export const POPULAR_SHOWS = graphql(`
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
`);

export const SEARCHED_SHOWS = graphql(`
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
`);

export const SHOW_DETAILS = graphql(`
	query getShowDetails($showDetailsId: Int!) {
		showDetails(showDetailsId: $showDetailsId) {
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
`);

export const POPULAR_ANIME_SHOWS = graphql(`
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
`);

export const TRENDING_SHOWS = graphql(`
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
`);

export const TOP_RATED_SHOWS = graphql(`
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
`);

export const RECOMMENDED_SHOWS = graphql(`
	query RecommendedShows($recommendedShowsId: Int!, $page: Int) {
		recommendedShows(recommendedShowsId: $recommendedShowsId, page: $page) {
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
`);

export const SHOW_REVIEWS = graphql(`
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
`);

export const POPULAR_SHOWS_BY_GENRE = graphql(`
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
`);

export const TOP_RATED_SHOWS_BY_GENRE = graphql(`
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
`);

export const POPULAR_PEOPLE = graphql(`
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
`);

export const PERSON_DETAILS = graphql(`
	query PersonDetails($personDetailsId: Int!) {
		personDetails(personDetailsId: $personDetailsId) {
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
`);

export const SEARCHED_PEOPLE = graphql(`
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
`);

export const GET_USER = graphql(`
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
`);

export const GET_USERS_MOVIE = graphql(`
	query UsersMovie($movieId: String!) {
		usersMovie(movieId: $movieId) {
			id
			name
			status
			rating
		}
	}
`);

export const GET_USERS_MOVIES = graphql(`
	query UsersMovies {
		usersMovies {
			id
			name
			status
			rating
		}
	}
`);

export const GET_USERS_SHOW = graphql(`
	query UsersShow($showId: String!) {
		usersShow(showId: $showId) {
			id
			name
			status
			rating
			current_episode
		}
	}
`);

export const GET_USERS_SHOWS = graphql(`
	query UsersShows {
		usersShows {
			id
			name
			status
			rating
			current_episode
		}
	}
`);

export const GET_PERSONS_KNOWN_FOR_MOVIES = graphql(`
	query PersonsKnownForMovieRes($personsKnownForMovieResId: Int!) {
		personsKnownForMovieRes(
			personsKnownForMovieResId: $personsKnownForMovieResId
		) {
			id
			cast {
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
				character
				credit_id
				order
			}
			crew {
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
				credit_id
				department
				job
			}
		}
	}
`);

export const GET_PERSONS_KNOWN_FOR_SHOWS = graphql(`
	query PersonsKnownForShowRes($personsKnownForShowResId: Int!) {
		personsKnownForShowRes(
			personsKnownForShowResId: $personsKnownForShowResId
		) {
			id
			cast {
				adult
				backdrop_path
				genre_ids
				id
				origin_country
				original_language
				original_name
				overview
				popularity
				poster_path
				first_air_date
				name
				vote_average
				vote_count
				character
				credit_id
				episode_count
			}
			crew {
				adult
				backdrop_path
				genre_ids
				id
				origin_country
				original_language
				original_name
				overview
				popularity
				poster_path
				first_air_date
				name
				vote_average
				vote_count
				credit_id
				department
				episode_count
				job
			}
		}
	}
`);

export const GET_SHOWS_CAST_CREW = graphql(`
	query ShowsCastCrew($showId: Int!) {
		showsCastCrew(showId: $showId) {
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

export const GET_MOVIES_CAST_CREW = graphql(`
	query MoviesCastCrew($movieId: Int!) {
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

export const GET_EPISODE_DETAILS = graphql(`
	query EpisodeDetails($showId: Int!, $seasonNum: Int!, $episodeNum: Int!) {
		episodeDetails(
			showId: $showId
			seasonNum: $seasonNum
			episodeNum: $episodeNum
		) {
			air_date
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
			episode_number
			guest_stars {
				adult
				gender
				id
				known_for_department
				name
				original_name
				popularity
				profile_path
				character
				credit_id
				order
			}
			name
			overview
			id
			production_code
			runtime
			season_number
			still_path
			vote_average
			vote_count
		}
	}
`);

export const CHECK_EMAIL_VERIFICATION_TOKEN = graphql(`
	query CheckEmailVerificationToken($token: String!) {
		checkEmailVerificationToken(token: $token) {
			error
			successMsg
			token
			userId
		}
	}
`);

export const ACCOUNT_VERIFIED = graphql(`
	query AccountVerified($email: String!) {
		accountVerified(email: $email) {
			error
			id
			emailVerified
		}
	}
`);

export const EMAIL_FROM_REDIS_TOKEN = graphql(`
	query EmailFromRedisToken($token: String!) {
		emailFromRedisToken(token: $token)
	}
`);

export const CHECK_RETRY_EMAIL_VERIFICATION_LIMIT = graphql(`
	query CheckRetryEmailVerificationLimit($email: String!) {
		checkRetryEmailVerificationLimit(email: $email) {
			error
			successMsg
			token
			userId
		}
	}
`);
