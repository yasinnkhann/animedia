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
  mutation AddGame($gameId: ID!, $gameName: String!, $wishlist: Boolean, $rating: Int) {
    addGame(gameId: $gameId, gameName: $gameName, wishlist: $wishlist, rating: $rating) {
      id
      name
      rating
      wishlist
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
  mutation UpdateGame($gameId: ID!, $wishlist: Boolean, $rating: Int) {
    updateGame(gameId: $gameId, wishlist: $wishlist, rating: $rating) {
      id
      name
      rating
      wishlist
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
      wishlist
    }
  }
`);
