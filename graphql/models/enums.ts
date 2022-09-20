import { enumType } from 'nexus';

export const timeWindowTypes = enumType({
	name: 'TimeWindowTypes',
	members: ['day', 'week'],
});
