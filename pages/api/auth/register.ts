import { prisma } from 'lib/prisma';
import { hash } from 'bcryptjs';

export default async function handler(req: any, res: any) {
	// only post method is accepted
	if (req.method === 'POST') {
		if (!req.body)
			return res.status(404).json({ error: "Don't have form data...!" });

		const { name, email, password } = req.body;
		console.log('BODY: ', req.body);

		console.log('BODY: ', name, email, password);

		// check duplicate users
		const checkExisting = await prisma.user.findUnique({
			where: { email },
		});

		if (checkExisting) {
			return res.status(422).json({ message: 'User Already Exists...!' });
		}

		// hash password
		try {
			const newUser = await prisma.user.create({
				data: { name, email, password: await hash(password, 12) },
			});
			res.status(201).json({ status: true, user: newUser });
		} catch (err) {
			return res.status(404).json({ err });
		}
	} else {
		res
			.status(500)
			.json({ message: 'HTTP method not valid only POST Accepted' });
	}
}
