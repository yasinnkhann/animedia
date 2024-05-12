import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { __prod__ } from 'utils/constants';

export const sendEmail = async (payload: Mail.Options) => {
	let transporterConfig: SMTPTransport.Options = {};

	if (!__prod__) {
		nodemailer.createTestAccount(async (_err, account) => {
			transporterConfig = {
				host: 'smtp.ethereal.email',
				port: +process.env.TURBO_SMTP_UNSECURE_PORT,
				secure: transporterConfig.port === +process.env.TURBO_SMTP_SECURE_PORT,
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
			secure: transporterConfig.port === +process.env.TURBO_SMTP_SECURE_PORT,
			auth: {
				user: process.env.TURBO_SMTP_USERNAME,
				pass: process.env.TURBO_SMTP_PASSWORD,
			},
		};
		// transporterConfig = {
		// 	host: process.env.TURBO_SMTP_HOST,
		// 	port: Number(
		// 		__prod__
		// 			? process.env.TURBO_SMTP_SECURE_PORT
		// 			: process.env.TURBO_SMTP_UNSECURE_PORT
		// 	),
		// 	secure:
		// 		transporterConfig.port === Number(process.env.TURBO_SMTP_SECURE_PORT),
		// 	auth: {
		// 		user: process.env.TURBO_SMTP_USERNAME,
		// 		pass: process.env.TURBO_SMTP_PASSWORD,
		// 	},
		// };
		console.log('transporterConfig: ', transporterConfig);
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
