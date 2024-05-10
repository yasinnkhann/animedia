import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';
import { verify } from 'argon2';
import { CommonMethods } from '../../../utils/CommonMethods';
import { __prod__ } from 'utils/constants';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	debug: !__prod__,
	secret: process.env.NEXTAUTH_SECRET,

	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),

		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
		}),

		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
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
				if (
					!CommonMethods.isValidEmail(credentials?.email) ||
					!credentials?.password
				) {
					return;
				}
				try {
					const result: any = await prisma.user.findUnique({
						where: { email: credentials.email },
					});

					if (!result) return;

					const checkPassword = await verify(
						result.password,
						credentials.password
					);

					if (!checkPassword || result.email !== credentials.email) {
						return;
					}
					return result;
				} catch (err) {
					console.error(err);
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

		// Getting the JWT token from API response
		jwt: async ({ token, user, account, profile }) => {
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
		},

		session: async ({ session, token }) => {
			if ((token.user as any).id && !(token.user as any).emailVerified) {
				const isEmailVerifiedUpdatedInDB = await prisma.user.findUnique({
					where: { id: (token.user as any).id },
					select: { emailVerified: true },
				});

				if (isEmailVerifiedUpdatedInDB?.emailVerified) {
					(token.user as any).emailVerified =
						isEmailVerifiedUpdatedInDB?.emailVerified;
				}
			}

			(session as any).user = token.user;
			(session as any).account = token.account;
			(session as any).profile = token.profile;

			return Promise.resolve(session);
		},
	},

	session: {
		// Choose how you want to save the user session.
		// The default is `"jwt"`, an encrypted JWT (JWE) in the session cookie.
		// If you use an `adapter` however, we default it to `"database"` instead.
		// You can still force a JWT session by explicitly defining `"jwt"`.
		// When using `"database"`, the session cookie will only contain a `sessionToken` value,
		// which is used to look up the session in the database.
		strategy: 'jwt',

		// Seconds - How long until an idle session expires and is no longer valid.
		maxAge: 30 * 24 * 60 * 60, // 30 days

		// Seconds - Throttle how frequently to write to database to extend a session.
		// Use it to limit write operations. Set to 0 to always update the database.
		// Note: This option is ignored if using JSON Web Tokens
		updateAge: 24 * 60 * 60, // 24 hours
	},
};

export default NextAuth(authOptions);
