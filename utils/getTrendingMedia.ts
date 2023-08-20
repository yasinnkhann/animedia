import { BASE_URL } from './constants';

export const getTrendingMedia = async (
	mediaType: 'all' | 'movie' | 'tv' | 'person',
	timeWindow: 'day' | 'week',
	pageNum: number | null | undefined
) => {
	const res = await fetch(
		`${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${process.env
			.API_KEY!}&language=en-US&page=${pageNum ?? 1}`
	);

	const data = await res.json();

	return data;
};
