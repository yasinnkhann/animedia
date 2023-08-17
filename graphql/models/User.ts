import { builder } from '../builder';
import { WatchStatusTypes } from '../builder';

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

// builder.objectType('User', {
// 	description: 'Long necks, cool patterns, taller than you.',
// 	fields: t => ({}),
// });

builder.queryType({
	fields: t => ({
		// users: t.prismaField({
		// 	type: ['User'],
		// 	resolve: async (query, _parent, _args, ctx) => {
		// 		return await ctx.prisma.user.findMany({ ...query });
		// 	},
		// }),
		user: t.prismaField({
			type: 'User',
			args: {
				id: t.arg.id(),
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
