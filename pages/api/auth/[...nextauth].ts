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
		// Includes user.id on session, will be available on session.id but no intellisense
		session: ({ session, user }) => {
			if (user) {
				session.id = user.id;
			}
			// console.log('SESSION CB: ', session);
			return Promise.resolve(session);
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	// pages: {
	// 	signIn: '/signin',
	// },
};

export default NextAuth(authOptions);
