import {
	objectType,
	extendType,
	stringArg,
	nonNull,
	idArg,
	intArg,
	enumType,
} from 'nexus';
import { v4 } from 'uuid';
import { EMAIL_VERIFICATION_PREFIX } from 'utils/specificVals';

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
		t.list.field('shows', {
			type: 'UserShow',
		});
	},
});

export const getUser = extendType({
	type: 'Query',
	definition(t) {
		t.field('user', {
			type: 'User',
			resolve: async (_parent, _args, ctx) => {
				return await ctx.prisma.user.findUnique({
					where: { id: ctx.session!.user?.id! },
					include: {
						movies: true,
						shows: true,
					},
				});
			},
		});
	},
});

export const usersMovie = extendType({
	type: 'Query',
	definition(t) {
		t.field('usersMovie', {
			type: 'UserMovie',
			args: {
				movieId: nonNull(stringArg()),
			},
			resolve: async (_parent, { movieId }, ctx) => {
				return await ctx.prisma.movie.findUnique({
					where: {
						id_userId: {
							id: movieId,
							userId: ctx.session!.user?.id!,
						},
					},
				});
			},
		});
	},
});

export const usersShow = extendType({
	type: 'Query',
	definition(t) {
		t.field('usersShow', {
			type: 'UserShow',
			args: {
				showId: nonNull(stringArg()),
			},
			resolve: async (_parent, { showId }, ctx) => {
				return await ctx.prisma.show.findUnique({
					where: {
						id_userId: {
							id: showId,
							userId: ctx.session!.user?.id!,
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
			resolve: async (_parent, _args, ctx) => {
				return await ctx.prisma.movie.findMany({
					where: {
						userId: ctx.session?.user?.id!,
					},
					orderBy: [
						{
							name: 'asc',
						},
					],
				});
			},
		});
	},
});

export const usersShows = extendType({
	type: 'Query',
	definition(t) {
		t.list.field('usersShows', {
			type: 'UserShow',
			resolve: async (_parent, _args, ctx) => {
				return await ctx.prisma.show.findMany({
					where: {
						userId: ctx.session?.user?.id,
					},
					orderBy: [
						{
							name: 'asc',
						},
					],
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
			resolve: async (_parent, { movieId, movieName, watchStatus }, ctx) => {
				return await ctx.prisma.user.update({
					where: { id: ctx.session!.user?.id! },
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

export const addedShow = extendType({
	type: 'Mutation',
	definition(t) {
		t.field('addedShow', {
			type: 'UserShow',
			args: {
				showId: nonNull(idArg()),
				showName: nonNull(stringArg()),
				watchStatus: nonNull(watchStatusTypes),
				currentEpisode: intArg(),
			},
			resolve: async (
				_parent,
				{ showId, showName, watchStatus, currentEpisode },
				ctx
			) => {
				return await ctx.prisma.user.update({
					where: { id: ctx.session!.user?.id! },
					data: {
						shows: {
							create: {
								id: showId,
								name: showName,
								status: watchStatus,
								current_episode: currentEpisode ?? undefined,
							},
						},
					},
				});
			},
		});
	},
});

export const updateMovie = extendType({
	type: 'Mutation',
	definition(t) {
		t.field('updatedMovie', {
			type: 'UserMovie',
			args: {
				movieId: nonNull(idArg()),
				watchStatus: nonNull(watchStatusTypes),
				movieRating: intArg(),
			},
			resolve: async (_parent, { movieId, watchStatus, movieRating }, ctx) => {
				return await ctx.prisma.movie.update({
					where: {
						id_userId: {
							id: movieId,
							userId: ctx.session!.user?.id!,
						},
					},
					data: {
						status: watchStatus,
						rating: movieRating ? movieRating : null,
					},
				});
			},
		});
	},
});

export const updateShow = extendType({
	type: 'Mutation',
	definition(t) {
		t.field('updatedShow', {
			type: 'UserShow',
			args: {
				showId: nonNull(idArg()),
				watchStatus: nonNull(watchStatusTypes),
				showRating: intArg(),
				currentEpisode: intArg(),
			},
			resolve: async (
				_parent,
				{ showId, watchStatus, showRating, currentEpisode },
				ctx
			) => {
				return await ctx.prisma.show.update({
					where: {
						id_userId: {
							id: showId,
							userId: ctx.session!.user?.id!,
						},
					},
					data: {
						status: watchStatus,
						rating: showRating ? showRating : null,
						current_episode: currentEpisode ?? undefined,
					},
				});
			},
		});
	},
});

export const deleteMovie = extendType({
	type: 'Mutation',
	definition(t) {
		t.field('deletedMovie', {
			type: 'UserMovie',
			args: {
				movieId: nonNull(idArg()),
			},
			resolve: async (_parent, { movieId }, ctx) => {
				return await ctx.prisma.movie.delete({
					where: {
						id_userId: {
							id: movieId,
							userId: ctx.session?.user?.id!,
						},
					},
				});
			},
		});
	},
});

export const deleteShow = extendType({
	type: 'Mutation',
	definition(t) {
		t.field('deletedShow', {
			type: 'UserShow',
			args: {
				showId: nonNull(idArg()),
			},
			resolve: async (_parent, { showId }, ctx) => {
				return await ctx.prisma.show.delete({
					where: {
						id_userId: {
							id: showId,
							userId: ctx.session!.user?.id!,
						},
					},
				});
			},
		});
	},
});

export const redisRes = objectType({
	name: 'redisRes',
	definition(t) {
		t.field('error', {
			type: 'String',
		});
		t.field('successMsg', {
			type: 'String',
		});
		t.field('token', {
			type: 'String',
		});
	},
});

export const writeEmailVerificationToken = extendType({
	type: 'Mutation',
	definition(t) {
		t.field('writeEmailVerificationToken', {
			type: 'redisRes',
			args: {
				email: nonNull(stringArg()),
			},
			resolve: async (_parent, { email }, ctx) => {
				const user = await ctx.prisma.user.findUnique({
					where: { email },
					select: { id: true },
				});

				if (!user) {
					return {
						error: 'User not found.',
						successMsg: null,
						token: null,
					};
				}

				const token = v4();

				await ctx.redis.set(
					`${EMAIL_VERIFICATION_PREFIX}-${token}`,
					user.id,
					'EX',
					1000 * 60 * 60 * 24 * 3 // 3 days
				);

				return {
					error: null,
					successMsg: 'Email Verification Token Added',
					token,
				};
			},
		});
	},
});
