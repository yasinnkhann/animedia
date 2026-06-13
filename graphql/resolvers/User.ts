import { v4 } from 'uuid';
import { hash } from 'argon2';
import { extendType, stringArg, nonNull, idArg, intArg, booleanArg } from 'nexus';
import { WatchStatusTypes } from '@graphql/models/enums';
import Mail from 'nodemailer/lib/mailer';
import { sendEmail } from '@graphql/utils';
import {
  __prod__,
  CLIENT_BASE_URL,
  VERIFICATION_EMAIL_PREFIX,
  REDIS_EXP_MAP,
  VERIFICATION_EMAIL_COUNT_LIMIT,
  VERIFICATION_EMAIL_COUNT_PREFIX,
  FORGOT_PASSWORD_EMAIL_COUNT_PREFIX,
  FORGOT_PASSWORD_EMAIL_COUNT_LIMIT,
  FORGOT_PASSWORD_EMAIL_PREFIX,
} from '@utils/constants';
import { safeResolver } from '../utils/resolver-helpers';
import {
  parseInput,
  UserIdInput,
  UserMediaInput,
  UserShowInput,
  UserGameInput,
  TokenVerificationInput,
  EmailVerificationInput,
  TokenInput,
  AddMovieInput,
  AddShowInput,
  AddGameInput,
  UpdateMovieInput,
  UpdateShowInput,
  UpdateGameInput,
  RegisterUserInput,
  ChangePasswordInput,
  EmailInput,
} from '../validations/inputs';

const getSessionUserId = (ctx: { session?: { user?: { id?: string | null } | null } | null }) => {
  const userId = ctx.session?.user?.id;

  if (!userId) {
    throw new Error('User must be authenticated.');
  }

  return userId;
};

export const UserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: 'User',
      args: {
        id: nonNull(idArg()),
      },
      resolve: safeResolver(async (_parent, { id }, ctx) => {
        const input = parseInput(UserIdInput, { id });
        return await ctx.prisma.user.findUniqueOrThrow({
          where: { id: input.id },
          include: {
            movie: true,
            show: true,
          },
        });
      }),
    });

    t.field('usersMovie', {
      type: 'UserMovie',
      args: {
        movieId: nonNull(stringArg()),
      },
      resolve: safeResolver(async (_parent, { movieId }, ctx) => {
        const input = parseInput(UserMediaInput, { movieId });
        return await ctx.prisma.movie.findUnique({
          where: {
            id_userId: {
              id: input.movieId,
              userId: getSessionUserId(ctx),
            },
          },
        });
      }),
    });

    t.field('usersShow', {
      type: 'UserShow',
      args: {
        showId: nonNull(stringArg()),
      },
      resolve: safeResolver(async (_parent, { showId }, ctx) => {
        const input = parseInput(UserShowInput, { showId });
        return await ctx.prisma.show.findUnique({
          where: {
            id_userId: {
              id: input.showId,
              userId: getSessionUserId(ctx),
            },
          },
        });
      }),
    });

    t.field('usersGame', {
      type: 'UserGame',
      args: {
        gameId: nonNull(stringArg()),
      },
      resolve: safeResolver(async (_parent, { gameId }, ctx) => {
        const input = parseInput(UserGameInput, { gameId });
        return await ctx.prisma.game.findUnique({
          where: {
            id_userId: {
              id: input.gameId,
              userId: getSessionUserId(ctx),
            },
          },
        });
      }),
    });

    t.list.field('usersMovies', {
      type: 'UserMovie',
      resolve: safeResolver(async (_parent, _args, ctx) => {
        return await ctx.prisma.movie.findMany({
          where: {
            userId: getSessionUserId(ctx),
          },
          orderBy: [
            {
              name: 'asc',
            },
          ],
        });
      }),
    });

    t.list.field('usersShows', {
      type: 'UserShow',
      resolve: safeResolver(async (_parent, _args, ctx) => {
        return await ctx.prisma.show.findMany({
          where: {
            userId: getSessionUserId(ctx),
          },
          orderBy: [
            {
              name: 'asc',
            },
          ],
        });
      }),
    });

    t.list.field('usersGames', {
      type: 'UserGame',
      resolve: safeResolver(async (_parent, _args, ctx) => {
        return await ctx.prisma.game.findMany({
          where: {
            userId: getSessionUserId(ctx),
          },
          orderBy: [
            {
              name: 'asc',
            },
          ],
        });
      }),
    });

    t.field('checkEmailVerificationToken', {
      type: 'RedisRes',
      args: {
        token: nonNull(stringArg()),
        userId: nonNull(idArg()),
      },
      resolve: safeResolver(async (_parent, { token, userId }, ctx) => {
        const input = parseInput(TokenVerificationInput, { token, userId });
        const tokenStored = await ctx.redis.get(`${VERIFICATION_EMAIL_PREFIX}:${input.userId}`);

        if (input.token !== tokenStored) {
          return {
            errors: [{ message: 'Email verification token not found.' }],
            token: null,
            userId: null,
          };
        }

        return {
          errors: [],
          token: tokenStored,
          userId: input.userId,
        };
      }),
    });

    t.field('checkForgotPasswordToken', {
      type: 'RedisRes',
      args: {
        token: nonNull(stringArg()),
        userId: nonNull(idArg()),
      },
      resolve: safeResolver(async (_parent, { token, userId }, ctx) => {
        const input = parseInput(TokenVerificationInput, { token, userId });
        const tokenStored = await ctx.redis.get(`${FORGOT_PASSWORD_EMAIL_PREFIX}:${input.userId}`);

        if (input.token !== tokenStored) {
          return {
            errors: [{ message: 'Forgot password token not found.' }],
            token: null,
            userId: null,
          };
        }

        return {
          errors: [],
          token: tokenStored,
          userId: input.userId,
        };
      }),
    });

    t.field('accountVerified', {
      type: 'AccountVerifiedRes',
      args: {
        email: nonNull(stringArg()),
      },
      resolve: safeResolver(async (_parent, { email }, ctx) => {
        const input = parseInput(EmailVerificationInput, { email });
        const acct = await ctx.prisma.user.findUnique({
          where: { email: input.email },
          select: { id: true, emailVerified: true },
        });

        if (acct?.id) {
          if (!acct.emailVerified) {
            return {
              errors: [{ message: 'Account Not Verified' }],
              id: acct.id,
              emailVerified: null,
            };
          } else {
            if (acct?.id && acct.emailVerified) {
              return {
                errors: [],
                id: acct.id,
                emailVerified: acct.emailVerified,
              };
            }
          }
        }

        return {
          errors: [{ message: 'Account Not Found' }],
          id: null,
          emailVerified: null,
        };
      }),
    });

    t.field('emailFromRedisToken', {
      type: 'String',
      args: {
        token: nonNull(stringArg()),
      },
      resolve: safeResolver(async (_parent, { token }, ctx) => {
        const input = parseInput(TokenInput, { token });
        const userId = await ctx.redis.get(`${VERIFICATION_EMAIL_PREFIX}:${input.token}`);

        if (!userId) return null;

        const user = await ctx.prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        });

        if (!user) return null;

        return user.email;
      }),
    });

    t.list.field('users', {
      type: 'User',
      resolve: safeResolver(async (_parent, _args, ctx) => {
        getSessionUserId(ctx); // requires authentication
        return await ctx.prisma.user.findMany({
          select: { id: true, name: true, email: true, created_at: true },
        });
      }),
    });
  },
});

export const UserMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addMovie', {
      type: 'UserMovie',
      args: {
        movieId: nonNull(idArg()),
        movieName: nonNull(stringArg()),
        watchStatus: nonNull(WatchStatusTypes),
      },
      resolve: safeResolver(async (_parent, { movieId, movieName, watchStatus }, ctx) => {
        const input = parseInput(AddMovieInput, { movieId, movieName, watchStatus });
        const userId = getSessionUserId(ctx);

        return await ctx.prisma.movie.upsert({
          where: {
            id_userId: {
              id: input.movieId,
              userId,
            },
          },
          create: {
            id: input.movieId,
            name: input.movieName,
            status: input.watchStatus,
            userId,
          },
          update: {
            name: input.movieName,
            status: input.watchStatus,
          },
        });
      }),
    });

    t.field('addShow', {
      type: 'UserShow',
      args: {
        showId: nonNull(idArg()),
        showName: nonNull(stringArg()),
        watchStatus: nonNull(WatchStatusTypes),
        currentEpisode: intArg(),
      },
      resolve: safeResolver(
        async (_parent, { showId, showName, watchStatus, currentEpisode }, ctx) => {
          const input = parseInput(AddShowInput, { showId, showName, watchStatus, currentEpisode });
          const userId = getSessionUserId(ctx);

          return await ctx.prisma.show.upsert({
            where: {
              id_userId: {
                id: input.showId,
                userId,
              },
            },
            create: {
              id: input.showId,
              name: input.showName,
              status: input.watchStatus,
              current_episode: input.currentEpisode ?? undefined,
              userId,
            },
            update: {
              name: input.showName,
              status: input.watchStatus,
              current_episode: input.currentEpisode ?? undefined,
            },
          });
        }
      ),
    });

    t.field('addGame', {
      type: 'UserGame',
      args: {
        gameId: nonNull(idArg()),
        gameName: nonNull(stringArg()),
        wishlist: booleanArg(),
        rating: intArg(),
      },
      resolve: safeResolver(async (_parent, { gameId, gameName, wishlist, rating }, ctx) => {
        const input = parseInput(AddGameInput, { gameId, gameName, wishlist, rating });
        const userId = getSessionUserId(ctx);

        return await ctx.prisma.game.upsert({
          where: {
            id_userId: {
              id: input.gameId,
              userId,
            },
          },
          create: {
            id: input.gameId,
            name: input.gameName,
            wishlist: input.wishlist ?? undefined,
            rating: input.rating,
            userId,
          },
          update: {
            name: input.gameName,
            wishlist: input.wishlist ?? undefined,
            rating: input.rating,
          },
        });
      }),
    });

    t.field('updateMovie', {
      type: 'UserMovie',
      args: {
        movieId: nonNull(idArg()),
        watchStatus: nonNull(WatchStatusTypes),
        movieRating: intArg(),
      },
      resolve: safeResolver(async (_parent, { movieId, watchStatus, movieRating }, ctx) => {
        const input = parseInput(UpdateMovieInput, { movieId, watchStatus, movieRating });
        return await ctx.prisma.movie.update({
          where: {
            id_userId: {
              id: input.movieId,
              userId: getSessionUserId(ctx),
            },
          },
          data: {
            status: input.watchStatus,
            rating: input.movieRating === undefined ? undefined : input.movieRating,
          },
        });
      }),
    });

    t.field('updateShow', {
      type: 'UserShow',
      args: {
        showId: nonNull(idArg()),
        watchStatus: nonNull(WatchStatusTypes),
        showRating: intArg(),
        currentEpisode: intArg(),
      },
      resolve: safeResolver(
        async (_parent, { showId, watchStatus, showRating, currentEpisode }, ctx) => {
          const input = parseInput(UpdateShowInput, {
            showId,
            watchStatus,
            showRating,
            currentEpisode,
          });
          return await ctx.prisma.show.update({
            where: {
              id_userId: {
                id: input.showId,
                userId: getSessionUserId(ctx),
              },
            },
            data: {
              status: input.watchStatus,
              rating: input.showRating === undefined ? undefined : input.showRating,
              current_episode: input.currentEpisode ?? undefined,
            },
          });
        }
      ),
    });

    t.field('updateGame', {
      type: 'UserGame',
      args: {
        gameId: nonNull(idArg()),
        wishlist: booleanArg(),
        rating: intArg(),
      },
      resolve: safeResolver(async (_parent, { gameId, wishlist, rating }, ctx) => {
        const input = parseInput(UpdateGameInput, { gameId, wishlist, rating });
        return await ctx.prisma.game.update({
          where: {
            id_userId: {
              id: input.gameId,
              userId: getSessionUserId(ctx),
            },
          },
          data: {
            wishlist: input.wishlist ?? undefined,
            rating: input.rating === undefined ? undefined : input.rating,
          },
        });
      }),
    });

    t.field('deleteMovie', {
      type: 'UserMovie',
      args: {
        movieId: nonNull(idArg()),
      },
      resolve: safeResolver(async (_parent, { movieId }, ctx) => {
        const input = parseInput(UserMediaInput, { movieId });
        return await ctx.prisma.movie.delete({
          where: {
            id_userId: {
              id: input.movieId,
              userId: getSessionUserId(ctx),
            },
          },
        });
      }),
    });

    t.field('deleteShow', {
      type: 'UserShow',
      args: {
        showId: nonNull(idArg()),
      },
      resolve: safeResolver(async (_parent, { showId }, ctx) => {
        const input = parseInput(UserShowInput, { showId });
        return await ctx.prisma.show.delete({
          where: {
            id_userId: {
              id: input.showId,
              userId: getSessionUserId(ctx),
            },
          },
        });
      }),
    });

    t.field('deleteGame', {
      type: 'UserGame',
      args: {
        gameId: nonNull(idArg()),
      },
      resolve: safeResolver(async (_parent, { gameId }, ctx) => {
        const input = parseInput(UserGameInput, { gameId });
        return await ctx.prisma.game.delete({
          where: {
            id_userId: {
              id: input.gameId,
              userId: getSessionUserId(ctx),
            },
          },
        });
      }),
    });
  },
});
