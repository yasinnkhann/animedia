import { gql } from '@apollo/client';

export const MUTATION_ADD_MOVIE = gql`
	mutation AddedMovie(
		$movieId: ID!
		$movieName: String!
		$watchStatus: WatchStatusTypes!
	) {
		addedMovie(
			movieId: $movieId
			movieName: $movieName
			watchStatus: $watchStatus
		) {
			id
			name
			status
			rating
		}
	}
`;

export const MUTATION_UPDATE_MOVIE = gql`
	mutation UpdatedMovie(
		$movieId: ID!
		$watchStatus: WatchStatusTypes!
		$movieRating: Int
	) {
		updatedMovie(
			movieId: $movieId
			watchStatus: $watchStatus
			movieRating: $movieRating
		) {
			id
			name
			status
			rating
		}
	}
`;

export const MUTATION_DELETE_MOVIE = gql`
	mutation DeletedMovie($movieId: ID!) {
		deletedMovie(movieId: $movieId) {
			id
			name
			status
			rating
		}
	}
`;

export const MUTATION_ADD_SHOW = gql`
	mutation AddedShow(
		$showId: ID!
		$showName: String!
		$watchStatus: WatchStatusTypes!
	) {
		addedShow(showId: $showId, showName: $showName, watchStatus: $watchStatus) {
			id
			name
			status
			rating
			currentEpisode
		}
	}
`;

export const MUTATION_UPDATE_SHOW = gql`
	mutation UpdatedShow(
		$showId: ID!
		$watchStatus: WatchStatusTypes!
		$showRating: Int
		$currentEpisode: Int
	) {
		updatedShow(
			showId: $showId
			watchStatus: $watchStatus
			showRating: $showRating
			currentEpisode: $currentEpisode
		) {
			id
			name
			status
			rating
			currentEpisode
		}
	}
`;

export const MUTATION_DELETE_SHOW = gql`
	mutation DeletedShow($showId: ID!) {
		deletedShow(showId: $showId) {
			id
			name
			status
			rating
			currentEpisode
		}
	}
`;
