import { EContent } from '@ts/enums';
import { CLIENT_BASE_URL } from '../utils/constants';
import unidecode from 'unidecode';

export const getDetailsPageRoute = (
	mediaType: EContent,
	id: string,
	title: string
) => {
	const cleanTitle = unidecode(title)
		.replace(/[^a-z0-9\/☆ -]/gi, '')
		.replace(/\s+/g, '-')
		.replace(/-{2,}/g, '-')
		.trim();

	return `${CLIENT_BASE_URL}/${mediaType}/${id}-${cleanTitle}`;
};
