import {
	objectType,
	extendType,
	stringArg,
	nonNull,
	idArg,
	enumType,
} from 'nexus';

export const watchStatusTypes = enumType({
	name: 'WatchStatusTypes',
	members: [
		'NOT_WATCHING',
		'WATCHING',
		'PLAN_TO_WATCH',
		'COMPLETED',
		'ON_HOLD',
		'DROPPED',
	],
});

export const userMovie = objectType({
	name: 'UserMovie',
	definition(t) {
		t.id('id');
		t.string('name');
		t.field('status', {
			type: 'WatchStatusTypes',
		});
	},
});

export const user = objectType({
	name: 'User',
	definition(t) {
		t.id('id');
		t.string('name');
		t.string('email');
		t.string('image');
		t.list.field('movies', {
			type: 'UserMovie',
		});
	},
});

export const getUser = extendType({
	type: 'Query',
	definition(t) {
		t.field('user', {
			type: 'User',

			resolve: (_parent, _args, ctx) => {
				return ctx.prisma.user.findUnique({
					where: { id: ctx.session!.user?.id },
					include: {
						movies: true,
						// shows: true,
					},
				});
			},
		});
	},
});

export const addedMovie = extendType({
	type: 'Mutation',
	definition(t) {
		t.field('addedMovie', {
			type: 'UserMovie',
			args: {
				movieId: nonNull(idArg()),
				movieName: nonNull(stringArg()),
				watchStatus: nonNull(watchStatusTypes),
			},
			resolve: (_parent, { movieId, movieName, watchStatus }, ctx) => {
				return ctx.prisma.user.update({
					where: { id: ctx.session!.user?.id },
					data: {
						movies: {
							create: {
								id: movieId,
								name: movieName,
								status: watchStatus,
							},
						},
					},
				});
			},
		});
	},
});

export const usersMovies = extendType({
	type: 'Query',
	definition(t) {
		t.list.field('usersMovies', {
			type: 'UserMovie',
			resolve: (_parent, _args, ctx) => {
				return ctx.prisma.movie.findMany({
					where: {
						userId: ctx.session!.user?.id,
					},
				});
			},
		});
	},
});

// export const usersMovie = extendType({
// 	type: 'Query',
// 	definition(t) {
// 		t.field('usersMovie', {
// 			type: 'UserMovie',
// 			resolve: (_parent, _args, ctx) => {
// 				return ctx.prisma.movie.findUnique({
// 					where: {
// 						userId: ctx.session!.user?.id,
// 					},
// 				});
// 			},
// 		});
// 	},
// });
