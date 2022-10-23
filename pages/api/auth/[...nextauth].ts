import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';
import { compare } from 'bcryptjs';

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
		// CredentialsProvider({
		// 	name: 'Credentials',
		// 	credentials: {
		// 		name: {
		// 			label: 'Name',
		// 			type: 'text',
		// 			placeholder: 'John Doe',
		// 		},
		// 		email: {
		// 			label: 'Email',
		// 			type: 'text',
		// 			placeholder: 'juan@gmail.com',
		// 		},
		// 		password: { label: 'Password', type: 'password' },
		// 	},
		// 	async authorize(credentials: any, req: any) {
		// 		// check user existence
		// 		const result: any = await prisma.registeredUser.findUnique({
		// 			where: { email: credentials.email },
		// 		});

		// 		if (!result) {
		// 			throw new Error('No user found with email. Please sign up!');
		// 		}

		// 		// compare()
		// 		const checkPassword = await compare(
		// 			credentials.password,
		// 			result.password
		// 		);

		// 		// incorrect password
		// 		if (!checkPassword || result.email !== credentials.email) {
		// 			throw new Error("Name or Password doesn't match");
		// 		}

		// 		return result;
		// 	},
		// }),
	],
	debug: process.env.NODE_ENV === 'development',
	cookies: cookiesPolicy,
	callbacks: {
		jwt: ({ token, user }) => {
			if (user) {
				token.id = user.id;
			}
			console.log('TOKEN in JWT CB: ', token);
			return Promise.resolve(token);
		},
		session: async ({ session, user, token }) => {
			if (token) {
				console.log('TOKEN IN SESSION CB: ', token);
			}
			return Promise.resolve({
				...session,
				user: user,
				token: token ?? null,
			});
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	// CAREFUL BELOW
	// session: {
	// 	strategy: 'jwt',
	// },
	jwt: {
		secret: process.env.JWT_SECRET,
	},
	// pages: {
	// 	signIn: '/login',
	// },
};

export default NextAuth(authOptions);
