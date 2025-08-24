import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log('Cron job executed at: ', new Date());
	res.status(200).send('Cron job executed');
}
