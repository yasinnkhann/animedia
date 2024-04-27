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
			EMAIL_SERVER_HOST: string;
			EMAIL_SERVER_PORT: string;
			EMAIL_FROM: string;
			EMAIL_SERVER_USER: string;
			EMAIL_SERVER_PASSWORD: string;
			REDIS_HOST: string;
			REDIS_PORT: string;
			REDIS_PASSWORD: string;
		}
	}
}

export {};
