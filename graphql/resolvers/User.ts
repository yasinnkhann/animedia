import crypto from 'crypto';
import { hash } from 'argon2';
import { extendType, stringArg, nonNull, idArg, intArg } from 'nexus';
import { WatchStatusTypes } from 'graphql/models/enums';
import Mail from 'nodemailer/lib/mailer';
import { getErrorMsg, sendEmail } from 'graphql/utils';
import {
	__prod__,
	CLIENT_BASE_URL,
	VERIFICATION_EMAIL_PREFIX,
	REDIS_MAP,
	VERIFICATION_EMAIL_COUNT_LIMIT,
	VERIFICATION_EMAIL_COUNT_PREFIX,
	FORGOT_PASSWORD_EMAIL_COUNT_PREFIX,
	FORGOT_PASSWORD_EMAIL_COUNT_LIMIT,
	FORGOT_PASSWORD_EMAIL_PREFIX,
} from 'utils/constants';

export const UserQueries = extendType({
	type: 'Query',
	definition(t) {
		t.field('user', {
			type: 'User',
			args: {
				id: nonNull(idArg()),
			},
			resolve: async (_parent, { id }, ctx) => {
				return await ctx.prisma.user.findUniqueOrThrow({
					where: { id },
					include: {
						movies: true,
						shows: true,
					},
				});
			},
		});

		t.field('usersMovie', {
			type: 'UserMovie',
			args: {
				movieId: nonNull(stringArg()),
			},
			resolve: async (_parent, { movieId }, ctx) => {
				return await ctx.prisma.movies.findUnique({
					where: {
						id_userId: {
							id: movieId,
							userId: ctx.session!.user?.id!,
						},
					},
				});
			},
		});

		t.field('usersShow', {
			type: 'UserShow',
			args: {
				showId: nonNull(stringArg()),
			},
			resolve: async (_parent, { showId }, ctx) => {
				return await ctx.prisma.shows.findUnique({
					where: {
						id_userId: {
							id: showId,
							userId: ctx.session!.user?.id!,
						},
					},
				});
			},
		});

		t.list.field('usersMovies', {
			type: 'UserMovie',
			resolve: async (_parent, _args, ctx) => {
				return await ctx.prisma.movies.findMany({
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

		t.list.field('usersShows', {
			type: 'UserShow',
			resolve: async (_parent, _args, ctx) => {
				return await ctx.prisma.shows.findMany({
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

		t.field('checkEmailVerificationToken', {
			type: 'RedisRes',
			args: {
				token: nonNull(stringArg()),
				userId: nonNull(idArg()),
			},
			resolve: async (_parent, { token, userId }, ctx) => {
				const tokenStored = await ctx.redis.get(
					`${VERIFICATION_EMAIL_PREFIX}:${userId}`
				);

				if (token !== tokenStored) {
					return {
						errors: [{ message: 'Email verification token not found.' }],
						token: null,
						userId: null,
					};
				}

				return {
					errors: [],
					token: tokenStored,
					userId,
				};
			},
		});

		t.field('checkForgotPasswordToken', {
			type: 'RedisRes',
			args: {
				token: nonNull(stringArg()),
				userId: nonNull(idArg()),
			},
			resolve: async (_parent, { token, userId }, ctx) => {
				const tokenStored = await ctx.redis.get(
					`${FORGOT_PASSWORD_EMAIL_PREFIX}:${userId}`
				);

				if (token !== tokenStored) {
					return {
						errors: [{ message: 'Forgot password token not found.' }],
						token: null,
						userId: null,
					};
				}

				return {
					errors: [],
					token: tokenStored,
					userId,
				};
			},
		});

		t.field('accountVerified', {
			type: 'AccountVerifiedRes',
			args: {
				email: nonNull(stringArg()),
			},
			resolve: async (_parent, { email }, ctx) => {
				const acct = await ctx.prisma.user.findUnique({
					where: { email },
					select: { id: true, emailVerified: true },
				});

				if (acct?.id) {
					if (!acct.emailVerified) {
						return {
							errors: [{ message: 'Account Not Verified' }],
							id: acct.id,
							emailVerified: null,
						};
					} else {
						if (acct?.id && acct.emailVerified) {
							return {
								errors: [],
								id: acct.id,
								emailVerified: acct.emailVerified,
							};
						}
					}
				}

				return {
					errors: [{ message: 'Account Not Found' }],
					id: null,
					emailVerified: null,
				};
			},
		});

		t.field('emailFromRedisToken', {
			type: 'String',
			args: {
				token: nonNull(stringArg()),
			},
			resolve: async (_parent, { token }, ctx) => {
				const userId = await ctx.redis.get(
					`${VERIFICATION_EMAIL_PREFIX}:${token}`
				);

				if (!userId) return null;

				const user = await ctx.prisma.user.findUnique({
					where: { id: userId },
					select: { email: true },
				});

				if (!user) return null;

				return user.email;
			},
		});
	},
});

export const UserMutations = extendType({
	type: 'Mutation',
	definition(t) {
		t.field('addMovie', {
			type: 'UserMovie',
			args: {
				movieId: nonNull(idArg()),
				movieName: nonNull(stringArg()),
				watchStatus: nonNull(WatchStatusTypes),
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

		t.field('addShow', {
			type: 'UserShow',
			args: {
				showId: nonNull(idArg()),
				showName: nonNull(stringArg()),
				watchStatus: nonNull(WatchStatusTypes),
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

		t.field('updateMovie', {
			type: 'UserMovie',
			args: {
				movieId: nonNull(idArg()),
				watchStatus: nonNull(WatchStatusTypes),
				movieRating: intArg(),
			},
			resolve: async (_parent, { movieId, watchStatus, movieRating }, ctx) => {
				return await ctx.prisma.movies.update({
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

		t.field('updateShow', {
			type: 'UserShow',
			args: {
				showId: nonNull(idArg()),
				watchStatus: nonNull(WatchStatusTypes),
				showRating: intArg(),
				currentEpisode: intArg(),
			},
			resolve: async (
				_parent,
				{ showId, watchStatus, showRating, currentEpisode },
				ctx
			) => {
				return await ctx.prisma.shows.update({
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

		t.field('deleteMovie', {
			type: 'UserMovie',
			args: {
				movieId: nonNull(idArg()),
			},
			resolve: async (_parent, { movieId }, ctx) => {
				return await ctx.prisma.movies.delete({
					where: {
						id_userId: {
							id: movieId,
							userId: ctx.session?.user?.id!,
						},
					},
				});
			},
		});

		t.field('deleteShow', {
			type: 'UserShow',
			args: {
				showId: nonNull(idArg()),
			},
			resolve: async (_parent, { showId }, ctx) => {
				return await ctx.prisma.shows.delete({
					where: {
						id_userId: {
							id: showId,
							userId: ctx.session!.user?.id!,
						},
					},
				});
			},
		});

		t.field('registerUser', {
			type: 'RegisteredUserRes',
			args: {
				name: nonNull(stringArg()),
				email: nonNull(stringArg()),
				password: nonNull(stringArg()),
			},
			resolve: async (_parent, { name, email, password }, ctx) => {
				try {
					const existingUser = await ctx.prisma.user.findUnique({
						where: { email },
					});

					if (existingUser) {
						return {
							errors: [{ message: 'Email Already Exists' }],
							createdUser: null,
						};
					}
					const newUser = await ctx.prisma.user.create({
						data: { name, email, password: await hash(password) },
					});
					return {
						errors: [],
						createdUser: newUser,
					};
				} catch (err) {
					console.error(err);
					return {
						errors: [{ message: getErrorMsg(err) }],
						createdUser: null,
					};
				}
			},
		});

		t.field('verifyUserEmail', {
			type: 'RedisRes',
			args: {
				userId: nonNull(idArg()),
			},
			resolve: async (_parent, { userId }, ctx) => {
				try {
					await ctx.prisma.user.update({
						where: { id: userId },
						data: {
							emailVerified: new Date(),
						},
					});

					await ctx.redis.del(`${VERIFICATION_EMAIL_PREFIX}:${userId}`);

					await ctx.redis.del(`${VERIFICATION_EMAIL_COUNT_PREFIX}:${userId}`);

					return {
						errors: [],
						token: null,
						userId,
					};
				} catch (err) {
					console.error(err);
					return {
						errors: [{ message: getErrorMsg(err) }],
						token: null,
						userId: null,
					};
				}
			},
		});

		t.field('sendVerificationEmail', {
			type: 'RedisRes',
			args: {
				userId: nonNull(idArg()),
			},
			resolve: async (_parent, { userId }, ctx) => {
				try {
					const user = await ctx.prisma.user.findUnique({
						where: { id: userId },
						select: { email: true },
					});

					if (!user?.email) {
						return {
							errors: [{ message: 'Could not find user with that email' }],
							token: null,
							userId: null,
						};
					}

					const verificationEmailCountRes = await ctx.redis.get(
						`${VERIFICATION_EMAIL_COUNT_PREFIX}:${userId}`
					);

					const verificationEmailCount = +(verificationEmailCountRes ?? '0');

					if (
						__prod__ &&
						verificationEmailCount === VERIFICATION_EMAIL_COUNT_LIMIT
					) {
						return {
							errors: [
								{
									message:
										'You have reached the limit of verification emails. Please wait 24 hours to try again.',
								},
							],
							token: null,
							userId: null,
						};
					}

					await ctx.redis.del(`${VERIFICATION_EMAIL_PREFIX}:${userId}`);

					const token = crypto.randomUUID();

					await ctx.redis.set(
						`${VERIFICATION_EMAIL_PREFIX}:${userId}`,
						token,
						'EX',
						REDIS_MAP[VERIFICATION_EMAIL_PREFIX]
					);

					await ctx.redis.set(
						`${VERIFICATION_EMAIL_COUNT_PREFIX}:${userId}`,
						(verificationEmailCount + 1).toString(),
						'EX',
						REDIS_MAP[VERIFICATION_EMAIL_COUNT_PREFIX]
					);

					const payload: Mail.Options = {
						from: process.env.EMAIL_FROM,
						to: user.email,
						subject: 'Email Verification Link',
						text: 'Click the link below to verify your email.',
						html: `<a href="${CLIENT_BASE_URL}/auth/verification-email?uid=${userId}&token=${token}">Verify Email</a>`,
					};

					await sendEmail(payload);

					return {
						errors: [],
						token,
						userId,
					};
				} catch (err) {
					console.error(err);
					return {
						errors: [{ message: getErrorMsg(err) }],
					};
				}
			},
		});

		t.field('sendForgotPasswordEmail', {
			type: 'RedisRes',
			args: {
				email: nonNull(stringArg()),
			},
			resolve: async (_parent, { email }, ctx) => {
				try {
					const user = await ctx.prisma.user.findUnique({
						where: { email },
					});

					if (!user?.email) {
						return {
							errors: [{ message: 'No user found with that email' }],
							token: null,
							userId: null,
						};
					}

					const forgotPasswordEmailCountRes = await ctx.redis.get(
						`${FORGOT_PASSWORD_EMAIL_COUNT_PREFIX}:${user.id}`
					);

					const forgotPasswordEmailCount = +(
						forgotPasswordEmailCountRes ?? '0'
					);

					if (
						__prod__ &&
						forgotPasswordEmailCount === FORGOT_PASSWORD_EMAIL_COUNT_LIMIT
					) {
						return {
							errors: [
								{
									message:
										'You have reached the limit of forgot password emails. Please wait 24 hours to try again.',
								},
							],
							token: null,
							userId: null,
						};
					}

					await ctx.redis.del(`${FORGOT_PASSWORD_EMAIL_PREFIX}:${user.id}`);

					const token = crypto.randomUUID();

					await ctx.redis.set(
						`${FORGOT_PASSWORD_EMAIL_PREFIX}:${user.id}`,
						token,
						'EX',
						REDIS_MAP[FORGOT_PASSWORD_EMAIL_PREFIX]
					);

					await ctx.redis.set(
						`${FORGOT_PASSWORD_EMAIL_COUNT_PREFIX}:${user.id}`,
						(forgotPasswordEmailCount + 1).toString(),
						'EX',
						REDIS_MAP[FORGOT_PASSWORD_EMAIL_COUNT_PREFIX]
					);

					const payload: Mail.Options = {
						from: process.env.EMAIL_FROM,
						to: user.email,
						subject: 'Forgot Password Link',
						text: 'Click the link below to create a new password.',
						html: `<a href="${CLIENT_BASE_URL}/auth/change-password?uid=${user.id}&token=${token}">Verify Email</a>`,
					};

					await sendEmail(payload);

					return {
						errors: [],
						token,
						userId: user.id,
					};
				} catch (err) {
					console.error(err);
					return {
						errors: [{ message: getErrorMsg(err) }],
						token: null,
						userId: null,
					};
				}
			},
		});

		t.field('changePassword', {
			type: 'RedisRes',
			args: {
				userId: nonNull(idArg()),
				newPassword: nonNull(stringArg()),
			},
			resolve: async (_parent, { userId, newPassword }, ctx) => {
				try {
					const hashedNewPassword = await hash(newPassword);

					await ctx.prisma.user.update({
						data: { password: hashedNewPassword },
						where: { id: userId },
					});

					await ctx.redis.del(`${FORGOT_PASSWORD_EMAIL_PREFIX}:${userId}`);

					await ctx.redis.del(
						`${FORGOT_PASSWORD_EMAIL_COUNT_PREFIX}:${userId}`
					);

					return {
						errors: [],
						token: null,
						userId,
					};
				} catch (err) {
					console.error(err);
					return {
						errors: [{ message: getErrorMsg(err) }],
						token: null,
						userId: null,
					};
				}
			},
		});
	},
});
