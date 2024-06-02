import { graphql } from '../generated/code-gen/gql';

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
	query ShowDetails($showDetailsId: ID!) {
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
	query RecommendedShows($recommendedShowsId: ID!, $page: Int) {
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
	query ShowReviews($showReviewsId: ID!, $page: Int) {
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

export const GET_SHOWS_CAST_CREW = graphql(`
	query ShowsCastCrew($showId: ID!) {
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

export const GET_EPISODE_DETAILS = graphql(`
	query EpisodeDetails($showId: ID!, $seasonNum: Int!, $episodeNum: Int!) {
		episodeDetails(showId: $showId, seasonNum: $seasonNum, episodeNum: $episodeNum) {
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
