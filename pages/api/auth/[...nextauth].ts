import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		EmailProvider({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: '/signin',
	},
	debug: process.env.NODE_ENV === 'development',
	callbacks: {
		// jwt: ({ token, user }) => {
		// 	if (user) {
		// 		token.id = user.id;
		// 	}

		// 	return token;
		// },
		// Includes user.id on session, will be available on session.id but no intellisense
		session: ({ session, user, token }) => {
			session.id = user.id;
			// if (token) {
			// 	session.id = token.id;
			// }
			return Promise.resolve(session);
		},
	},
};

export default NextAuth(authOptions);
