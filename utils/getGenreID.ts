import { BASE_URL } from './URLs';
import axios from 'axios';
import 'dotenv/config';

export const GET_GENRE_ID = async (
	genreName: string,
	mediaType: string
): Promise<number> => {
	const {
		data: { genres },
	} = await axios.get(
		`${BASE_URL}/genre/${mediaType}/list?api_key=${process.env
			.API_KEY!}&language=en-US`
	);

	const genreObj = genres.find((genreObj: any) => genreObj.name === genreName);

	return genreObj.id;
};
