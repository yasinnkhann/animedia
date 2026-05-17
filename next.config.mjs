import * as Sentry from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	allowedDevOrigins: ['192.168.1.73'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'image.tmdb.org',
			},
		],
		unoptimized: true,
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ['@svgr/webpack'],
		});

		return config;
	},
};

export default Sentry.withSentryConfig(nextConfig, {
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,
	authToken: process.env.SENTRY_AUTH_TOKEN,
	widenClientFileUpload: true,
	tunnelRoute: process.env.NODE_ENV === 'production' ? '/monitoring' : undefined,
	silent: !process.env.CI,
	webpack: {
		automaticVercelMonitors: true,
		treeshake: {
			removeDebugLogging: true,
		},
	},
});
