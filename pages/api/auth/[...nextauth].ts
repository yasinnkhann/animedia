import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: 'Credentials',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				username: {
					label: 'Email',
					type: 'email',
					placeholder: 'johndoe@gmail.com',
				},
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, req) {
				if (
					credentials?.username === 'john@gmail.com' &&
					credentials.password === 'test'
				) {
					return {
						id: 2,
						name: 'John',
						email: 'johndoe@gmail.com',
					};
				}
				return null;
			},
		}),
		// EmailProvider({
		// 	server: process.env.EMAIL_SERVER,
		// 	from: process.env.EMAIL_FROM,
		// }),
	],

	debug: process.env.NODE_ENV === 'development',
	callbacks: {
		jwt: ({ token, user }) => {
			if (user) {
				token.id = user.id;
			}
			// console.log('TOKEN in JWT: ', token);
			return token;
		},

		// Includes user.id on session, will be available on session.id but no intellisense
		session: ({ session, user, token }) => {
			console.log('TOKEN in SESSION: ', token);
			if (token) {
				session.id = token.id;
			} else {
				session.id = user.id;
			}
			// console.log('SESSION: ', session);
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	jwt: {
		secret: process.env.JWT_SECRET,
	},
	// pages: {
	// 	signIn: '/signin',
	// },
};

export default NextAuth(authOptions);
