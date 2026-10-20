declare global {
  namespace NodeJS {
    interface ProcessEnv {
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
      TURBO_SMTP_HOST: string;
      TURBO_SMTP_UNSECURE_PORT: string;
      TURBO_SMTP_SECURE_PORT: string;
      TURBO_SMTP_USERNAME: string;
      TURBO_SMTP_PASSWORD: string;
      EMAIL_FROM: string;
      REDIS_URL?: string;
      REDIS_HOST?: string;
      REDIS_PORT?: string;
      REDIS_PASSWORD?: string;
      CRON_SECRET: string;
      NEXT_PUBLIC_SENTRY_DSN: string;
      SENTRY_ORG: string;
      SENTRY_PROJECT: string;
      SENTRY_AUTH_TOKEN: string;
      GROQ_API_KEY: string;
    }
  }
}

export {};
