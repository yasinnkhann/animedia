import { BASE_URL } from './URLs';

export const GET_TRENDING_MEDIA = async (
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
