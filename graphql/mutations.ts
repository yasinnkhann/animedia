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
		}
	}
`;

export const MUTATION_UPDATE_MOVIE = gql`
	mutation UpdatedMovie($movieId: ID!, $watchStatus: WatchStatusTypes!) {
		updatedMovie(movieId: $movieId, watchStatus: $watchStatus) {
			id
			name
			status
		}
	}
`;

export const MUTATION_DELETE_MOVIE = gql`
	mutation DeletedMovie($movieId: ID!) {
		deletedMovie(movieId: $movieId) {
			id
			name
			status
		}
	}
`;
