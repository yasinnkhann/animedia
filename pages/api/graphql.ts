import { ApolloServer } from 'apollo-server-micro';
import { PageConfig } from 'next';
import { schema } from '../../graphql/schema';
import { context } from '../../graphql/context';
import Cors from 'micro-cors';

const apolloServer = new ApolloServer({
	context,
	schema,
	cache: 'bounded',
	introspection: true,
});

const startServer = apolloServer.start();

const cors = Cors({
	// origin: 'https://animedia.vercel.app',
	// allowCredentials: true,
});

export default cors(async function handler(req, res) {
	// res.setHeader('Access-Control-Allow-Credentials', 'true');
	// res.setHeader(
	// 	'Access-Control-Allow-Origin',
	// 	'https://studio.apollographql.com'
	// );
	// res.setHeader(
	// 	'Access-Control-Allow-Headers',
	// 	'Origin, X-Requested-With, Content-Type, Accept'
	// );
	const allowedOrigins = [
		'http://localhost:3000',
		'https://animedia.vercel.app',
		'https://studio.apollographql.com',
		'https://cdn.cookielaw.org',
		'https://www.googletagmanager.com',
	];

	const origin = req.headers.origin;

	if (origin) {
		if (allowedOrigins.includes(origin)) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}
	}

	res.setHeader('Access-Control-Allow-Credentials', 'true');

	// res.setHeader(
	// 	'Access-Control-Allow-Origin',
	// 	'https://studio.apollographql.com'
	// );

	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET,OPTIONS,PATCH,DELETE,POST,PUT'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);

	if (req.method === 'OPTIONS') {
		res.end();
		return false;
	}

	await startServer;

	await apolloServer.createHandler({
		path: '/api/graphql',
	})(req, res);
});

export const config: PageConfig = {
	api: {
		bodyParser: false,
	},
};
