import { graphql } from '../generated/code-gen/gql';

export const SEARCHED_GAMES = graphql(`
	query SearchedGames($q: String!, $limit: Int!, $page: Int!) {
		searchedGames(q: $q, limit: $limit, page: $page) {
			total_results
			results {
				id
				age_ratings
				alternative_names
				artworks
				bundles
				category
				checksum
				collection
				collections
				cover
				coverUrl
				created_at
				dlcs
				expanded_games
				expansions
				external_games
				first_release_date
				forks
				franchise
				franchises
				game_engines
				game_localizations
				game_modes
				genres
				hypes
				involved_companies
				keywords
				language_supports
				multiplayer_modes
				name
				parent_game
				platforms
				player_perspectives
				ports
				rating
				rating_count
				release_dates
				remakes
				remasters
				screenshots
				similar_games
				slug
				standalone_expansions
				status
				storyline
				summary
				tags
				themes
				total_rating
				total_rating_count
				updated_at
				url
				version_parent
				version_title
				videos
				websites
			}
		}
	}
`);

export const GAME_DETAILS = graphql(`
	query GameDetails($gameId: ID!) {
		gameDetails(gameId: $gameId) {
			total_results
			results {
				id
				age_ratings
				alternative_names
				artworks
				bundles
				category
				checksum
				collection
				collections
				cover
				coverUrl
				created_at
				dlcs
				expanded_games
				expansions
				external_games
				first_release_date
				forks
				franchise
				franchises
				game_engines
				game_localizations
				game_modes
				genres
				hypes
				involved_companies
				keywords
				language_supports
				multiplayer_modes
				name
				parent_game
				platforms
				player_perspectives
				ports
				rating
				rating_count
				release_dates
				remakes
				remasters
				screenshots
				similar_games
				slug
				standalone_expansions
				status
				storyline
				summary
				tags
				themes
				total_rating
				total_rating_count
				updated_at
				url
				version_parent
				version_title
				videos
				websites
			}
		}
	}
`);

export const GAME_GENRES = graphql(`
	query GameGenres {
		gameGenres {
			id
			name
		}
	}
`);

export const GAME_PLATFORMS = graphql(`
	query GamePlatforms {
		gamePlatforms {
			id
			name
		}
	}
`);
export const GAME_COMPANY = graphql(`
	query GameCompany($gameId: ID!) {
		gameCompany(gameId: $gameId) {
			id
			country
			description
			developed
			logo
			name
			published
		}
	}
`);

export const GAME_COLLECTIONS = graphql(`
	query Games($gameId: ID!) {
		gameCollections(gameId: $gameId) {
			id
			name
			games {
				id
				name
				first_release_date
				rating
				cover
				coverUrl
			}
		}
	}
`);

export const GAME_THEMES = graphql(`
	query GameThemes {
		gameThemes {
			id
			name
		}
	}
`);

export const SIMILAR_GAMES = graphql(`
	query SimilarGames($gameIds: [ID!]!, $limit: Int) {
		similarGames(gameIds: $gameIds, limit: $limit) {
			id
			name
			first_release_date
			rating
			cover
			coverUrl
		}
	}
`);

export const DLC_GAMES = graphql(`
	query DlcGames($gameIds: [ID!]!, $limit: Int) {
		dlcGames(gameIds: $gameIds, limit: $limit) {
			id
			name
			first_release_date
			rating
			cover
			coverUrl
		}
	}
`);

export const GAME_PREVIEWS = graphql(`
	query GamePreviews($gameId: ID!) {
		gamePreviews(gameId: $gameId) {
			id
			game
			name
			url
			video_id
		}
	}
`);

export const POPULAR_GAMES = graphql(`
	query PopularGames($page: Int!, $limit: Int!) {
		popularGames(page: $page, limit: $limit) {
			total_results
			results {
				id
				age_ratings
				alternative_names
				artworks
				bundles
				category
				checksum
				collection
				collections
				cover
				coverUrl
				created_at
				dlcs
				expanded_games
				expansions
				external_games
				first_release_date
				forks
				franchise
				franchises
				game_engines
				game_localizations
				game_modes
				genres
				hypes
				involved_companies
				keywords
				language_supports
				multiplayer_modes
				name
				parent_game
				platforms
				player_perspectives
				ports
				rating
				rating_count
				release_dates
				remakes
				remasters
				screenshots
				similar_games
				slug
				standalone_expansions
				status
				storyline
				summary
				tags
				themes
				total_rating
				total_rating_count
				updated_at
				url
				version_parent
				version_title
				videos
				websites
			}
		}
	}
`);

export const TOP_RATED_GAMES = graphql(`
	query TopRatedGames($page: Int!, $limit: Int!) {
		topRatedGames(page: $page, limit: $limit) {
			total_results
			results {
				id
				age_ratings
				alternative_names
				artworks
				bundles
				category
				checksum
				collection
				collections
				cover
				coverUrl
				created_at
				dlcs
				expanded_games
				expansions
				external_games
				first_release_date
				forks
				franchise
				franchises
				game_engines
				game_localizations
				game_modes
				genres
				hypes
				involved_companies
				keywords
				language_supports
				multiplayer_modes
				name
				parent_game
				platforms
				player_perspectives
				ports
				rating
				rating_count
				release_dates
				remakes
				remasters
				screenshots
				similar_games
				slug
				standalone_expansions
				status
				storyline
				summary
				tags
				themes
				total_rating
				total_rating_count
				updated_at
				url
				version_parent
				version_title
				videos
				websites
			}
		}
	}
`);

export const POPULAR_GAMES_BY_GENRE = graphql(`
	query PopularGamesByGenre($genreId: ID!, $limit: Int!, $page: Int!) {
		popularGamesByGenre(genreId: $genreId, limit: $limit, page: $page) {
			total_results
			results {
				id
				age_ratings
				alternative_names
				artworks
				bundles
				category
				checksum
				collection
				collections
				cover
				coverUrl
				created_at
				dlcs
				expanded_games
				expansions
				external_games
				first_release_date
				forks
				franchise
				franchises
				game_engines
				game_localizations
				game_modes
				genres
				hypes
				involved_companies
				keywords
				language_supports
				multiplayer_modes
				name
				parent_game
				platforms
				player_perspectives
				ports
				rating
				rating_count
				release_dates
				remakes
				remasters
				screenshots
				similar_games
				slug
				standalone_expansions
				status
				storyline
				summary
				tags
				themes
				total_rating
				total_rating_count
				updated_at
				url
				version_parent
				version_title
				videos
				websites
			}
		}
	}
`);

export const TOP_RATED_GAMES_BY_GENRE = graphql(`
	query TopRatedGamesByGenre($genreId: ID!, $limit: Int!, $page: Int!) {
		topRatedGamesByGenre(genreId: $genreId, limit: $limit, page: $page) {
			total_results
			results {
				id
				age_ratings
				alternative_names
				artworks
				bundles
				category
				checksum
				collection
				collections
				cover
				coverUrl
				created_at
				dlcs
				expanded_games
				expansions
				external_games
				first_release_date
				forks
				franchise
				franchises
				game_engines
				game_localizations
				game_modes
				genres
				hypes
				involved_companies
				keywords
				language_supports
				multiplayer_modes
				name
				parent_game
				platforms
				player_perspectives
				ports
				rating
				rating_count
				release_dates
				remakes
				remasters
				screenshots
				similar_games
				slug
				standalone_expansions
				status
				storyline
				summary
				tags
				themes
				total_rating
				total_rating_count
				updated_at
				url
				version_parent
				version_title
				videos
				websites
			}
		}
	}
`);

export const GAME_CHARACTERS = graphql(`
	query GameCharacters($gameId: ID!, $limit: Int) {
		gameCharacters(gameId: $gameId, limit: $limit) {
			id
			country_name
			description
			games
			gender
			mug_shot
			mugShotUrl
			name
			species
		}
	}
`);

export const SEARCH_GAME_CHARACTERS = graphql(`
	query SearchGameCharacters($name: String!, $limit: Int) {
		searchGameCharacters(name: $name, limit: $limit) {
			total_results
			results {
				id
				country_name
				description
				games
				gender
				mug_shot
				mugShotUrl
				name
				species
			}
		}
	}
`);
