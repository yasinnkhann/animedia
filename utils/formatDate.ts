import moment from 'moment';

export const formatDate = (dateStr: string) => {
	console.log('hello world');

	return moment(dateStr).format('MMM Do, YYYY');
};
