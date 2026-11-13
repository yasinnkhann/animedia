import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const { mockUserCount, mockLogger } = vi.hoisted(() => ({
  mockUserCount: vi.fn(),
  mockLogger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      count: mockUserCount,
    },
  },
}));

vi.mock('@/lib/logger', () => ({
  default: mockLogger,
}));

import { GET } from '@/app/api/cron/db-keepalive/route';

describe('GET /api/cron/db-keepalive', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  it('rejects unauthorized requests in production when token is missing', async () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.CRON_SECRET = 'secret123';

    const req = new NextRequest('http://localhost:3000/api/cron/db-keepalive');
    const res = await GET(req);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
  });

  it('rejects requests in production when token is incorrect', async () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.CRON_SECRET = 'secret123';

    const req = new NextRequest('http://localhost:3000/api/cron/db-keepalive', {
      headers: { authorization: 'Bearer wrongsecret' },
    });
    const res = await GET(req);

    expect(res.status).toBe(401);
  });

  it('succeeds with 200 and returns userCount with valid token in production', async () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.CRON_SECRET = 'secret123';
    mockUserCount.mockResolvedValue(42);

    const req = new NextRequest('http://localhost:3000/api/cron/db-keepalive', {
      headers: { authorization: 'Bearer secret123' },
    });
    const res = await GET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.userCount).toBe(42);
    expect(typeof data.checkedAt).toBe('string');
    expect(mockLogger.info).toHaveBeenCalledWith('Database keepalive succeeded', { userCount: 42 });
  });

  it('handles database errors gracefully and returns 500', async () => {
    mockUserCount.mockRejectedValue(new Error('Connection failure'));

    const req = new NextRequest('http://localhost:3000/api/cron/db-keepalive');
    const res = await GET(req);

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('Database keepalive failed');
    expect(mockLogger.error).toHaveBeenCalledWith('Database keepalive failed', {
      error: 'Connection failure',
    });
  });
});
