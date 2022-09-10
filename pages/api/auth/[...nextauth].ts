import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';

export const authOptions: NextAuthOptions = {
	// Includes user.id on session, will be available on session.id but no intellisense
	callbacks: {
		session({ session, user }) {
			session.id = user.id;
			return Promise.resolve(session);
		},
	},
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		// ...add more providers here
	],
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: '/signin',
	},
};

export default NextAuth(authOptions);
