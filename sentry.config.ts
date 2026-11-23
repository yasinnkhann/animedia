import * as Sentry from '@sentry/nextjs';

const sharedSentryOptions: Parameters<typeof Sentry.init>[0] = {
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampler: samplingContext => {
    const name = samplingContext.name?.toLowerCase() || '';
    // Skip noisy cron jobs, health checks, and monitoring tunnel routes to preserve quota
    if (
      name.includes('monitoring') ||
      name.includes('db-keepalive') ||
      name.includes('dbkeepalive') ||
      name.includes('health')
    ) {
      return 0;
    }
    return process.env.NODE_ENV === 'development' ? 1.0 : 0.1;
  },
  enableLogs: true,
};

export function initSentry(options: Partial<Parameters<typeof Sentry.init>[0]> = {}) {
  Sentry.init({
    ...sharedSentryOptions,
    ...options,
  });
}
