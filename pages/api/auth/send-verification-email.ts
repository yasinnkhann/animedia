import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { isValidEmail } from '../../../utils/isValidEmail';

const sendVerificationEmail = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	if (req.method !== 'POST') {
		res.end('Only POST method is allowed.');
	}

	if (!isValidEmail(req.body.email)) {
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
		const info = await transporter.sendMail({
			from: process.env.EMAIL_FROM, // verified sender email
			to: req.body.email, // recipient email
			subject: 'Email Verification Link', // Subject line
			text: 'Hello world!', // plain text body
			html: '<b>Hello world!</b>', // html body
		});

		console.log('INFO: ', info);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		res.send('EMAIL VERIFICATION SENT!');
	} catch (err) {
		console.error(err);
		res.end(`ERROR ${err}`);
	}
};

export default sendVerificationEmail;
