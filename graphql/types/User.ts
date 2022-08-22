import { objectType, extendType, stringArg, nonNull } from 'nexus';

export const User = objectType({
	name: 'User',
	definition(t) {
		t.string('id');
		t.string('name');
		t.string('email');
	},
});

export const getUsers = extendType({
	type: 'Query',
	definition(t) {
		t.list.field('users', {
			type: 'User',
			resolve: async (_parent, _args, ctx) => {
				return ctx.prisma.user.findMany();
			},
		});
	},
});

export const createUser = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('createdUser', {
			type: 'User',
			args: {
				name: nonNull(stringArg()),
				email: nonNull(stringArg()),
			},
			resolve: async (_parent, { name, email }, ctx) => {
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
