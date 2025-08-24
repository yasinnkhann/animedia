import type { NextApiRequest, NextApiResponse } from 'next';
import { CLIENT_BASE_URL } from '../../utils/constants';
import * as Queries from '../../graphql/queries';

const USERS = `
  query Users {
    users {
      id
      name
      email
      emailVerified
      image
      password
      created_at
      movies {
        id
        name
        status
        rating
      }
      shows {
        id
        name
        status
        rating
        current_episode
      }
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const response = await fetch(`${CLIENT_BASE_URL}/api/graphql`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: USERS }),
		});

		const data = await response.json();

		const users = data.data.users;

		console.log('Fetched users: ', users);

		res.status(200).json({ success: true, users });
	} catch (err) {
		console.error('Error fetching users:', err);
		res.status(500).json({ success: false, error: 'Failed to fetch users' });
	}
}
