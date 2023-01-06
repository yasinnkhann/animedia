import moment from 'moment';

export const formatDate = (dateStr: string) => {
	return momentd(dateStr).format('MMM Do, YYYY');
};
