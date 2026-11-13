import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrismaUser, mockRedis, mockSendEmail } = vi.hoisted(() => ({
  mockPrismaUser: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  mockRedis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
  mockSendEmail: vi.fn(),
}));

vi.mock('../../lib/prisma', () => ({
  prisma: {
    user: mockPrismaUser,
  },
}));

vi.mock('../../lib/redis', () => ({
  redis: mockRedis,
}));

vi.mock('../../utils/igdbUtils', () => ({
  sendEmail: mockSendEmail,
}));

import {
  registerUserAction,
  sendVerificationEmailAction,
  verifyUserEmailAction,
  checkAccountVerifiedAction,
  sendForgotPasswordEmailAction,
  changePasswordAction,
} from '../../app/actions/auth';

describe('Auth Actions (Registration & Email Verification)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates and allows re-registration when an existing user is unverified', async () => {
    mockPrismaUser.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'unverified@example.com',
      emailVerified: null,
    });
    mockPrismaUser.update.mockResolvedValue({
      id: 'user-1',
      name: 'Test User',
      email: 'unverified@example.com',
      emailVerified: null,
      password: 'hashed-password',
    });

    const res = await registerUserAction({
      firstName: 'Test',
      lastName: 'User',
      email: 'unverified@example.com',
      password: 'Password123!',
    });

    expect(res.errors).toEqual([]);
    expect(res.createdUser?.id).toBe('user-1');
    expect(mockPrismaUser.update).toHaveBeenCalledTimes(1);
  });

  it('rejects registration when an existing user is already verified', async () => {
    mockPrismaUser.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'verified@example.com',
      emailVerified: new Date(),
    });

    const res = await registerUserAction({
      firstName: 'Test',
      lastName: 'User',
      email: 'verified@example.com',
      password: 'Password123!',
    });

    expect(res.errors).toEqual([{ message: 'Email Already Exists' }]);
    expect(mockPrismaUser.update).not.toHaveBeenCalled();
  });

  it('sends verification email and verifies token end-to-end', async () => {
    mockPrismaUser.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'unverified@example.com',
    });
    mockRedis.get.mockResolvedValueOnce(null);
    mockRedis.set.mockResolvedValue('OK');
    mockRedis.del.mockResolvedValue(1);
    mockSendEmail.mockResolvedValue(undefined);

    const sendRes = await sendVerificationEmailAction({ id: 'user-1' });
    expect(sendRes.errors).toEqual([]);
    expect(sendRes.token).toBeDefined();
    expect(mockSendEmail).toHaveBeenCalledTimes(1);

    mockRedis.get.mockResolvedValueOnce(sendRes.token);
    mockPrismaUser.update.mockResolvedValue({
      id: 'user-1',
      emailVerified: new Date(),
    });

    const verifyRes = await verifyUserEmailAction('user-1', sendRes.token!);
    expect(verifyRes).toEqual({ errors: [], success: true });

    mockPrismaUser.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      emailVerified: new Date(),
    });
    const checkRes = await checkAccountVerifiedAction('unverified@example.com');
    expect(checkRes).toEqual({ errors: [], success: true });
  });

  describe('Forgot Password & Password Reset Flow', () => {
    it('sends forgot password email when user exists', async () => {
      mockPrismaUser.findUnique.mockResolvedValueOnce({
        id: 'user-forgot-1',
        email: 'user@example.com',
      });
      mockRedis.get.mockResolvedValueOnce(null);
      mockRedis.set.mockResolvedValue('OK');
      mockRedis.del.mockResolvedValue(1);
      mockSendEmail.mockResolvedValue(undefined);

      const res = await sendForgotPasswordEmailAction({ email: 'user@example.com' });
      expect(res.errors).toEqual([]);
      expect(mockSendEmail).toHaveBeenCalledTimes(1);
      expect(mockRedis.set).toHaveBeenCalledTimes(2); // token + count
    });

    it('returns without error and sends no email if user does not exist (security obfuscation)', async () => {
      mockPrismaUser.findUnique.mockResolvedValueOnce(null);

      const res = await sendForgotPasswordEmailAction({ email: 'nonexistent@example.com' });
      expect(res.errors).toEqual([]);
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it('updates user password when valid reset token is provided', async () => {
      mockRedis.get.mockResolvedValueOnce('valid-reset-token');
      mockPrismaUser.update.mockResolvedValueOnce({
        id: 'user-forgot-1',
        password: 'hashed-new-password',
      });
      mockRedis.del.mockResolvedValue(1);

      const res = await changePasswordAction(
        { userId: 'user-forgot-1', newPassword: 'NewSecurePassword123!' },
        'valid-reset-token'
      );

      expect(res.errors).toEqual([]);
      expect(res.userId).toBe('user-forgot-1');
      expect(mockPrismaUser.update).toHaveBeenCalledTimes(1);
      expect(mockRedis.del).toHaveBeenCalledTimes(2); // token + count
    });

    it('rejects password reset when token is invalid or expired', async () => {
      mockRedis.get.mockResolvedValueOnce('another-token');

      const res = await changePasswordAction(
        { userId: 'user-forgot-1', newPassword: 'NewSecurePassword123!' },
        'expired-or-wrong-token'
      );

      expect(res.errors).toEqual([{ message: 'Invalid or expired password reset token.' }]);
      expect(mockPrismaUser.update).not.toHaveBeenCalled();
    });
  });
});
