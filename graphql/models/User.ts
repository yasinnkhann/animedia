import { builder } from '../builder';
import { v4 } from 'uuid';
import { hash } from 'bcryptjs';
import nodemailer, { Transport, TransportOptions } from 'nodemailer';
import { isValidEmail } from '../../utils/isValidEmail';
import {
	EMAIL_VERIFICATION_PREFIX,
	RETRY_EMAIL_VERIFICATION_PREFIX,
} from 'utils/constants';
import {
	AccountVerifiedRes,
	HttpRes,
	RedisRes,
	RegisteredUserRes,
} from '../../models/entities';

const WatchStatusTypes = builder.enumType('WatchStatusTypes', {
	values: [
		'NOT_WATCHING',
		'WATCHING',
		'PLAN_TO_WATCH',
		'COMPLETED',
		'ON_HOLD',
		'DROPPED',
	] as const,
});

builder.prismaObject('Movie', {
	name: 'UsersMovie',
	fields: t => ({
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		status: t.field({
			type: WatchStatusTypes,
			resolve: root => root.status,
		}),
		rating: t.exposeInt('rating', { nullable: true }),
	}),
});

builder.prismaObject('Show', {
	name: 'UsersShow',
	fields: t => ({
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		status: t.field({
			type: WatchStatusTypes,
			resolve: root => root.status,
		}),
		rating: t.exposeInt('rating', { nullable: true }),
		currentEpisode: t.exposeInt('current_episode'),
	}),
});

builder.prismaObject('User', {
	fields: t => ({
		id: t.exposeID('id'),
		name: t.exposeString('name', { nullable: true }),
		email: t.exposeString('email', { nullable: true }),
		password: t.exposeString('password', { nullable: true }),
		image: t.exposeString('image', { nullable: true }),
		createdAt: t.expose('created_at', { type: 'Date' }),
		emailVerified: t.expose('emailVerified', { type: 'Date', nullable: true }),
		movies: t.relation('movies'),
		shows: t.relation('shows'),
	}),
});

builder.objectType(RegisteredUserRes, {
	name: 'RegisteredUserRes',
	fields: t => ({
		error: t.exposeString('error', { nullable: true }),
		createdUser: t.prismaField({
			type: 'User',
			nullable: true,
			resolve: (_query, root) => root.createdUser,
		}),
		ok: t.exposeBoolean('ok'),
		statusCode: t.exposeInt('statusCode'),
	}),
});

builder.objectType(RedisRes, {
	name: 'RedisRes',
	fields: t => ({
		error: t.exposeString('error', { nullable: true }),
		successMsg: t.exposeString('successMsg', { nullable: true }),
		token: t.exposeString('token', { nullable: true }),
		userId: t.exposeID('userId', { nullable: true }),
	}),
});

builder.objectType(AccountVerifiedRes, {
	name: 'AccountVerifiedRes',
	fields: t => ({
		error: t.exposeString('error', { nullable: true }),
		id: t.exposeID('id', { nullable: true }),
		emailVerified: t.expose('emailVerified', { type: 'Date', nullable: true }),
	}),
});

builder.objectType(HttpRes, {
	name: 'HttpRes',
	fields: t => ({
		error: t.exposeString('error', { nullable: true }),
		successMsg: t.exposeString('successMsg', { nullable: true }),
		ok: t.exposeBoolean('ok'),
		statusCode: t.exposeInt('statusCode'),
	}),
});

builder.queryFields(t => ({
	user: t.prismaField({
		type: 'User',
		nullable: true,
		args: {
			id: t.arg.id(),
		},
		resolve: async (query, _root, { id }, ctx) => {
			return await ctx.prisma.user.findUnique({
				...query,
				where: { id: typeof id === 'number' ? id.toString() : id },
				include: {
					movies: true,
					shows: true,
				},
			});
		},
	}),
	usersMovie: t.prismaField({
		type: 'Movie',
		nullable: true,
		args: {
			movieId: t.arg.id(),
		},
		resolve: async (query, _root, { movieId }, ctx) => {
			return await ctx.prisma.movie.findUnique({
				...query,
				where: {
					id_userId: {
						id: typeof movieId === 'number' ? movieId.toString() : movieId,
						userId: ctx.session!.user?.id!,
					},
				},
			});
		},
	}),
	usersShow: t.prismaField({
		type: 'Show',
		nullable: true,
		args: {
			showId: t.arg.id(),
		},
		resolve: async (query, _root, { showId }, ctx) => {
			return await ctx.prisma.show.findUnique({
				...query,
				where: {
					id_userId: {
						id: typeof showId === 'number' ? showId.toString() : showId,
						userId: ctx.session!.user?.id!,
					},
				},
			});
		},
	}),
	usersMovies: t.prismaField({
		type: ['Movie'],
		nullable: true,
		resolve: async (query, _root, _args, ctx) => {
			return await ctx.prisma.movie.findMany({
				...query,
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
	}),
	usersShows: t.prismaField({
		type: ['Show'],
		nullable: true,
		resolve: async (query, _root, _args, ctx) => {
			return await ctx.prisma.show.findMany({
				...query,
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
	}),
	checkEmailVerificationToken: t.field({
		type: RedisRes,
		args: {
			token: t.arg.string(),
		},
		resolve: async (_root, { token }, ctx) => {
			const userId = await ctx.redis.get(
				`${EMAIL_VERIFICATION_PREFIX}-${token}`
			);

			if (!userId) {
				return new RedisRes('Email Verification Not Found.', null, null, null);
			}

			return new RedisRes(null, 'Valid EMAIL VERIFICATION.', token, userId);
		},
	}),
	accountVerified: t.field({
		type: AccountVerifiedRes,
		args: {
			email: t.arg.string(),
		},
		resolve: async (_root, { email }, ctx) => {
			const acct = await ctx.prisma.user.findUnique({
				where: { email },
				select: { id: true, emailVerified: true },
			});

			if (acct?.id && !acct.emailVerified) {
				return new AccountVerifiedRes('Account Not Verified', acct.id, null);
			}

			if (acct?.id && acct.emailVerified) {
				return new AccountVerifiedRes(null, acct.id, acct.emailVerified);
			}

			return new AccountVerifiedRes('Account Not Found', null, null);
		},
	}),
	emailFromRedisToken: t.string({
		nullable: true,
		args: {
			token: t.arg.string(),
		},
		resolve: async (_root, { token }, ctx) => {
			const userId = await ctx.redis.get(
				`${EMAIL_VERIFICATION_PREFIX}-${token}`
			);

			if (!userId) return null;

			const user = await ctx.prisma.user.findUnique({
				where: { id: userId },
				select: { email: true },
			});

			if (!user?.email) return null;

			return user.email;
		},
	}),
	checkRetryEmailVerificationLimit: t.field({
		type: RedisRes,
		args: {
			email: t.arg.string(),
		},
		resolve: async (_root, { email }, ctx) => {
			const limitFound = await ctx.redis.get(
				`${RETRY_EMAIL_VERIFICATION_PREFIX}-${email}`
			);

			if (!limitFound) {
				return new RedisRes(
					'Retry Email Verification Limit Not Found',
					null,
					null
				);
			}

			return new RedisRes(
				null,
				'Retry Email Verification Limit Found',
				limitFound
			);
		},
	}),
}));

builder.mutationFields(t => ({
	addMovie: t.field({
		type: HttpRes,
		args: {
			movieId: t.arg.id(),
			movieName: t.arg.string(),
			watchStatus: t.arg({
				type: WatchStatusTypes,
			}),
		},
		resolve: async (_root, { movieId, movieName, watchStatus }, ctx) => {
			try {
				await ctx.prisma.user.update({
					where: { id: ctx.session!.user?.id! },
					data: {
						movies: {
							create: {
								id: typeof movieId === 'number' ? movieId.toString() : movieId,
								name: movieName,
								status: watchStatus,
							},
						},
					},
				});
				return new HttpRes(null, 'Movie added', true, 200);
			} catch (err) {
				console.error(err);
				return new HttpRes('Could not add movie', null, false, 400);
			}
		},
	}),
	addShow: t.field({
		type: HttpRes,
		args: {
			showId: t.arg.id(),
			showName: t.arg.string(),
			watchStatus: t.arg({
				type: WatchStatusTypes,
			}),
			currentEpisode: t.arg.int({ required: false }),
		},
		resolve: async (
			_root,
			{ showId, showName, watchStatus, currentEpisode },
			ctx
		) => {
			try {
				await ctx.prisma.user.update({
					where: { id: ctx.session!.user?.id! },
					data: {
						shows: {
							create: {
								id: typeof showId === 'number' ? showId.toString() : showId,
								name: showName,
								status: watchStatus,
								current_episode: currentEpisode ?? undefined,
							},
						},
					},
				});
				return new HttpRes(null, 'Show added', true, 200);
			} catch (err) {
				console.error(err);
				return new HttpRes('Could not add show', null, false, 400);
			}
		},
	}),
	updateMovie: t.field({
		type: HttpRes,
		args: {
			movieId: t.arg.id(),
			watchStatus: t.arg({
				type: WatchStatusTypes,
			}),
			movieRating: t.arg.int({ required: false }),
		},
		resolve: async (_root, { movieId, watchStatus, movieRating }, ctx) => {
			try {
				await ctx.prisma.movie.update({
					where: {
						id_userId: {
							id: typeof movieId === 'number' ? movieId.toString() : movieId,
							userId: ctx.session!.user?.id!,
						},
					},
					data: {
						status: watchStatus,
						rating: movieRating ? movieRating : null,
					},
				});
				return new HttpRes(null, 'Movie updated', true, 200);
			} catch (err) {
				console.error(err);
				return new HttpRes('Could not update movie', null, false, 400);
			}
		},
	}),
	updateShow: t.field({
		type: HttpRes,
		args: {
			showId: t.arg.id(),
			watchStatus: t.arg({
				type: WatchStatusTypes,
			}),
			showRating: t.arg.int({ required: false }),
			currentEpisode: t.arg.int({ required: false }),
		},
		resolve: async (
			_root,
			{ showId, watchStatus, showRating, currentEpisode },
			ctx
		) => {
			try {
				await ctx.prisma.show.update({
					where: {
						id_userId: {
							id: typeof showId === 'number' ? showId.toString() : showId,
							userId: ctx.session!.user?.id!,
						},
					},
					data: {
						status: watchStatus,
						rating: showRating ? showRating : null,
						current_episode: currentEpisode ?? undefined,
					},
				});
				return new HttpRes(null, 'Show updated', true, 200);
			} catch (err) {
				console.error(err);
				return new HttpRes('Could not update show', null, false, 400);
			}
		},
	}),
	deleteMovie: t.field({
		type: HttpRes,
		args: {
			movieId: t.arg.id(),
		},
		resolve: async (_root, { movieId }, ctx) => {
			try {
				await ctx.prisma.movie.delete({
					where: {
						id_userId: {
							id: typeof movieId === 'number' ? movieId.toString() : movieId,
							userId: ctx.session?.user?.id!,
						},
					},
				});
				return new HttpRes(null, 'Movie deleted', true, 200);
			} catch (err) {
				console.error(err);
				return new HttpRes('Could not delete movie', null, false, 400);
			}
		},
	}),
	deleteShow: t.field({
		type: HttpRes,
		args: {
			showId: t.arg.id(),
		},
		resolve: async (_root, { showId }, ctx) => {
			try {
				await ctx.prisma.show.delete({
					where: {
						id_userId: {
							id: typeof showId === 'number' ? showId.toString() : showId,
							userId: ctx.session?.user?.id!,
						},
					},
				});
				return new HttpRes(null, 'Show deleted', true, 200);
			} catch (err) {
				console.error(err);
				return new HttpRes('Could not delete show', null, false, 400);
			}
		},
	}),
	registerUser: t.field({
		type: RegisteredUserRes,
		args: {
			name: t.arg.string(),
			email: t.arg.string(),
			password: t.arg.string(),
		},
		resolve: async (_root, { name, email, password }, ctx) => {
			try {
				const existingUser = await ctx.prisma.user.findUnique({
					where: { email },
				});

				if (existingUser) {
					return new RegisteredUserRes(
						'Email Already Exists',
						null,
						false,
						422
					);
				}
				const newUser = await ctx.prisma.user.create({
					data: { name, email, password: await hash(password, 12) },
				});
				return new RegisteredUserRes(null, newUser, true, 201);
			} catch (err) {
				console.error(err);
				return new RegisteredUserRes(
					'Error while registering user',
					null,
					false,
					500
				);
			}
		},
	}),
	writeEmailVerificationToken: t.field({
		type: RedisRes,
		args: {
			email: t.arg.string(),
		},
		resolve: async (_root, { email }, ctx) => {
			const user = await ctx.prisma.user.findUnique({
				where: { email },
				select: { id: true },
			});

			if (!user) {
				return new RedisRes('User not found', null, null, null);
			}

			const token = v4();

			await ctx.redis.set(
				`${EMAIL_VERIFICATION_PREFIX}-${token}`,
				user.id,
				'EX',
				1000 * 60 * 60 * 24 * 3 // 3 days
			);

			return new RedisRes(
				null,
				'Email Verification Token Added',
				token,
				user.id
			);
		},
	}),
	deleteEmailVerificationToken: t.field({
		type: RedisRes,
		args: {
			token: t.arg.string(),
		},
		resolve: async (_root, { token }, ctx) => {
			const deletedEmailVerification = await ctx.redis.del(
				`${EMAIL_VERIFICATION_PREFIX}-${token}`
			);

			if (!deletedEmailVerification) {
				return new RedisRes('Unable to delete email verification', null);
			}

			return new RedisRes(null, 'Successfully deleted email verification');
		},
	}),
	verifyUserEmail: t.field({
		type: HttpRes,
		args: {
			userId: t.arg.id(),
		},
		resolve: async (_root, { userId }, ctx) => {
			const verifiedUserEmail = await ctx.prisma.user.update({
				where: { id: typeof userId === 'number' ? userId.toString() : userId },
				data: {
					emailVerified: new Date(),
				},
			});

			if (!verifiedUserEmail) {
				return new HttpRes('Error verifying email', null, false, 404);
			}

			return new HttpRes(null, 'Email is verified', true, 200);
		},
	}),
	writeRetryEmailVerificationLimit: t.field({
		type: RedisRes,
		args: {
			email: t.arg.string(),
		},
		resolve: async (_root, { email }, ctx) => {
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

			return new RedisRes(
				null,
				'Retry Email Verification Limit Added',
				(+currNum + 1).toString()
			);
		},
	}),
	sendVerificationEmail: t.field({
		type: HttpRes,
		args: {
			recipientEmail: t.arg.string(),
			subject: t.arg.string(),
			text: t.arg.string(),
			html: t.arg.string(),
		},
		resolve: async (_root, { recipientEmail, subject, text, html }) => {
			if (!isValidEmail(recipientEmail)) {
				return new HttpRes(
					'Please provide a valid email address',
					null,
					false,
					400
				);
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

				return new HttpRes(null, 'EMAIL VERIFICATION SENT!', true, 201);
			} catch (err) {
				console.error(err);
				return new HttpRes(
					'Error while sending verification email',
					null,
					false,
					500
				);
			}
		},
	}),
}));
