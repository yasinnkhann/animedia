import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userCount = await prisma.user.count();

    logger.info('Database keepalive succeeded', { userCount });

    return NextResponse.json({
      success: true,
      userCount,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error('Database keepalive failed', { error: message });

    return NextResponse.json(
      {
        success: false,
        error: 'Database keepalive failed',
      },
      { status: 500 }
    );
  }
}
