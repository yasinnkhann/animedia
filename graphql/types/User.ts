import { objectType, extendType, stringArg, nonNull, idArg } from 'nexus';

export const userMovie = objectType({
	name: 'UserMovie',
	definition(t) {
		t.id('id');
		t.string('name');
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
			},
			resolve: (_parent, { movieId, movieName }, ctx) => {
				return ctx.prisma.user.update({
					where: { id: ctx.session!.user?.id },
					data: {
						movies: {
							// connect: {
							// 	id: movieId,
							// },
							create: {
								id: movieId,
								name: movieName,
							},
						},
					},
				});
			},
		});
	},
});
