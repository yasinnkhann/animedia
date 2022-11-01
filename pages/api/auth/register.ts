import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { hash } from 'bcryptjs';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// only post method is accepted
	if (req.method === 'POST') {
		if (!req.body) {
			return res
				.status(404)
				.json({ status: 404, error: "Don't have form data...!" });
		}

		const { name, email, password } = req.body;

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});
		if (existingUser) {
			return res
				.status(422)
				.json({ status: 422, message: 'User Already Exists...!' });
		}

		// hash password
		try {
			const newUser = await prisma.user.create({
				data: { name, email, password: await hash(password, 12) },
			});
			res.status(201).json({ status: 201, user: newUser });
		} catch (err) {
			return res.status(404).json({ err });
		}
	} else {
		res
			.status(500)
			.json({ message: 'HTTP method not valid only POST Accepted' });
	}
}
