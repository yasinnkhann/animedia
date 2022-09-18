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
