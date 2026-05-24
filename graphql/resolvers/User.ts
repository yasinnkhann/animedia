import { v4 } from 'uuid';
import { hash } from 'argon2';
import { extendType, stringArg, nonNull, idArg, intArg, booleanArg } from 'nexus';
import { WatchStatusTypes } from 'graphql/models/enums';
import Mail from 'nodemailer/lib/mailer';
import { sendEmail } from 'graphql/utils';
import {
	__prod__,
	CLIENT_BASE_URL,
	VERIFICATION_EMAIL_PREFIX,
	REDIS_EXP_MAP,
	VERIFICATION_EMAIL_COUNT_LIMIT,
	VERIFICATION_EMAIL_COUNT_PREFIX,
	FORGOT_PASSWORD_EMAIL_COUNT_PREFIX,
	FORGOT_PASSWORD_EMAIL_COUNT_LIMIT,
	FORGOT_PASSWORD_EMAIL_PREFIX,
} from 'utils/constants';
import { safeResolver } from '../utils/resolver-helpers';
import {
	parseInput,
	UserIdInput,
	UserMediaInput,
	UserShowInput,
	UserGameInput,
	TokenVerificationInput,
	EmailVerificationInput,
	TokenInput,
	AddMovieInput,
	AddShowInput,
	AddGameInput,
	UpdateMovieInput,
	UpdateShowInput,
	UpdateGameInput,
	RegisterUserInput,
	ChangePasswordInput,
	EmailInput,
} from '../validations/inputs';

const getSessionUserId = (ctx: { session?: { user?: { id?: string | null } | null } | null }) => {
	const userId = ctx.session?.user?.id;

	if (!userId) {
		throw new Error('User must be authenticated.');
	}

	return userId;
};

export const UserQueries = extendType({
	type: 'Query',
	definition(t) {
		t.field('user', {
			type: 'User',
			args: {
				id: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { id }, ctx) => {
				const input = parseInput(UserIdInput, { id });
				return await ctx.prisma.user.findUniqueOrThrow({
					where: { id: input.id },
					include: {
						movie: true,
						show: true,
					},
				});
			}),
		});

		t.field('usersMovie', {
			type: 'UserMovie',
			args: {
				movieId: nonNull(stringArg()),
			},
			resolve: safeResolver(async (_parent, { movieId }, ctx) => {
				const input = parseInput(UserMediaInput, { movieId });
				return await ctx.prisma.movie.findUnique({
					where: {
						id_userId: {
							id: input.movieId,
							userId: getSessionUserId(ctx),
						},
					},
				});
			}),
		});

		t.field('usersShow', {
			type: 'UserShow',
			args: {
				showId: nonNull(stringArg()),
			},
			resolve: safeResolver(async (_parent, { showId }, ctx) => {
				const input = parseInput(UserShowInput, { showId });
				return await ctx.prisma.show.findUnique({
					where: {
						id_userId: {
							id: input.showId,
							userId: getSessionUserId(ctx),
						},
					},
				});
			}),
		});

		t.field('usersGame', {
			type: 'UserGame',
			args: {
				gameId: nonNull(stringArg()),
			},
			resolve: safeResolver(async (_parent, { gameId }, ctx) => {
				const input = parseInput(UserGameInput, { gameId });
				return await ctx.prisma.game.findUnique({
					where: {
						id_userId: {
							id: input.gameId,
							userId: getSessionUserId(ctx),
						},
					},
				});
			}),
		});

		t.list.field('usersMovies', {
			type: 'UserMovie',
			resolve: safeResolver(async (_parent, _args, ctx) => {
				return await ctx.prisma.movie.findMany({
					where: {
						userId: getSessionUserId(ctx),
					},
					orderBy: [
						{
							name: 'asc',
						},
					],
				});
			}),
		});

		t.list.field('usersShows', {
			type: 'UserShow',
			resolve: safeResolver(async (_parent, _args, ctx) => {
				return await ctx.prisma.show.findMany({
					where: {
						userId: ctx.session?.user?.id,
					},
					orderBy: [
						{
							name: 'asc',
						},
					],
				});
			}),
		});

		t.list.field('usersGames', {
			type: 'UserGame',
			resolve: safeResolver(async (_parent, _args, ctx) => {
				return await ctx.prisma.game.findMany({
					where: {
						userId: ctx.session?.user?.id,
					},
					orderBy: [
						{
							name: 'asc',
						},
					],
				});
			}),
		});

		t.field('checkEmailVerificationToken', {
			type: 'RedisRes',
			args: {
				token: nonNull(stringArg()),
				userId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { token, userId }, ctx) => {
				const input = parseInput(TokenVerificationInput, { token, userId });
				const tokenStored = await ctx.redis.get(`${VERIFICATION_EMAIL_PREFIX}:${input.userId}`);

				if (input.token !== tokenStored) {
					return {
						errors: [{ message: 'Email verification token not found.' }],
						token: null,
						userId: null,
					};
				}

				return {
					errors: [],
					token: tokenStored,
					userId: input.userId,
				};
			}),
		});

		t.field('checkForgotPasswordToken', {
			type: 'RedisRes',
			args: {
				token: nonNull(stringArg()),
				userId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { token, userId }, ctx) => {
				const input = parseInput(TokenVerificationInput, { token, userId });
				const tokenStored = await ctx.redis.get(`${FORGOT_PASSWORD_EMAIL_PREFIX}:${input.userId}`);

				if (input.token !== tokenStored) {
					return {
						errors: [{ message: 'Forgot password token not found.' }],
						token: null,
						userId: null,
					};
				}

				return {
					errors: [],
					token: tokenStored,
					userId: input.userId,
				};
			}),
		});

		t.field('accountVerified', {
			type: 'AccountVerifiedRes',
			args: {
				email: nonNull(stringArg()),
			},
			resolve: safeResolver(async (_parent, { email }, ctx) => {
				const input = parseInput(EmailVerificationInput, { email });
				const acct = await ctx.prisma.user.findUnique({
					where: { email: input.email },
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
			}),
		});

		t.field('emailFromRedisToken', {
			type: 'String',
			args: {
				token: nonNull(stringArg()),
			},
			resolve: safeResolver(async (_parent, { token }, ctx) => {
				const input = parseInput(TokenInput, { token });
				const userId = await ctx.redis.get(`${VERIFICATION_EMAIL_PREFIX}:${input.token}`);

				if (!userId) return null;

				const user = await ctx.prisma.user.findUnique({
					where: { id: userId },
					select: { email: true },
				});

				if (!user) return null;

				return user.email;
			}),
		});

		t.list.field('users', {
			type: 'User',
			resolve: safeResolver(async (_parent, _args, ctx) => {
				return await ctx.prisma.user.findMany();
			}),
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
			resolve: safeResolver(async (_parent, { movieId, movieName, watchStatus }, ctx) => {
				const input = parseInput(AddMovieInput, { movieId, movieName, watchStatus });
				const userId = getSessionUserId(ctx);

				return await ctx.prisma.movie.upsert({
					where: {
						id_userId: {
							id: input.movieId,
							userId,
						},
					},
					create: {
						id: input.movieId,
						name: input.movieName,
						status: input.watchStatus,
						userId,
					},
					update: {
						name: input.movieName,
						status: input.watchStatus,
					},
				});
			}),
		});

		t.field('addShow', {
			type: 'UserShow',
			args: {
				showId: nonNull(idArg()),
				showName: nonNull(stringArg()),
				watchStatus: nonNull(WatchStatusTypes),
				currentEpisode: intArg(),
			},
			resolve: safeResolver(
				async (_parent, { showId, showName, watchStatus, currentEpisode }, ctx) => {
					const input = parseInput(AddShowInput, { showId, showName, watchStatus, currentEpisode });
					const userId = getSessionUserId(ctx);

					return await ctx.prisma.show.upsert({
						where: {
							id_userId: {
								id: input.showId,
								userId,
							},
						},
						create: {
							id: input.showId,
							name: input.showName,
							status: input.watchStatus,
							current_episode: input.currentEpisode ?? undefined,
							userId,
						},
						update: {
							name: input.showName,
							status: input.watchStatus,
							current_episode: input.currentEpisode ?? undefined,
						},
					});
				}
			),
		});

		t.field('addGame', {
			type: 'UserGame',
			args: {
				gameId: nonNull(idArg()),
				gameName: nonNull(stringArg()),
				wishlist: booleanArg(),
				rating: intArg(),
			},
			resolve: safeResolver(async (_parent, { gameId, gameName, wishlist, rating }, ctx) => {
				const input = parseInput(AddGameInput, { gameId, gameName, wishlist, rating });
				return await ctx.prisma.user.update({
					where: { id: getSessionUserId(ctx) },
					data: {
						game: {
							create: {
								id: input.gameId,
								name: input.gameName,
								wishlist: input.wishlist ?? undefined,
								rating: input.rating,
							},
						},
					},
				});
			}),
		});

		t.field('updateMovie', {
			type: 'UserMovie',
			args: {
				movieId: nonNull(idArg()),
				watchStatus: nonNull(WatchStatusTypes),
				movieRating: intArg(),
			},
			resolve: safeResolver(async (_parent, { movieId, watchStatus, movieRating }, ctx) => {
				const input = parseInput(UpdateMovieInput, { movieId, watchStatus, movieRating });
				return await ctx.prisma.movie.update({
					where: {
						id_userId: {
							id: input.movieId,
							userId: getSessionUserId(ctx),
						},
					},
					data: {
						status: input.watchStatus,
						rating: input.movieRating ? input.movieRating : null,
					},
				});
			}),
		});

		t.field('updateShow', {
			type: 'UserShow',
			args: {
				showId: nonNull(idArg()),
				watchStatus: nonNull(WatchStatusTypes),
				showRating: intArg(),
				currentEpisode: intArg(),
			},
			resolve: safeResolver(
				async (_parent, { showId, watchStatus, showRating, currentEpisode }, ctx) => {
					const input = parseInput(UpdateShowInput, {
						showId,
						watchStatus,
						showRating,
						currentEpisode,
					});
					return await ctx.prisma.show.update({
						where: {
							id_userId: {
								id: input.showId,
								userId: getSessionUserId(ctx),
							},
						},
						data: {
							status: input.watchStatus,
							rating: input.showRating ? input.showRating : null,
							current_episode: input.currentEpisode ?? undefined,
						},
					});
				}
			),
		});

		t.field('updateGame', {
			type: 'UserGame',
			args: {
				gameId: nonNull(idArg()),
				wishlist: booleanArg(),
				rating: intArg(),
			},
			resolve: safeResolver(async (_parent, { gameId, wishlist, rating }, ctx) => {
				const input = parseInput(UpdateGameInput, { gameId, wishlist, rating });
				return await ctx.prisma.game.update({
					where: {
						id_userId: {
							id: input.gameId,
							userId: getSessionUserId(ctx),
						},
					},
					data: {
						wishlist: input.wishlist ?? undefined,
						rating: input.rating,
					},
				});
			}),
		});

		t.field('deleteMovie', {
			type: 'UserMovie',
			args: {
				movieId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { movieId }, ctx) => {
				const input = parseInput(UserMediaInput, { movieId });
				return await ctx.prisma.movie.delete({
					where: {
						id_userId: {
							id: input.movieId,
							userId: getSessionUserId(ctx),
						},
					},
				});
			}),
		});

		t.field('deleteShow', {
			type: 'UserShow',
			args: {
				showId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { showId }, ctx) => {
				const input = parseInput(UserShowInput, { showId });
				return await ctx.prisma.show.delete({
					where: {
						id_userId: {
							id: input.showId,
							userId: getSessionUserId(ctx),
						},
					},
				});
			}),
		});

		t.field('deleteGame', {
			type: 'UserGame',
			args: {
				gameId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { gameId }, ctx) => {
				const input = parseInput(UserGameInput, { gameId });
				return await ctx.prisma.game.delete({
					where: {
						id_userId: {
							id: input.gameId,
							userId: getSessionUserId(ctx),
						},
					},
				});
			}),
		});

		t.field('registerUser', {
			type: 'RegisteredUserRes',
			args: {
				name: nonNull(stringArg()),
				email: nonNull(stringArg()),
				password: nonNull(stringArg()),
			},
			resolve: safeResolver(async (_parent, { name, email, password }, ctx) => {
				const input = parseInput(RegisterUserInput, { name, email, password });
				const existingUser = await ctx.prisma.user.findUnique({
					where: { email: input.email },
				});

				if (existingUser) {
					throw new Error('Email Already Exists');
				}
				const newUser = await ctx.prisma.user.create({
					data: { name: input.name, email: input.email, password: await hash(input.password) },
				});

				const { password: _userPassword, ...createdUserWithoutPassword } = newUser;

				return {
					errors: [],
					createdUser: createdUserWithoutPassword,
				};
			}),
		});

		t.field('verifyUserEmail', {
			type: 'RedisRes',
			args: {
				userId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { userId }, ctx) => {
				const input = parseInput(UserIdInput, { id: userId });
				await ctx.prisma.user.update({
					where: { id: input.id },
					data: {
						emailVerified: new Date(),
					},
				});

				await ctx.redis.del(`${VERIFICATION_EMAIL_PREFIX}:${input.id}`);

				await ctx.redis.del(`${VERIFICATION_EMAIL_COUNT_PREFIX}:${input.id}`);

				return {
					errors: [],
					token: null,
					userId: input.id,
				};
			}),
		});

		t.field('sendVerificationEmail', {
			type: 'RedisRes',
			args: {
				userId: nonNull(idArg()),
			},
			resolve: safeResolver(async (_parent, { userId }, ctx) => {
				const input = parseInput(UserIdInput, { id: userId });
				const user = await ctx.prisma.user.findUnique({
					where: { id: input.id },
					select: { email: true },
				});

				if (!user?.email) {
					throw new Error('Could not find user with that email');
				}

				const verificationEmailCountRes = await ctx.redis.get(
					`${VERIFICATION_EMAIL_COUNT_PREFIX}:${input.id}`
				);

				const verificationEmailCount = +(verificationEmailCountRes ?? '0');

				if (__prod__ && verificationEmailCount === VERIFICATION_EMAIL_COUNT_LIMIT) {
					throw new Error(
						'You have reached the limit of verification emails. Please wait 24 hours to try again.'
					);
				}

				await ctx.redis.del(`${VERIFICATION_EMAIL_PREFIX}:${input.id}`);

				const token = v4();

				await ctx.redis.set(
					`${VERIFICATION_EMAIL_PREFIX}:${input.id}`,
					token,
					'EX',
					REDIS_EXP_MAP[VERIFICATION_EMAIL_PREFIX]
				);

				await ctx.redis.set(
					`${VERIFICATION_EMAIL_COUNT_PREFIX}:${input.id}`,
					(verificationEmailCount + 1).toString(),
					'EX',
					REDIS_EXP_MAP[VERIFICATION_EMAIL_COUNT_PREFIX]
				);

				const payload: Mail.Options = {
					from: process.env.EMAIL_FROM,
					to: user.email,
					subject: 'Email Verification Link',
					text: 'Click the link below to verify your email.',
					html: `<a href="${CLIENT_BASE_URL}/auth/verification-email?uid=${input.id}&token=${token}">Verify Email</a>`,
				};

				await sendEmail(payload);

				return {
					errors: [],
					token,
					userId: input.id,
				};
			}),
		});

		t.field('sendForgotPasswordEmail', {
			type: 'RedisRes',
			args: {
				email: nonNull(stringArg()),
			},
			resolve: safeResolver(async (_parent, { email }, ctx) => {
				const input = parseInput(EmailInput, { email });
				const user = await ctx.prisma.user.findUnique({
					where: { email: input.email },
				});

				if (!user?.email) {
					throw new Error('No user found with that email');
				}

				const forgotPasswordEmailCountRes = await ctx.redis.get(
					`${FORGOT_PASSWORD_EMAIL_COUNT_PREFIX}:${user.id}`
				);

				const forgotPasswordEmailCount = +(forgotPasswordEmailCountRes ?? '0');

				if (__prod__ && forgotPasswordEmailCount === FORGOT_PASSWORD_EMAIL_COUNT_LIMIT) {
					throw new Error(
						'You have reached the limit of forgot password emails. Please wait 24 hours to try again.'
					);
				}

				await ctx.redis.del(`${FORGOT_PASSWORD_EMAIL_PREFIX}:${user.id}`);

				const token = v4();

				await ctx.redis.set(
					`${FORGOT_PASSWORD_EMAIL_PREFIX}:${user.id}`,
					token,
					'EX',
					REDIS_EXP_MAP[FORGOT_PASSWORD_EMAIL_PREFIX]
				);

				await ctx.redis.set(
					`${FORGOT_PASSWORD_EMAIL_COUNT_PREFIX}:${user.id}`,
					(forgotPasswordEmailCount + 1).toString(),
					'EX',
					REDIS_EXP_MAP[FORGOT_PASSWORD_EMAIL_COUNT_PREFIX]
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
			}),
		});

		t.field('changePassword', {
			type: 'RedisRes',
			args: {
				userId: nonNull(idArg()),
				newPassword: nonNull(stringArg()),
			},
			resolve: safeResolver(async (_parent, { userId, newPassword }, ctx) => {
				const input = parseInput(ChangePasswordInput, { userId, newPassword });
				const hashedNewPassword = await hash(input.newPassword);

				await ctx.prisma.user.update({
					data: { password: hashedNewPassword },
					where: { id: input.userId },
				});

				await ctx.redis.del(`${FORGOT_PASSWORD_EMAIL_PREFIX}:${input.userId}`);

				await ctx.redis.del(`${FORGOT_PASSWORD_EMAIL_COUNT_PREFIX}:${input.userId}`);

				return {
					errors: [],
					token: null,
					userId: input.userId,
				};
			}),
		});
	},
});
