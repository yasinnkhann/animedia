const BASE_URL =
	process.env.NODE_ENV === 'production' ? 'https://animedia.vercel.app' : 'http://localhost:3000';

const USERS = `query Users {
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
}`;

fetch(`${BASE_URL}/api/graphql`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ query: USERS }),
})
	.then(async res => {
		const data = await res.json();
		console.log('Fetched users:', data.data.users);
	})
	.catch((err: unknown) => {
		console.error('Error fetching users:', err);
	});
