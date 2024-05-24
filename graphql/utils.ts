import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IGDB_ACCESS_TOKEN_PREFIX, __prod__ } from 'utils/constants';
import { redis } from '../lib/redis';

export const sendEmail = async (payload: Mail.Options) => {
	let transporterConfig: SMTPTransport.Options = {};

	if (!__prod__) {
		nodemailer.createTestAccount(async (_err, account) => {
			transporterConfig = {
				host: 'smtp.ethereal.email',
				port: +process.env.TURBO_SMTP_UNSECURE_PORT,
				secure: false,
				auth: {
					user: account.user,
					pass: account.pass,
				},
			};

			const transporter = nodemailer.createTransport(transporterConfig);

			const info = await transporter.sendMail(payload);

			console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
		});
	} else {
		transporterConfig = {
			host: process.env.TURBO_SMTP_HOST,
			port: +process.env.TURBO_SMTP_SECURE_PORT,
			secure: true,
			auth: {
				user: process.env.TURBO_SMTP_USERNAME,
				pass: process.env.TURBO_SMTP_PASSWORD,
			},
		};

		const transporter = nodemailer.createTransport(transporterConfig);
		await transporter.sendMail(payload);
	}
};

export const getErrorMsg = (error: unknown) => {
	if (error instanceof Error) {
		return error.message;
	} else if (typeof error === 'string') {
		return error;
	} else {
		return JSON.stringify(error);
	}
};

export const postIGDB = async (url: string, body = '') => {
	interface AccessTokenResponse {
		access_token: string;
		expires_in: number;
		token_type: string;
	}

	try {
		let accessToken = await redis.get(IGDB_ACCESS_TOKEN_PREFIX);

		if (accessToken === null) {
			const accessTokenRes = await fetch(
				`https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			const accessTokenData: AccessTokenResponse = await accessTokenRes.json();
			accessToken = accessTokenData.access_token;

			if (!accessToken) {
				throw new Error('Could not fetch newest access token.');
			}

			await redis.set(
				IGDB_ACCESS_TOKEN_PREFIX,
				accessToken,
				'EX',
				accessTokenData.expires_in
			);
		}

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Client-ID': process.env.IGDB_CLIENT_ID,
				Authorization: `Bearer ${accessToken}`,
			},
			body,
		});
		return await response.json();
	} catch (err) {
		console.error(err);
	}
};
