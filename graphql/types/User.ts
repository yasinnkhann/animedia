import { objectType, extendType, stringArg, nonNull } from 'nexus';

export const User = objectType({
	name: 'User',
	definition(t) {
		t.nonNull.string('id');
		t.nonNull.string('name');
		t.nonNull.string('email');
	},
});

export const getUsers = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.field('users', {
			type: nonNull('User'),
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
			type: nonNull('User'),
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
