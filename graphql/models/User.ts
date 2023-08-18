import { builder } from '../builder';
import { WatchStatusTypes } from '../builder';
import {
	AccountVerifiedRes,
	NodeRes,
	RedisRes,
	RegisteredUserRes,
} from '../../models/entities';

builder.prismaObject('Movie', {
	fields: t => ({
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		status: t.field({
			type: WatchStatusTypes,
			resolve: parent => parent.status,
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
			resolve: parent => parent.status,
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
			resolve: (_query, parent) => parent.createdUser,
			nullable: true,
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

builder.objectType(NodeRes, {
	name: 'NodeRes',
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
				id: t.arg.id({ required: true }),
			},
			resolve: async (query, _parent, { id }, ctx) => {
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
				movieId: t.arg.id({ required: true }),
			},
			resolve: async (query, _parent, { movieId }, ctx) => {
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
		hello: t.string({
			args: {
				name: t.arg.string(),
			},
			resolve: (_parent, { name }) => `hello, ${name || 'World'}`,
		}),
		currentDate: t.field({
			type: 'Date',
			resolve: () => new Date(),
		}),
	}),
});
