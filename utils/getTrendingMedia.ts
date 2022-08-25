import axios from 'axios';
import { BASE_URL } from './URLs';

type TMediaType = 'all' | 'movie' | 'tv' | 'person';
type TTimeWindow = 'day' | 'week';

export const GET_TRENDING_MEDIA = async (
	mediaType: TMediaType,
	timeWindow: TTimeWindow
) => {
	const { data } = await axios.get(
		`${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
	);

	return data;
};
