'use server';

import { v4 } from 'uuid';
import { hash } from 'argon2';
import Mail from 'nodemailer/lib/mailer';
import { sendEmail } from '../../graphql/utils';
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
} from '../../utils/constants';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';
import {
  parseInput,
  UserIdInput,
  RegisterUserInput,
  ChangePasswordInput,
  EmailInput,
} from '../../graphql/validations/inputs';

export async function registerUserAction(input: unknown) {
  try {
    const parsedInput = parseInput(RegisterUserInput, input);

    const existingUser = await prisma.user.findUnique({
      where: { email: parsedInput.email },
    });

    if (existingUser) {
      return { errors: [{ message: 'Email Already Exists' }] };
    }

    const newUser = await prisma.user.create({
      data: {
        name: parsedInput.name,
        email: parsedInput.email,
        password: await hash(parsedInput.password),
      },
    });

    const { password: _userPassword, ...createdUserWithoutPassword } = newUser;

    return {
      errors: [],
      createdUser: createdUserWithoutPassword,
    };
  } catch (err: any) {
    return { errors: [{ message: err.message || 'An error occurred during registration.' }] };
  }
}

export async function sendVerificationEmailAction(input: unknown) {
  try {
    const parsedInput = parseInput(UserIdInput, input);
    const user = await prisma.user.findUnique({
      where: { id: parsedInput.id },
      select: { email: true },
    });

    if (!user?.email) {
      return { errors: [{ message: 'Could not find user with that email' }] };
    }

    const verificationEmailCountRes = await redis.get(
      `${VERIFICATION_EMAIL_COUNT_PREFIX}:${parsedInput.id}`
    );

    const verificationEmailCount = +(verificationEmailCountRes ?? '0');

    if (__prod__ && verificationEmailCount === VERIFICATION_EMAIL_COUNT_LIMIT) {
      return {
        errors: [
          {
            message:
              'You have reached the limit of verification emails. Please wait 24 hours to try again.',
          },
        ],
      };
    }

    await redis.del(`${VERIFICATION_EMAIL_PREFIX}:${parsedInput.id}`);

    const token = v4();

    await redis.set(
      `${VERIFICATION_EMAIL_PREFIX}:${parsedInput.id}`,
      token,
      'EX',
      REDIS_EXP_MAP[VERIFICATION_EMAIL_PREFIX]
    );

    await redis.set(
      `${VERIFICATION_EMAIL_COUNT_PREFIX}:${parsedInput.id}`,
      (verificationEmailCount + 1).toString(),
      'EX',
      REDIS_EXP_MAP[VERIFICATION_EMAIL_COUNT_PREFIX]
    );

    const payload: Mail.Options = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Email Verification Link',
      text: 'Click the link below to verify your email.',
      html: `<a href="${CLIENT_BASE_URL}/auth/verification-email?uid=${parsedInput.id}&token=${token}">Verify Email</a>`,
    };

    await sendEmail(payload);

    return {
      errors: [],
      token,
      userId: parsedInput.id,
    };
  } catch (err: any) {
    return {
      errors: [
        { message: err.message || 'An error occurred while sending the verification email.' },
      ],
    };
  }
}

export async function verifyUserEmailAction(userId: string, token: string) {
  try {
    const storedToken = await redis.get(`${VERIFICATION_EMAIL_PREFIX}:${userId}`);

    if (!storedToken || storedToken !== token) {
      return { errors: [{ message: 'Invalid or expired verification token.' }] };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });

    await redis.del(`${VERIFICATION_EMAIL_PREFIX}:${userId}`);
    await redis.del(`${VERIFICATION_EMAIL_COUNT_PREFIX}:${userId}`);

    return { errors: [], success: true };
  } catch (err: any) {
    return { errors: [{ message: err.message || 'An error occurred during verification.' }] };
  }
}

export async function sendForgotPasswordEmailAction(input: unknown) {
  try {
    const parsedInput = parseInput(EmailInput, input);
    const user = await prisma.user.findUnique({
      where: { email: parsedInput.email },
    });

    if (!user?.email) {
      return {
        errors: [],
        token: null,
        userId: null,
      };
    }

    const forgotPasswordEmailCountRes = await redis.get(
      `${FORGOT_PASSWORD_EMAIL_COUNT_PREFIX}:${user.id}`
    );

    const forgotPasswordEmailCount = +(forgotPasswordEmailCountRes ?? '0');

    if (__prod__ && forgotPasswordEmailCount === FORGOT_PASSWORD_EMAIL_COUNT_LIMIT) {
      return {
        errors: [],
        token: null,
        userId: null,
      };
    }

    await redis.del(`${FORGOT_PASSWORD_EMAIL_PREFIX}:${user.id}`);

    const token = v4();

    await redis.set(
      `${FORGOT_PASSWORD_EMAIL_PREFIX}:${user.id}`,
      token,
      'EX',
      REDIS_EXP_MAP[FORGOT_PASSWORD_EMAIL_PREFIX]
    );

    await redis.set(
      `${FORGOT_PASSWORD_EMAIL_COUNT_PREFIX}:${user.id}`,
      (forgotPasswordEmailCount + 1).toString(),
      'EX',
      REDIS_EXP_MAP[FORGOT_PASSWORD_EMAIL_COUNT_PREFIX]
    );

    const payload: Mail.Options = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Forgot Password Link',
      text: 'Click the link below to create a new password.',
      html: `<a href="${CLIENT_BASE_URL}/auth/change-password?uid=${user.id}&token=${token}">Reset Password</a>`,
    };

    await sendEmail(payload);

    return {
      errors: [],
      token: null,
      userId: null,
    };
  } catch (err: any) {
    return {
      errors: [
        { message: err.message || 'An error occurred while sending the forgot password email.' },
      ],
    };
  }
}

export async function changePasswordAction(input: unknown, token: string) {
  try {
    const parsedInput = parseInput(ChangePasswordInput, input);

    const storedToken = await redis.get(`${FORGOT_PASSWORD_EMAIL_PREFIX}:${parsedInput.userId}`);

    if (!storedToken || storedToken !== token) {
      return { errors: [{ message: 'Invalid or expired password reset token.' }] };
    }

    const hashedNewPassword = await hash(parsedInput.newPassword);

    await prisma.user.update({
      data: { password: hashedNewPassword },
      where: { id: parsedInput.userId },
    });

    await redis.del(`${FORGOT_PASSWORD_EMAIL_PREFIX}:${parsedInput.userId}`);
    await redis.del(`${FORGOT_PASSWORD_EMAIL_COUNT_PREFIX}:${parsedInput.userId}`);

    return {
      errors: [],
      token: null,
      userId: parsedInput.userId,
    };
  } catch (err: any) {
    return {
      errors: [{ message: err.message || 'An error occurred while changing the password.' }],
    };
  }
}
