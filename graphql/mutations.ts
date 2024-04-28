import { graphql } from './generated/code-gen/gql';

export const ADD_MOVIE = graphql(`
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
`);

export const UPDATE_MOVIE = graphql(`
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
`);

export const DELETE_MOVIE = graphql(`
	mutation DeletedMovie($movieId: ID!) {
		deleteMovie(movieId: $movieId) {
			id
			name
			status
			rating
		}
	}
`);

export const ADD_SHOW = graphql(`
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
`);

export const UPDATE_SHOW = graphql(`
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
`);

export const DELETE_SHOW = graphql(`
	mutation DeletedShow($showId: ID!) {
		deleteShow(showId: $showId) {
			id
			name
			status
			rating
			current_episode
		}
	}
`);

export const DELETE_EMAIL_VERIFICATION_TOKEN = graphql(`
	mutation DeleteEmailVerificationToken($token: String!) {
		deleteEmailVerificationToken(token: $token) {
			errors {
				message
			}
			token
			userId
		}
	}
`);

export const VERIFY_USER_EMAIL = graphql(`
	mutation VerifyUserEmail($userId: ID!) {
		verifyUserEmail(userId: $userId) {
			errors {
				message
			}
			userId
		}
	}
`);

export const WRITE_RETRY_EMAIL_VERIFICATION_LIMIT = graphql(`
	mutation Mutation($email: String!) {
		writeRetryEmailVerificationLimit(email: $email) {
			errors {
				message
			}
			token
			userId
		}
	}
`);

export const SEND_VERIFICATION_EMAIL = graphql(`
	mutation SendVerificationEmail($recipientEmail: String!) {
		sendVerificationEmail(recipientEmail: $recipientEmail) {
			errors {
				message
			}
			token
			userId
		}
	}
`);

export const REGISTER_USER = graphql(`
	mutation RegisterUser($name: String!, $email: String!, $password: String!) {
		registerUser(name: $name, email: $email, password: $password) {
			errors {
				message
			}
			createdUser {
				id
				name
				email
				password
				image
				created_at
				emailVerified
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
	}
`);
