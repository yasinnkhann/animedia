import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function assetHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req;

	switch (method) {
		case 'POST':
			try {
				const { name } = req.body;
				const user = await prisma.user.create({
					data: {
						name,
					},
				});
				res.status(201).json(user);
			} catch (err) {
				console.error('Request error', err);
				res.status(500).json({ error: 'Error creating user' });
			}
			break;
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}
