import imageNotFound from '../assets/image-not-found.jpeg';
import { BASE_IMG_URL } from './constants';

export const getImage = (imagePath: string | null | undefined) => {
	if (imagePath) {
		return BASE_IMG_URL + imagePath;
	} else {
		return imageNotFound;
	}
};
