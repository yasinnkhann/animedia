import { builder } from '../builder';
import { prisma } from '../../lib/prisma';
import { WatchStatusTypes } from '../builder';

builder.prismaObject('Movie', {
	fields: t => ({
		id: t.exposeID('id'),
		name: t.exposeString('name', { nullable: true }),
		status: t.field({
			type: WatchStatusTypes,
			resolve: parent => parent.status,
		}),
		rating: t.exposeInt('rating', { nullable: true }),
	}),
});

builder.prismaObject('User', {
	fields: t => ({
		id: t.exposeID('id'),
		name: t.exposeString('name', { nullable: true }),
		email: t.exposeString('email', { nullable: true }),
		createdAt: t.expose('created_at', { type: 'Date' }),
		emailVerified: t.expose('emailVerified', { type: 'Date', nullable: true }),
		image: t.exposeString('image', { nullable: true }),
		password: t.exposeString('password', { nullable: true }),
		// accounts: t.relation('accounts'),
		// sessions: t.relation('sessions'),
		// movies: t.relation('movies'),
		// shows: t.relation('shows'),
	}),
});

builder.queryField('users', t =>
	t.prismaField({
		type: ['User'],
		resolve: async (query, root, args, ctx, info) => {
			return prisma.user.findMany({ ...query });
		},
	})
);

builder.queryType({
	fields: t => ({
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
