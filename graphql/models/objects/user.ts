import { list, nonNull, objectType } from 'nexus';

export const userMovie = objectType({
	name: 'UserMovie',
	definition(t) {
		t.id('id');
		t.string('name');
		t.field('status', {
			type: 'WatchStatusTypes',
		});
		t.int('rating');
	},
});

export const userShow = objectType({
	name: 'UserShow',
	definition(t) {
		t.id('id');
		t.string('name');
		t.field('status', {
			type: 'WatchStatusTypes',
		});
		t.int('rating');
		t.int('current_episode');
	},
});

export const userGame = objectType({
	name: 'UserGame',
	definition(t) {
		t.id('id');
		t.string('name');
		t.int('rating');
		t.boolean('wishList');
	},
});

export const user = objectType({
	name: 'User',
	definition(t) {
		t.id('id');
		t.string('name');
		t.string('email');
		t.date('emailVerified');
		t.string('image');
		t.string('password');
		t.date('created_at');
		t.list.field('movies', {
			type: 'UserMovie',
		});
		t.list.field('shows', {
			type: 'UserShow',
		});
	},
});

export const errorRes = objectType({
	name: 'ErrorRes',
	definition(t) {
		t.nonNull.string('message');
	},
});

export const registeredUserRes = objectType({
	name: 'RegisteredUserRes',
	definition(t) {
		t.nonNull.list.field('errors', {
			type: nonNull('ErrorRes'),
		});
		t.field('createdUser', {
			type: 'User',
		});
	},
});

export const redisRes = objectType({
	name: 'RedisRes',
	definition(t) {
		t.field('errors', {
			type: nonNull(list(nonNull('ErrorRes'))),
		});
		t.field('token', {
			type: 'String',
		});
		t.field('userId', {
			type: 'String',
		});
	},
});

export const accountVerifiedRes = objectType({
	name: 'AccountVerifiedRes',
	definition(t) {
		t.nonNull.field('errors', {
			type: nonNull(list(nonNull('ErrorRes'))),
		});
		t.field('id', {
			type: 'String',
		});
		t.field('emailVerified', {
			type: 'DateTime',
		});
	},
});
