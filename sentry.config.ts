import * as Sentry from '@sentry/nextjs';

const sharedSentryOptions: Parameters<typeof Sentry.init>[0] = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  sendDefaultPii: process.env.SENTRY_SEND_DEFAULT_PII === 'true',
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
  enableLogs: true,
};

export function initSentry(options: Partial<Parameters<typeof Sentry.init>[0]> = {}) {
  Sentry.init({
    ...sharedSentryOptions,
    ...options,
  });
}
