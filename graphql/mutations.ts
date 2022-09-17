import { gql } from '@apollo/client';

export const MUTATION_ADD_MOVIE = gql`
	mutation AddMovie($movieId: ID!, $movieName: String!) {
		addedMovie(movieId: $movieId, movieName: $movieName) {
			id
			name
		}
	}
`;
