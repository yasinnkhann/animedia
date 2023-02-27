import { ESearchType } from '@ts/enums';
import { CLIENT_BASE_URL } from '../utils/constants';

export const getDetailsPageRoute = (
	mediaType: ESearchType,
	id: number,
	title: string
) => {
	return `${CLIENT_BASE_URL}/${mediaType}/${id}-${title
		.toLowerCase()
		.replace(/[^a-z0-9\/☆ -]/gi, '')
		.replace(/[\/☆]/gi, ' ')
		.replace(/'  '/gi, ' ')
		.trim()
		.split(' ')
		.join('-')
		.replace(/-{2,}/gi, '-')}`;
};
