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

export const userQueries = extendType({
	type: 'Query',
	definition: t => {
		t.field('user', {
			type: 'User',
			args: {
				userId: nonNull(stringArg()),
			},
			resolve: (_parent, args, ctx) => {
				console.log('SESH: ', ctx?.session);
				return ctx.prisma.user.findUnique({
					where: { id: args.userId },
				});
			},
		});
	},
});

export const userMutations = extendType({
	type: 'Mutation',
	definition: t => {
		t.field('createOneUser', {
			type: 'User',
			args: {
				name: stringArg(),
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
export const exampleQueryType = objectType({
	name: 'Example',
	definition(t) {
		t.string('message');
	},
});

export const exampleQuery = extendType({
	type: 'Query',
	definition: t => {
		t.field('example', {
			type: 'Example',
			resolve: async (_parent, _args, ctx) => {
				console.log('SESH: ', ctx.session);
				return {
					message: 'Hello there!',
				};
			},
		});
	},
});
