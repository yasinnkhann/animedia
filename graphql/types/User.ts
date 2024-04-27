import { v4 } from 'uuid';
import { hash } from 'argon2';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { CommonMethods } from '../../utils/CommonMethods';
import {
	EMAIL_VERIFICATION_PREFIX,
	VERIFICATION_EMAIL_COUNT_PREFIX,
} from 'utils/constants';
import {
	objectType,
	extendType,
	stringArg,
	nonNull,
	idArg,
	intArg,
	enumType,
} from 'nexus';

export const WatchStatusTypes = enumType({
	name: 'WatchStatusTypes',
	members: [
		'NOT_WATCHING',
		'WATCHING',
		'PLAN_TO_WATCH',
		'COMPLETED',
		'ON_HOLD',
		'DROPPED',
	],
});

export const UserMovie = objectType({
	name: 'UserMovie',
	definition(t) {
		t.id('id');
		t.string('name');
		t.field('status', {
			type: 'WatchStatusTypes',
		});
		t.int('rating');
	},
});

export const UserShow = objectType({
	name: 'UserShow',
	definition(t) {
		t.id('id');
		t.string('name');
		t.field('status', {
			type: 'WatchStatusTypes',
		});
		t.int('rating');
		t.int('current_episode');
	},
});

export const User = objectType({
	name: 'User',
	definition(t) {
		t.id('id');
		t.string('name');
		t.string('email');
		t.date('emailVerified');
		t.string('image');
		t.string('password');
		t.date('created_at');
		t.list.field('movies', {
			type: 'UserMovie',
		});
		t.list.field('shows', {
			type: 'UserShow',
		});
	},
});

export const ErrorRes = objectType({
	name: 'ErrorRes',
	definition(t) {
		t.nonNull.string('message');
	},
});

export const RegisteredUserRes = objectType({
	name: 'RegisteredUserRes',
	definition(t) {
		t.list.field('errors', {
			type: 'ErrorRes',
		});
		t.field('createdUser', {
			type: 'User',
		});
	},
});

export const RedisRes = objectType({
	name: 'RedisRes',
	definition(t) {
		t.list.nullable.field('errors', {
			type: 'ErrorRes',
		});
		t.field('token', {
			type: 'String',
		});
		t.field('userId', {
			type: 'String',
		});
	},
});

export const AccountVerifiedRes = objectType({
	name: 'AccountVerifiedRes',
	definition(t) {
		t.list.nullable.field('errors', {
			type: 'ErrorRes',
		});
		t.field('id', {
			type: 'String',
		});
		t.field('emailVerified', {
			type: 'DateTime',
		});
	},
});

export const NodeRes = objectType({
	name: 'NodeRes',
	definition(t) {
		t.list.nullable.field('errors', {
			type: 'ErrorRes',
		});
	},
});

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
			},
			resolve: async (_parent, { token }, ctx) => {
				const userId = await ctx.redis.get(
					`${EMAIL_VERIFICATION_PREFIX}:${token}`
				);

				if (!userId) {
					return {
						errors: [{ message: 'Email Verification Not Found.' }],
						token: null,
						userId: null,
					};
				}

				return {
					errors: null,
					token,
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

				if (acct?.id && !acct.emailVerified) {
					return {
						errors: [{ message: 'Account Not Verified' }],
						id: acct.id,
						emailVerified: null,
					};
				}

				if (acct?.id && acct.emailVerified) {
					return {
						errors: null,
						id: acct.id,
						emailVerified: acct.emailVerified,
					};
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
					`${EMAIL_VERIFICATION_PREFIX}:${token}`
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
		t.field('checkRetryEmailVerificationLimit', {
			type: 'RedisRes',
			args: {
				email: nonNull(stringArg()),
			},
			resolve: async (_parent, { email }, ctx) => {
				const limitFound: string | null = await ctx.redis.get(
					`${VERIFICATION_EMAIL_COUNT_PREFIX}:${email}`
				);

				if (!limitFound) {
					return {
						errors: null,
						token: null,
						userId: null,
					};
				}

				return {
					errors: null,
					userId: null,
					token: limitFound,
				};
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
						errors: null,
						createdUser: newUser,
					};
				} catch (err) {
					console.error(err);
					return {
						errors: [{ message: 'Error while trying to register user' }],
						createdUser: null,
					};
				}
			},
		});
		t.field('writeEmailVerificationToken', {
			type: 'RedisRes',
			args: {
				email: nonNull(stringArg()),
			},
			resolve: async (_parent, { email }, ctx) => {
				const user = await ctx.prisma.user.findUnique({
					where: { email },
					select: { id: true },
				});

				if (!user) {
					return {
						errors: [{ message: 'User not found.' }],
						token: null,
						userId: null,
					};
				}

				// ?delete previous email verification if exists

				const token = v4();

				await ctx.redis.set(
					`${EMAIL_VERIFICATION_PREFIX}:${token}`,
					user.id,
					'EX',
					60 * 60 * 24 * 3 // 3 days
				);

				const verificationEmailCount = await ctx.redis.get(
					`${VERIFICATION_EMAIL_COUNT_PREFIX}:${email}`
				);

				await ctx.redis.set(
					`${VERIFICATION_EMAIL_COUNT_PREFIX}:${email}`,
					!verificationEmailCount
						? '1'
						: (+verificationEmailCount + 1).toString(),
					'EX',
					60 * 60 * 24 * 3 // 3 days
				);

				return {
					errors: null,
					token,
					userId: user.id,
				};
			},
		});
		t.field('deleteEmailVerificationToken', {
			type: 'RedisRes',
			args: {
				token: nonNull(stringArg()),
			},
			resolve: async (_parent, { token }, ctx) => {
				const deletedEmailVerification = await ctx.redis.del(
					`${EMAIL_VERIFICATION_PREFIX}:${token}`
				);

				if (!deletedEmailVerification) {
					return {
						errors: [{ message: 'Unable to delete email verification.' }],
						token: null,
						userId: null,
					};
				}

				return {
					errors: null,
					token: null,
					userId: null,
				};
			},
		});
		t.field('verifyUserEmail', {
			type: 'Int',
			args: {
				userId: nonNull(idArg()),
			},
			resolve: async (_parent, { userId }, ctx) => {
				const verifiedUserEmail = await ctx.prisma.user.update({
					where: { id: userId },
					data: {
						emailVerified: new Date(),
					},
				});

				if (!verifiedUserEmail) return 404;

				return 200;
			},
		});
		t.field('writeRetryEmailVerificationLimit', {
			type: 'RedisRes',
			args: {
				email: nonNull(stringArg()),
			},
			resolve: async (_parent, { email }, ctx) => {
				let currNum = await ctx.redis.get(
					`${VERIFICATION_EMAIL_COUNT_PREFIX}:${email}`
				);

				if (!currNum) {
					currNum = '0';
				}

				await ctx.redis.set(
					`${VERIFICATION_EMAIL_COUNT_PREFIX}:${email}`,
					(+currNum + 1).toString(),
					'EX',
					60 * 60 * 24 * 3 // 3 days
				);

				return {
					errors: null,
					token: (+currNum + 1).toString(),
				};
			},
		});
		t.field('sendVerificationEmail', {
			type: 'NodeRes',
			args: {
				recipientEmail: nonNull(stringArg()),
				subject: nonNull(stringArg()),
				text: nonNull(stringArg()),
				html: nonNull(stringArg()),
			},
			resolve: async (_parent, { recipientEmail, subject, text, html }) => {
				if (!CommonMethods.isValidEmail(recipientEmail)) {
					return {
						errors: [{ message: 'Please provide a valid email address' }],
					};
				}

				try {
					let transporterConfig: SMTPTransport.Options = {};

					if (process.env.NODE_ENV === 'development') {
						nodemailer.createTestAccount(async (_err, account) => {
							transporterConfig = {
								host: 'smtp.ethereal.email',
								port: 587,
								secure: false,
								auth: {
									user: account.user,
									pass: account.pass,
								},
							};

							const transporter = nodemailer.createTransport(transporterConfig);

							const info = await transporter.sendMail({
								from: process.env.EMAIL_FROM,
								to: recipientEmail,
								subject,
								text,
								html,
							});

							console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
						});
					} else if (process.env.NODE_ENV === 'production') {
						transporterConfig = {
							host: process.env.EMAIL_SERVER_HOST,
							port: Number(process.env.EMAIL_SERVER_PORT as string),
							secure: Number(process.env.EMAIL_SERVER_PORT) === 465, // true for 465, false for other ports
							auth: {
								user: process.env.EMAIL_SERVER_USER,
								pass: process.env.EMAIL_SERVER_PASSWORD,
							},
						};
						const transporter = nodemailer.createTransport(transporterConfig);
						await transporter.sendMail({
							from: process.env.EMAIL_FROM,
							to: recipientEmail,
							subject,
							text,
							html,
						});
					}

					return {
						errors: null,
					};
				} catch (err) {
					console.error(err);
					return {
						errors: [{ message: 'Error while sending verification email' }],
					};
				}
			},
		});
	},
});
