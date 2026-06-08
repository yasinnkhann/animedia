import { initSentry } from './sentry.config';

initSentry({
  includeLocalVariables: process.env.SENTRY_INCLUDE_LOCAL_VARIABLES === 'true',
});
