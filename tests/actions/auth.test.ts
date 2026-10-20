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
});
