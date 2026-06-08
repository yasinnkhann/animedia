import * as Sentry from '@sentry/nextjs';
import { initSentry } from './sentry.config';

initSentry({
  sendDefaultPii: process.env.NEXT_PUBLIC_SENTRY_SEND_DEFAULT_PII === 'true',
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    }),
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
