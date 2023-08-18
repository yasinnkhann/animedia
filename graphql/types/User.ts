import { v4 } from 'uuid';
import {
	objectType,
	extendType,
	stringArg,
	nonNull,
	idArg,
	intArg,
	enumType,
} from 'nexus';
import { hash } from 'bcryptjs';
import nodemailer, { Transport, TransportOptions } from 'nodemailer';
import { isValidEmail } from '../../utils/isValidEmail';
import {
	EMAIL_VERIFICATION_PREFIX,
	RETRY_EMAIL_VERIFICATION_PREFIX,
} from 'utils/constants';

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

export const UserRes = objectType({
	name: 'UserRes',
	definition(t) {
		t.id('id');
		t.string('name');
		t.string('email');
		t.string('password');
		t.string('image');
		t.date('created_at');
		t.date('emailVerified');
		t.list.field('movies', {
			type: 'UserMovie',
		});
		t.list.field('shows', {
			type: 'UserShow',
		});
	},
});

export const RegisteredUserRes = objectType({
	name: 'RegisteredUserRes',
	definition(t) {
		t.field('error', {
			type: 'String',
		});
		t.field('createdUser', {
			type: 'UserRes',
		});
		t.field('ok', {
			type: 'Boolean',
		});
		t.field('statusCode', {
			type: 'Int',
		});
	},
});

export const RedisRes = objectType({
	name: 'RedisRes',
	definition(t) {
		t.field('error', {
			type: 'String',
		});
		t.field('successMsg', {
			type: 'String',
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
		t.field('error', {
			type: 'String',
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
		t.field('error', {
			type: 'String',
		});
		t.field('successMsg', {
			type: 'String',
		});
		t.field('ok', {
			type: 'Boolean',
		});
		t.field('statusCode', {
			type: 'Int',
		});
	},
});

export const UserQueries = extendType({
	type: 'Query',
	definition(t) {
		t.field('user', {
			type: 'UserRes',
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
				return await ctx.prisma.movie.findUnique({
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
				return await ctx.prisma.show.findUnique({
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
				return await ctx.prisma.movie.findMany({
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
			},
		});
		t.field('checkEmailVerificationToken', {
			type: 'RedisRes',
			args: {
				token: nonNull(stringArg()),
			},
			resolve: async (_parent, { token }, ctx) => {
				const userId = await ctx.redis.get(
					`${EMAIL_VERIFICATION_PREFIX}-${token}`
				);

				if (!userId) {
					return {
						error: 'Email Verification Not Found.',
						successMsg: null,
						token: null,
						userId: null,
					};
				}

				return {
					error: null,
					successMsg: 'Valid EMAIL VERIFICATION.',
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
						error: 'Account Not Verified',
						id: acct.id,
						emailVerified: null,
					};
				}

				if (acct?.id && acct.emailVerified) {
					return {
						error: null,
						id: acct.id,
						emailVerified: acct.emailVerified,
					};
				}

				return {
					error: 'Account Not Found',
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
					`${EMAIL_VERIFICATION_PREFIX}-${token}`
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
					`${RETRY_EMAIL_VERIFICATION_PREFIX}-${email}`
				);

				if (!limitFound) {
					return {
						error: null,
						successMsg: 'Retry Email Verification Limit Not Found',
						token: null,
					};
				}

				return {
					error: null,
					successMsg: 'Retry Email Verification Limit Found',
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
				return await ctx.prisma.movie.update({
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
				return await ctx.prisma.show.update({
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
				return await ctx.prisma.movie.delete({
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
				return await ctx.prisma.show.delete({
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
							error: 'Email Already Exists',
							createdUser: null,
							ok: false,
							statusCode: 422,
						};
					}
					const newUser = await ctx.prisma.user.create({
						data: { name, email, password: await hash(password, 12) },
					});
					return {
						error: null,
						createdUser: newUser,
						ok: true,
						statusCode: 201,
					};
				} catch (err) {
					console.error(err);
					return {
						error: `ERROR ${err}`,
						createdUser: null,
						ok: false,
						statusCode: 500,
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
						error: 'User not found.',
						successMsg: null,
						token: null,
						userId: null,
					};
				}

				const token = v4();

				await ctx.redis.set(
					`${EMAIL_VERIFICATION_PREFIX}-${token}`,
					user.id,
					'EX',
					1000 * 60 * 60 * 24 * 3 // 3 days
				);

				return {
					error: null,
					successMsg: 'Email Verification Token Added',
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
					`${EMAIL_VERIFICATION_PREFIX}-${token}`
				);

				if (!deletedEmailVerification) {
					return {
						error: 'Unable to delete email verification.',
						successMsg: null,
						token: null,
						userId: null,
					};
				}

				return {
					error: null,
					successMsg: 'Successfully deleted email verification.',
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
					`${RETRY_EMAIL_VERIFICATION_PREFIX}-${email}`
				);

				if (!currNum) {
					currNum = '0';
				}

				await ctx.redis.set(
					`${RETRY_EMAIL_VERIFICATION_PREFIX}-${email}`,
					(+currNum + 1).toString(),
					'EX',
					1000 * 60 * 60 * 24 * 1 // 1 day
				);

				return {
					error: null,
					successMsg: 'Retry Email Verification Limit Added',
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
				if (!isValidEmail(recipientEmail)) {
					return {
						error: 'Please provide a valid email address',
						successMsg: null,
						ok: false,
						statusCode: 400,
					};
				}

				const transporter = nodemailer.createTransport({
					host: process.env.EMAIL_SERVER_HOST,
					port: process.env.EMAIL_SERVER_PORT,
					secure: false, // true for 465, false for other ports
					auth: {
						user: process.env.EMAIL_SERVER_USER,
						pass: process.env.EMAIL_SERVER_PASSWORD,
					},
				} as TransportOptions | Transport<unknown>);

				try {
					await transporter.sendMail({
						from: process.env.EMAIL_FROM, // verified sender email
						to: recipientEmail, // recipient email
						subject, // Subject line
						text, // plain text body
						html, // html body
					});

					return {
						error: null,
						successMsg: 'EMAIL VERIFICATION SENT!',
						ok: true,
						statusCode: 201,
					};
				} catch (err) {
					console.error(err);
					return {
						error: `ERROR ${err}`,
						successMsg: null,
						ok: false,
						statusCode: 500,
					};
				}
			},
		});
	},
});
