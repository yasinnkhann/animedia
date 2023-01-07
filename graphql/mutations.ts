import { gql } from '@apollo/client';

export const MUTATION_ADD_MOVIE = gql`
	mutation AddedMovie(
		$movieId: ID!
		$movieName: String!
		$watchStatus: WatchStatusTypes!
	) {
		addMovie(
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
		updateMovie(
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
		deleteMovie(movieId: $movieId) {
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
		$currentEpisode: Int
	) {
		addShow(
			showId: $showId
			showName: $showName
			watchStatus: $watchStatus
			currentEpisode: $currentEpisode
		) {
			id
			name
			status
			rating
			current_episode
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
		updateShow(
			showId: $showId
			watchStatus: $watchStatus
			showRating: $showRating
			currentEpisode: $currentEpisode
		) {
			id
			name
			status
			rating
			current_episode
		}
	}
`;

export const MUTATION_DELETE_SHOW = gql`
	mutation DeletedShow($showId: ID!) {
		deleteShow(showId: $showId) {
			id
			name
			status
			rating
			current_episode
		}
	}
`;

export const MUTATION_WRITE_EMAIL_VERIFICATION_TOKEN = gql`
	mutation WriteEmailVerificationToken($email: String!) {
		writeEmailVerificationToken(email: $email) {
			error
			successMsg
			token
			userId
		}
	}
`;

export const MUTATION_DELETE_EMAIL_VERIFICATION_TOKEN = gql`
	mutation DeleteEmailVerificationToken($token: String!) {
		deleteEmailVerificationToken(token: $token) {
			error
			successMsg
			token
			userId
		}
	}
`;

export const MUTATION_VERIFY_USER_EMAIL = gql`
	mutation VerifyUserEmail($userId: ID!) {
		verifyUserEmail(userId: $userId)
	}
`;

export const MUTATION_WRITE_RETRY_EMAIL_VERIFICATION_LIMIT = gql`
	mutation Mutation($email: String!) {
		writeRetryEmailVerificationLimit(email: $email) {
			error
			successMsg
			token
			userId
		}
	}
`;

export const MUTATION_SEND_VERIFICATION_EMAIL = gql`
	mutation SendVerificationEmail(
		$recipientEmail: String!
		$subject: String!
		$text: String!
		$html: String!
	) {
		sendVerificationEmail(
			recipientEmail: $recipientEmail
			subject: $subject
			text: $text
			html: $html
		) {
			error
			successMsg
			ok
			statusCode
		}
	}
`;
