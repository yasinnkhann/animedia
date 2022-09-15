import axios from 'axios';
import { BASE_URL } from './URLs';

// types might be unnecessary after implementing front end side of things
// type TMediaType = 'all' | 'movie' | 'tv' | 'person';
// type TTimeWindow = 'day' | 'week';

export const GET_TRENDING_MEDIA = async (
	mediaType: string,
	timeWindow: string,
	pageNum: number | null | undefined
) => {
	const { data } = await axios.get(
		`${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${process.env
			.API_KEY!}&language=en-US&page=${pageNum ?? 1}`
	);

	return data;
};
