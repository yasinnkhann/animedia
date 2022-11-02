import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { hash } from 'bcryptjs';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		if (!req.body) {
			return res
				.status(404)
				.json({ error: "Don't have sufficient form data", user: null });
		}

		const { name, email, password } = req.body;

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res
				.status(422)
				.json({ error: 'Email Already Exists', user: null });
		}

		// hash password
		try {
			const newUser = await prisma.user.create({
				data: { name, email, password: await hash(password, 12) },
			});
			res.status(201).json({ error: null, user: newUser });
		} catch (err) {
			return res.status(404).json({ err });
		}
	} else {
		res
			.status(500)
			.json({ error: 'HTTP method not valid only POST Accepted', user: null });
	}
}
