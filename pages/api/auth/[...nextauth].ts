import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';

const cookiesPolicy =
	process.env.NODE_ENV === 'development'
		? {
				sessionToken: {
					name: `_Secure_next-auth.session-token`,
					options: {
						httpOnly: true,
						sameSite: 'None',
						path: '/',
						secure: true,
					},
				},
		  }
		: {};

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	debug: process.env.NODE_ENV === 'development',
	cookies: cookiesPolicy,
	callbacks: {
		jwt: ({ token, user }) => {
			if (user) {
				token.id = user.id;
			}
			// console.log('TOKEN in JWT CB: ', token);
			return Promise.resolve(token);
		},
		session: async ({ session, user, token }) => {
			if (token) {
				console.log('TOKEN IN SESSION CB: ', token);
			}
			return Promise.resolve({
				...session,
				user: user,
			});
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
