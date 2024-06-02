import { graphql } from '../generated/code-gen/gql';

export const ADD_MOVIE = graphql(`
	mutation AddMovie($movieId: ID!, $movieName: String!, $watchStatus: WatchStatusTypes!) {
		addMovie(movieId: $movieId, movieName: $movieName, watchStatus: $watchStatus) {
			id
			name
			status
			rating
		}
	}
`);

export const ADD_SHOW = graphql(`
	mutation AddShow(
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

export const ADD_GAME = graphql(`
	mutation AddGame($gameId: ID!, $gameName: String!, $wishList: Boolean, $rating: Int) {
		addGame(gameId: $gameId, gameName: $gameName, wishList: $wishList, rating: $rating) {
			id
			name
			rating
			wishList
		}
	}
`);

export const UPDATE_MOVIE = graphql(`
	mutation UpdateMovie($movieId: ID!, $watchStatus: WatchStatusTypes!, $movieRating: Int) {
		updateMovie(movieId: $movieId, watchStatus: $watchStatus, movieRating: $movieRating) {
			id
			name
			status
			rating
		}
	}
`);

export const UPDATE_SHOW = graphql(`
	mutation UpdateShow(
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

export const UPDATE_GAME = graphql(`
	mutation UpdateGame($gameId: ID!, $wishList: Boolean, $rating: Int) {
		updateGame(gameId: $gameId, wishList: $wishList, rating: $rating) {
			id
			name
			rating
			wishList
		}
	}
`);

export const DELETE_MOVIE = graphql(`
	mutation DeleteMovie($movieId: ID!) {
		deleteMovie(movieId: $movieId) {
			id
			name
			status
			rating
		}
	}
`);

export const DELETE_SHOW = graphql(`
	mutation DeleteShow($showId: ID!) {
		deleteShow(showId: $showId) {
			id
			name
			status
			rating
			current_episode
		}
	}
`);

export const DELETE_GAME = graphql(`
	mutation DeleteGame($gameId: ID!) {
		deleteGame(gameId: $gameId) {
			id
			name
			rating
			wishList
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

export const SEND_VERIFICATION_EMAIL = graphql(`
	mutation SendVerificationEmail($userId: ID!) {
		sendVerificationEmail(userId: $userId) {
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

export const SEND_FORGOT_PASSWORD_EMAIL = graphql(`
	mutation SendForgotPasswordEmail($email: String!) {
		sendForgotPasswordEmail(email: $email) {
			errors {
				message
			}
			token
			userId
		}
	}
`);

export const CHANGE_PASSWORD = graphql(`
	mutation ChangePassword($userId: ID!, $newPassword: String!) {
		changePassword(userId: $userId, newPassword: $newPassword) {
			errors {
				message
			}
			token
			userId
		}
	}
`);
