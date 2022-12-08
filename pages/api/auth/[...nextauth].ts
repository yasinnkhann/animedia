import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import TwitterProvider from 'next-auth/providers/twitter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';
import { compare } from 'bcryptjs';
import { isValidEmail } from '../../../utils/isValidEmail';

const adapter = PrismaAdapter(prisma);
const _linkAccount = adapter.linkAccount;
adapter.linkAccount = ({ oauth_token, oauth_token_secret, ...data }) => {
	if (oauth_token && oauth_token_secret) {
		data.refresh_token = oauth_token as string;
		data.access_token = oauth_token_secret as string;
	}

	return _linkAccount(data);
};

export const authOptions: NextAuthOptions = {
	adapter,
	debug: process.env.NODE_ENV === 'development',
	secret: process.env.NEXTAUTH_SECRET,

	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),

		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID as string,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
		}),

		TwitterProvider({
			clientId: process.env.TWITTER_CLIENT_ID as string,
			clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
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
			authorize: async (credentials, _req: any) => {
				if (!isValidEmail(credentials?.email) || !credentials?.password) {
					return;
				}
				// check user existence
				const result: any = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (!result) {
					return;
				}

				// compare()
				const checkPassword = await compare(
					credentials.password,
					result.password
				);

				// incorrect password
				if (!checkPassword || result.email !== credentials.email) {
					return;
				}

				return result;
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
		signIn: async ({ user, account, profile, email, credentials }) => {
			return true;
		},

		// Getting the JWT token from API response
		jwt: async ({ token, user, account, profile, isNewUser }) => {
			// console.log('PROFILE IN JWT: ', profile);
			// console.log('account IN JWT: ', account);
			// console.log('IS NEW USER IN JWT CB: ', !!isNewUser);
			if (user) {
				token.jwt = (user as any)?.access_token;
				token.user = user;
				(token.user as any).provider = account?.provider;
				// console.log('USER IN JWT CB: ', user);
				// console.log('TOKEN IN JWT CB: ', token);

				if ((profile as any)?.email_verified && user?.id) {
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

			(session as any).jwt = token.jwt;
			(session as any).user = token.user;
			// console.log('TOKEN IN SESSION CB: ', token);
			// console.log('SESSION IN SESSION CB: ', session);

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
