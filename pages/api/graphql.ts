// import { ApolloServer } from 'apollo-server-micro';
// import { PageConfig } from 'next';
// import { schema } from '../../graphql/schema';
// import { context } from '../../graphql/context';
// import Cors from 'micro-cors';

// const apolloServer = new ApolloServer({
// 	context,
// 	schema,
// });

// const startServer = apolloServer.start();

// const cors = Cors({
// 	origin: 'https://animedia.vercel.app',
// 	allowCredentials: true,
// });

// export default cors(async function handler(req, res) {
// 	res.setHeader('Access-Control-Allow-Credentials', 'true');
// 	res.setHeader(
// 		'Access-Control-Allow-Origin',
// 		'https://studio.apollographql.com'
// 	);
// 	res.setHeader(
// 		'Access-Control-Allow-Headers',
// 		'Origin, X-Requested-With, Content-Type, Accept'
// 	);
// 	res.setHeader('Access-Control-Allow-Origin', 'https://animedia.vercel.app');

// 	if (req.method === 'OPTIONS') {
// 		res.end();
// 		return false;
// 	}

// 	await startServer;

// 	await apolloServer.createHandler({
// 		path: '/api/graphql',
// 	})(req, res);
// });

// export const config: PageConfig = {
// 	api: {
// 		bodyParser: false,
// 	},
// };

import { ApolloServer } from 'apollo-server-micro';
import { PageConfig } from 'next';
import { schema } from '../../graphql/schema';
import { context } from '../../graphql/context';
import Cors from 'micro-cors';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

const apolloServer = new ApolloServer({
	context,
	schema,
	plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
	introspection: true,
});

const startServer = apolloServer.start();

export default async function handler(req: any, res: any) {
	await startServer;
	await apolloServer.createHandler({
		path: '/api/graphql',
	})(req, res);
}

export const config = {
	api: {
		bodyParser: false,
	},
};
