import { NextApiRequest, NextApiResponse } from 'next';
import { isValidEmail } from '../../../utils/isValidEmail';
import nodemailer from 'nodemailer';

const sendVerificationEmail = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	if (req.method !== 'POST') {
		res.end('Only POST method is allowed.');
	}

	const { recipientEmail, subject, text, html } = req.body;

	if (!isValidEmail(recipientEmail)) {
		res.end('Please provide a valid email address');
	}

	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_SERVER_HOST,
		port: process.env.EMAIL_SERVER_PORT,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.EMAIL_SERVER_USER,
			pass: process.env.EMAIL_SERVER_PASSWORD,
		},
	} as any);

	try {
		await transporter.sendMail({
			from: process.env.EMAIL_FROM, // verified sender email
			to: recipientEmail, // recipient email
			subject, // Subject line
			text, // plain text body
			html, // html body
		});

		res.json('EMAIL VERIFICATION SENT!');
	} catch (err) {
		console.error(err);
		res.end(`ERROR ${err}`);
	}
};

export default sendVerificationEmail;
