import { ApolloServer } from 'apollo-server-micro';
import { PageConfig } from 'next';
import { schema } from '../../graphql/schema';
import { createContext } from '../../graphql/context';
import Cors from 'micro-cors';

const apolloServer = new ApolloServer({
	context: createContext,
	schema,
});

const startServer = apolloServer.start();

const cors = Cors();

export default cors(async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader(
		'Access-Control-Allow-Origin',
		'https://studio.apollographql.com'
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
