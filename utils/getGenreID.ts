import { BASE_URL } from './URLs';
import axios from 'axios';
import {
	NexusGenObjects,
	NexusGenEnums,
} from '../graphql/generated/nexus-typegen/index';
// import 'dotenv/config';

// MIGHT USE GENERICS ON THE FRONTEND SIDE

/*
MOVIE
Action          28
Adventure       12
Animation       16
Comedy          35
Crime           80
Documentary     99
Drama           18
Family          10751
Fantasy         14
History         36
Horror          27
Music           10402
Mystery         9648
Romance         10749
Science Fiction 878
TV Movie        10770
Thriller        53
War             10752
Western         37
*/

/*
TV SHOW
Action & Adventure  10759
Animation           16
Comedy              35
Crime               80
Documentary         99
Drama               18
Family              10751
Kids                10762
Mystery             9648
News                10763
Reality             10764
Sci-Fi & Fantasy    10765
Soap                10766
Talk                10767
War & Politics      10768
Western             37
*/

type TGenreObj =
	| NexusGenObjects['MovieDetailsGenre']
	| NexusGenObjects['ShowDetailsGenre'];

export const GET_GENRE_ID = async (
	genreName: NexusGenEnums['MovieGenreTypes'] | NexusGenEnums['ShowGenreTypes'],
	mediaType: 'movie' | 'tv'
): Promise<number> => {
	const parsedGenreName = genreName
		.replace(/_/gi, ' ')
		.replace(/AMPERSAND/gi, '&')
		.replace(/DASH/gi, '-');

	const {
		data: { genres },
	} = await axios.get(
		`${BASE_URL}/genre/${mediaType}/list?api_key=${process.env
			.API_KEY!}&language=en-US`
	);

	const genreObj = (genres as TGenreObj[]).find(
		genreObj => genreObj.name === parsedGenreName
	);

	return genreObj!.id;
};
