import { NextApiRequest, NextApiResponse } from 'next';
import { getServerAuthSession } from '../../lib/nextAuth/get-server-auth-session';

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerAuthSession({ req, res });
	console.log('SESH: ', session);
	if (session) {
		res.send({
			content:
				'This is protected content. You can access this api because you are signed in.',
		});
	} else {
		res.send({
			error: 'You must be signed in to view the protected api on this page.',
		});
	}
};

export default restricted;
