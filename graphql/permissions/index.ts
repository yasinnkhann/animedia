import { shield } from 'graphql-shield';
import { isAuthenticated } from './rules/isAuthenticated';

export const permissions = shield({
  Query: {
    user: isAuthenticated,
    users: isAuthenticated,
    usersMovie: isAuthenticated,
    usersMovies: isAuthenticated,
    usersShow: isAuthenticated,
    usersShows: isAuthenticated,
    usersGame: isAuthenticated,
    usersGames: isAuthenticated,
  },
  Mutation: {
    addMovie: isAuthenticated,
    addShow: isAuthenticated,
    addGame: isAuthenticated,
    deleteMovie: isAuthenticated,
    deleteShow: isAuthenticated,
    deleteGame: isAuthenticated,
    updateMovie: isAuthenticated,
    updateShow: isAuthenticated,
    updateGame: isAuthenticated,
    changePassword: isAuthenticated,
  },
});
