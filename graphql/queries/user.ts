import { graphql } from '../generated/code-gen/gql';

export const GET_USER = graphql(`
	query User($userId: ID!) {
		user(id: $userId) {
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

export const CHECK_EMAIL_VERIFICATION_TOKEN = graphql(`
	query CheckEmailVerificationToken($token: String!, $userId: ID!) {
		checkEmailVerificationToken(token: $token, userId: $userId) {
			errors {
				message
			}
			token
			userId
		}
	}
`);

export const CHECK_FORGOT_PASSWORD_TOKEN = graphql(`
	query CheckForgotPasswordToken($token: String!, $userId: ID!) {
		checkForgotPasswordToken(token: $token, userId: $userId) {
			errors {
				message
			}
			token
			userId
		}
	}
`);

export const ACCOUNT_VERIFIED = graphql(`
	query AccountVerified($email: String!) {
		accountVerified(email: $email) {
			errors {
				message
			}
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

export const GET_USERS_GAMES = graphql(`
	query UsersGames {
		usersGames {
			id
			name
			rating
		}
	}
`);
