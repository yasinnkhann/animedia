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
		t.field('user', {
			type: 'User',

			resolve: (_parent, _args, ctx) => {
				return ctx.prisma.user.findUnique({
					where: { id: ctx.session!.user?.id },
				});
			},
		});
	},
});

export const createUser = extendType({
	type: 'Mutation',
	definition(t) {
		t.field('createdUser', {
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
