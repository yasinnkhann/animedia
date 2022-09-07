import moment from 'moment';

export const formatDate = (dateStr: string) => {
	return moment(dateStr).format('MMMM Do, YYYY');
};
