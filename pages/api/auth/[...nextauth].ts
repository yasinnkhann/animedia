import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	debug: process.env.NODE_ENV === 'development',
	callbacks: {
		jwt: ({ token, user }) => {
			if (user) {
				token.id = user.id;
			}
			// console.log('TOKEN in JWT: ', token);
			return Promise.resolve(token);
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
			return Promise.resolve(session);
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
