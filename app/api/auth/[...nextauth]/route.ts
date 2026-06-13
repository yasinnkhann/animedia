import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@lib/prisma';
import { verify } from 'argon2';
import { CommonMethods } from '../../../../utils/CommonMethods';
import * as Sentry from '@sentry/nextjs';
import logger from '@lib/logger';
import { __prod__ } from '@/utils/constants';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: __prod__ ? false : true,
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
          const result = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!result || !result.password) return null;

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
    jwt: async ({ token, user, account, profile }) => {
      try {
        if (user) {
          if (profile?.email_verified && user.id) {
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
          delete token.user.password;
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
        const tokenUser = token.user;

        if (tokenUser?.id && !tokenUser.emailVerified) {
          const isEmailVerifiedUpdatedInDB = await prisma.user.findUnique({
            where: { id: tokenUser.id },
            select: { emailVerified: true },
          });

          if (isEmailVerifiedUpdatedInDB?.emailVerified) {
            tokenUser.emailVerified = isEmailVerifiedUpdatedInDB?.emailVerified;
          }
        }

        if (tokenUser) {
          session.user = {
            ...session.user,
            ...tokenUser,
            id: tokenUser.id || '',
            created_at: tokenUser.created_at || new Date(),
            emailVerified: tokenUser.emailVerified || null,
          };
        }
        session.account = token.account;
        session.profile = token.profile;

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
