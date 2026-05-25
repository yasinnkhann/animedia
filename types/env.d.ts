declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_REFERENCE_ID: string;
      SUPABASE_DB_PASSWORD: string;
      DATABASE_URL: string;
      DIRECT_URL: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      JWT_SECRET: string;
      THE_MOVIE_DB_API_KEY: string;
      IGDB_CLIENT_ID: string;
      IGDB_CLIENT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      FACEBOOK_CLIENT_ID: string;
      FACEBOOK_CLIENT_SECRET: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_CLIENT_SECRET: string;
      TURBO_SMTP_HOST: string;
      TURBO_SMTP_UNSECURE_PORT: string;
      TURBO_SMTP_SECURE_PORT: string;
      TURBO_SMTP_USERNAME: string;
      TURBO_SMTP_PASSWORD: string;
      EMAIL_FROM: string;
      TURBO_SMTP_API_KEY: string;
      TURBO_SMTP_SECRET: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
      CRON_SECRET: string;
      LOG_LEVEL: string;
      NEXT_PUBLIC_SENTRY_DSN: string;
      SENTRY_ORG: string;
      SENTRY_PROJECT: string;
      SENTRY_AUTH_TOKEN: string;
      SENTRY_SEND_DEFAULT_PII: string;
      SENTRY_INCLUDE_LOCAL_VARIABLES: string;
      NEXT_PUBLIC_SENTRY_SEND_DEFAULT_PII: string;
      NEXTAUTH_DEBUG: string;
    }
  }
}

export {};
