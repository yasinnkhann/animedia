import { builder } from '../builder';
import { WatchStatusTypes } from '../builder';
import {
	AccountVerifiedRes,
	HttpRes,
	RedisRes,
	RegisteredUserRes,
} from '../../models/entities';
import {
	EMAIL_VERIFICATION_PREFIX,
	RETRY_EMAIL_VERIFICATION_PREFIX,
} from 'utils/constants';

builder.prismaObject('Movie', {
	fields: t => ({
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		status: t.field({
			type: WatchStatusTypes,
			resolve: root => root.status,
		}),
		rating: t.exposeInt('rating', { nullable: true }),
	}),
});

builder.prismaObject('Show', {
	fields: t => ({
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		status: t.field({
			type: WatchStatusTypes,
			resolve: root => root.status,
		}),
		rating: t.exposeInt('rating', { nullable: true }),
		currentEpisode: t.exposeInt('current_episode'),
	}),
});

builder.prismaObject('User', {
	fields: t => ({
		id: t.exposeID('id'),
		name: t.exposeString('name', { nullable: true }),
		email: t.exposeString('email', { nullable: true }),
		password: t.exposeString('password', { nullable: true }),
		image: t.exposeString('image', { nullable: true }),
		createdAt: t.expose('created_at', { type: 'Date' }),
		emailVerified: t.expose('emailVerified', { type: 'Date', nullable: true }),
		movies: t.relation('movies'),
		shows: t.relation('shows'),
	}),
});

builder.objectType(RegisteredUserRes, {
	name: 'RegisteredUserRes',
	fields: t => ({
		error: t.exposeString('error', { nullable: true }),
		createdUser: t.prismaField({
			type: 'User',
			nullable: true,
			resolve: (_query, root) => root.createdUser,
		}),
		ok: t.exposeBoolean('ok'),
		statusCode: t.exposeInt('statusCode'),
	}),
});

builder.objectType(RedisRes, {
	name: 'RedisRes',
	fields: t => ({
		error: t.exposeString('error', { nullable: true }),
		successMsg: t.exposeString('successMsg', { nullable: true }),
		token: t.exposeString('token', { nullable: true }),
		userId: t.exposeID('userId', { nullable: true }),
	}),
});

builder.objectType(AccountVerifiedRes, {
	name: 'AccountVerifiedRes',
	fields: t => ({
		error: t.exposeString('error', { nullable: true }),
		id: t.exposeID('id', { nullable: true }),
		emailVerified: t.expose('emailVerified', { type: 'Date', nullable: true }),
	}),
});

builder.objectType(HttpRes, {
	name: 'HttpRes',
	fields: t => ({
		error: t.exposeString('error', { nullable: true }),
		successMsg: t.exposeString('successMsg', { nullable: true }),
		ok: t.exposeBoolean('ok'),
		statusCode: t.exposeInt('statusCode'),
	}),
});

builder.queryType({
	fields: t => ({
		user: t.prismaField({
			type: 'User',
			args: {
				id: t.arg.id(),
			},
			resolve: async (query, _root, { id }, ctx) => {
				return await ctx.prisma.user.findUniqueOrThrow({
					...query,
					where: { id: id as string },
					include: {
						movies: true,
						shows: true,
					},
				});
			},
		}),
		usersMovie: t.prismaField({
			type: 'Movie',
			args: {
				movieId: t.arg.id(),
			},
			resolve: async (query, _root, { movieId }, ctx) => {
				return await ctx.prisma.movie.findUniqueOrThrow({
					...query,
					where: {
						id_userId: {
							id: movieId as string,
							userId: ctx.session!.user?.id!,
						},
					},
				});
			},
		}),
		usersShow: t.prismaField({
			type: 'Show',
			args: {
				showId: t.arg.id(),
			},
			resolve: async (query, _root, { showId }, ctx) => {
				return await ctx.prisma.show.findUniqueOrThrow({
					...query,
					where: {
						id_userId: {
							id: showId as string,
							userId: ctx.session!.user?.id!,
						},
					},
				});
			},
		}),
		usersMovies: t.prismaField({
			type: ['Movie'],
			resolve: async (query, _root, _args, ctx) => {
				return await ctx.prisma.movie.findMany({
					...query,
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
		}),
		usersShows: t.prismaField({
			type: ['Show'],
			resolve: async (query, _root, _args, ctx) => {
				return await ctx.prisma.show.findMany({
					...query,
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
		}),
		checkEmailVerificationToken: t.field({
			type: RedisRes,
			args: {
				token: t.arg.string(),
			},
			resolve: async (_root, { token }, ctx) => {
				const userId = await ctx.redis.get(
					`${EMAIL_VERIFICATION_PREFIX}-${token}`
				);

				if (!userId) {
					return new RedisRes(
						'Email Verification Not Found.',
						null,
						null,
						null
					);
				}

				return new RedisRes(null, 'Valid EMAIL VERIFICATION.', token, userId);
			},
		}),
		accountVerified: t.field({
			type: AccountVerifiedRes,
			args: {
				email: t.arg.string(),
			},
			resolve: async (_root, { email }, ctx) => {
				const acct = await ctx.prisma.user.findUnique({
					where: { email },
					select: { id: true, emailVerified: true },
				});

				if (acct?.id && !acct.emailVerified) {
					return new AccountVerifiedRes('Account Not Verified', acct.id, null);
				}

				if (acct?.id && acct.emailVerified) {
					return new AccountVerifiedRes(null, acct.id, acct.emailVerified);
				}

				return new AccountVerifiedRes('Account Not Found', null, null);
			},
		}),
		emailFromRedisToken: t.string({
			nullable: true,
			args: {
				token: t.arg.string(),
			},
			resolve: async (_root, { token }, ctx) => {
				const userId = await ctx.redis.get(
					`${EMAIL_VERIFICATION_PREFIX}-${token}`
				);

				if (!userId) return null;

				const user = await ctx.prisma.user.findUnique({
					where: { id: userId },
					select: { email: true },
				});

				if (!user?.email) return null;

				return user.email;
			},
		}),
		checkRetryEmailVerificationLimit: t.field({
			type: RedisRes,
			args: {
				email: t.arg.string(),
			},
			resolve: async (_root, { email }, ctx) => {
				const limitFound = await ctx.redis.get(
					`${RETRY_EMAIL_VERIFICATION_PREFIX}-${email}`
				);

				if (!limitFound) {
					return new RedisRes(
						'Retry Email Verification Limit Not Found',
						null,
						null
					);
				}

				return new RedisRes(
					null,
					'Retry Email Verification Limit Found',
					limitFound
				);
			},
		}),
		hello: t.string({
			args: {
				name: t.arg.string({ required: false }),
			},
			resolve: (_root, { name }) => `hello, ${name || 'World'}`,
		}),
		currentDate: t.field({
			type: 'Date',
			resolve: () => new Date(),
		}),
	}),
});

builder.mutationType({
	fields: t => ({
		addMovie: t.field({
			type: HttpRes,
			args: {
				movieId: t.arg.id(),
				movieName: t.arg.string(),
				watchStatus: t.arg({
					type: WatchStatusTypes,
				}),
			},
			resolve: async (_root, { movieId, movieName, watchStatus }, ctx) => {
				try {
					await ctx.prisma.user.update({
						where: { id: ctx.session!.user?.id! },
						data: {
							shows: {
								create: {
									id: movieId as string,
									name: movieName,
									status: watchStatus,
								},
							},
						},
					});
					return new HttpRes(null, 'Movie added', true, 200);
				} catch (err) {
					return new HttpRes('Could not add movie', null, false, 400);
				}
			},
		}),
	}),
});
