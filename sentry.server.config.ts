import * as Sentry from '@sentry/nextjs';

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	environment: process.env.NODE_ENV,
	sendDefaultPii: process.env.SENTRY_SEND_DEFAULT_PII === 'true',
	tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
	includeLocalVariables: process.env.SENTRY_INCLUDE_LOCAL_VARIABLES === 'true',
	enableLogs: true,
});
