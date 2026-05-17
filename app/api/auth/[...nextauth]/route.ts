import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../../lib/prisma';
import { verify } from 'argon2';
import { CommonMethods } from '../../../../utils/CommonMethods';
import * as Sentry from '@sentry/nextjs';
import logger from '../../../../lib/logger';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	debug: process.env.NEXTAUTH_DEBUG === 'true',
	secret: process.env.NEXTAUTH_SECRET,

	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),

		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
		}),

		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID!,
			clientSecret: process.env.DISCORD_CLIENT_SECRET!,
		}),

		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: {
					label: 'Email',
					type: 'text',
					placeholder: 'myemail@gmail.com',
				},
				password: { label: 'Password', type: 'password' },
			},
			authorize: async (credentials, _req) => {
				if (!CommonMethods.isValidEmail(credentials?.email) || !credentials?.password) {
					return null;
				}
				try {
					const result: any = await prisma.user.findUnique({
						where: { email: credentials.email },
					});

					if (!result) return null;

					const checkPassword = await verify(result.password, credentials.password);

					if (!checkPassword || result.email !== credentials.email) {
						return null;
					}
					return result;
				} catch (err) {
					logger.error('Authentication error during credential verification', {
						email: credentials.email,
						error: err,
					});
					Sentry.captureException(err);
					return null;
				}
			},
		}),
	],

	pages: {
		signIn: '/auth/login',
	},

	jwt: {
		secret: process.env.JWT_SECRET,
	},

	callbacks: {
		signIn: async _info => {
			return true;
		},

		jwt: async ({ token, user, account, profile }) => {
			try {
				if (user) {
					if ((profile as any)?.email_verified && user.id) {
						const isEmailVerifiedUpdated = await prisma.user.findUnique({
							where: { id: user.id },
							select: { emailVerified: true },
						});

						if (!isEmailVerifiedUpdated?.emailVerified) {
							await prisma.user.update({
								where: { id: user.id },
								data: {
									emailVerified: new Date(),
								},
							});
						}
					}
					token.user = user;
					delete (token.user as any).password;
				}

				if (account) {
					token.account = account;
				}

				if (profile) {
					token.profile = profile;
				}

				return Promise.resolve(token);
			} catch (err) {
				Sentry.captureException(err);
				return token;
			}
		},

		session: async ({ session, token }) => {
			try {
				const tokenUser = token.user as any;

				if (tokenUser?.id && !tokenUser.emailVerified) {
					const isEmailVerifiedUpdatedInDB = await prisma.user.findUnique({
						where: { id: tokenUser.id },
						select: { emailVerified: true },
					});

					if (isEmailVerifiedUpdatedInDB?.emailVerified) {
						tokenUser.emailVerified = isEmailVerifiedUpdatedInDB?.emailVerified;
					}
				}

				(session as any).user = tokenUser;
				(session as any).account = token.account;
				(session as any).profile = token.profile;

				return Promise.resolve(session);
			} catch (err) {
				Sentry.captureException(err);
				return session;
			}
		},
	},

	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60,
		updateAge: 24 * 60 * 60,
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
