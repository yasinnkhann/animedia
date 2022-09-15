import { objectType, extendType, stringArg, nonNull } from 'nexus';

export const user = objectType({
	name: 'User',
	definition(t) {
		t.string('id');
		t.string('name');
		t.string('email');
		t.string('image');
	},
});

export const getUser = extendType({
	type: 'Query',
	definition(t) {
		t.field('getUser', {
			type: 'User',
			args: {
				userId: nonNull(stringArg()),
			},
			resolve: (_parent, args, ctx) => {
				console.log('SESH IN USER RESOLVER: ', ctx.session);
				return ctx.prisma.user.findUnique({
					where: { id: args.userId },
				});
			},
		});
	},
});

export const createUser = extendType({
	type: 'Mutation',
	definition(t) {
		t.field('createUser', {
			type: 'User',
			args: {
				name: nonNull(stringArg()),
				email: nonNull(stringArg()),
			},
			resolve: async (_, { name, email }, ctx) => {
				return ctx.prisma.user.create({
					data: {
						name,
						email,
					},
				});
			},
		});
	},
});

//% EX

export const exampleQuery = extendType({
	type: 'Query',
	definition(t) {
		t.field('example', {
			type: 'String',
			resolve: async (_parent, _args, ctx) => {
				const req = ctx.req;
				// console.log('REQ IN RESOLVER: ', req);
				console.log('SESH IN EX RESOLVER: ', ctx.session);
				return 'Hello there!';
			},
		});
	},
});
