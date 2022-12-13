import { BASE_URL } from './URLs';

export const GET_KEYWORD_ID = async (q: string) => {
	q = q.split(' ').join('+');

	const res = await fetch(
		`${BASE_URL}/search/keyword?api_key=${process.env.API_KEY!}&query=${q}`
	);
	const data = await res.json();

	return data.results[0].id;
};
