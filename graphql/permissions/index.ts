import { shield } from 'graphql-shield';
import { isAuthenticated } from './rules/isAuthenticated';

export const permissions = shield({
	Query: {
		user: isAuthenticated,
		usersMovie: isAuthenticated,
		usersMovies: isAuthenticated,
		usersShow: isAuthenticated,
		usersShows: isAuthenticated,
	},
	Mutation: {
		'*': isAuthenticated,
	},
});
