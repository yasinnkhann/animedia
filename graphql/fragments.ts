import { graphql } from './generated/code-gen/gql';

export const MOVIE_RESULT = graphql(`
	fragment MovieResult on MovieResult {
		adult
		backdrop_path
		genre_ids
		id
		original_language
		original_title
		overview
		popularity
		poster_path
		release_date
		title
		video
		vote_average
		vote_count
	}
`);

export const SHOW_RESULT = graphql(`
	fragment ShowResult on ShowResult {
		backdrop_path
		first_air_date
		genre_ids
		id
		name
		origin_country
		original_language
		original_name
		overview
		popularity
		poster_path
		vote_average
		vote_count
	}
`);
