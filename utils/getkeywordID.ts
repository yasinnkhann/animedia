import axios from 'axios';
import { BASE_URL } from '../utils/base_url';

export const GET_KEYWORD_ID = async (q: string) => {
	q = q.split(' ').join('+');

	const { data } = await axios.get(
		`${BASE_URL}/search/keyword?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${q}`
	);

	return data.results[0].id;
};
