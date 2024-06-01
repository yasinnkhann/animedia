import { graphql } from '../generated/code-gen/gql';

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
	query PersonDetails($personDetailsId: ID!) {
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

export const GET_PERSONS_KNOWN_FOR_MOVIES = graphql(`
	query PersonsKnownForMovie($personsKnownForMovieResId: ID!) {
		personsKnownForMovie(
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
	query PersonsKnownForShow($personsKnownForShowResId: ID!) {
		personsKnownForShow(personsKnownForShowResId: $personsKnownForShowResId) {
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
