import { ESearchType } from '../models/ts/enums';

export const getDetailsPageRoute = (
	mediaType: ESearchType,
	id: number,
	title: string
) => {
	return `${mediaType}/${id}-${title
		.toLowerCase()
		.replace(/[^a-z0-9\/☆ -]/gi, '')
		.replace(/[\/☆]/gi, ' ')
		.replace(/'  '/gi, ' ')
		.trim()
		.split(' ')
		.join('-')
		.replace(/-{2,}/gi, '-')}`;
};
