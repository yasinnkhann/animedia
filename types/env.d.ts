declare global {
	namespace NodeJS {
		interface ProcessEnv {
			SUPABASE_DB_PASSWORD: string;
			SUPABASE_REFERENCE_ID: string;
			DATABASE_URL: string;
			DIRECT_URL: string;
			NEXTAUTH_URL: string;
			NEXTAUTH_SECRET: string;
			JWT_SECRET: string;
			API_KEY: string;
			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;
			FACEBOOK_CLIENT_ID: string;
			FACEBOOK_CLIENT_SECRET: string;
			DISCORD_CLIENT_ID: string;
			DISCORD_CLIENT_SECRET: string;
			TURBO_SMTP_HOST: string;
			TURBO_SMTP_PORT: string;
			EMAIL_FROM: string;
			TURBO_SMTP_USERNAME: string;
			TURBO_SMTP_API_KEY: string;
			TURBO_SMTP_SECRET: string;
			TURBO_SMTP_PASSWORD: string;
			REDIS_HOST: string;
			REDIS_PORT: string;
			REDIS_PASSWORD: string;
		}
	}
}

export {};
