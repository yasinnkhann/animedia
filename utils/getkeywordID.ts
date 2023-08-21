import { BASE_URL } from './constants';

export const getKeywordId = async (q: string) => {
	q = q.split(' ').join('+');

	const res = await fetch(
		`${BASE_URL}/search/keyword?api_key=${process.env.API_KEY!}&query=${q}`
	);
	const data = await res.json();

	return data.results[0].id;
};
