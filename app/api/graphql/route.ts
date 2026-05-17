import { graphql } from 'graphql';
import { schema } from '../../../graphql/schema';
import { context } from '../../../graphql/context';
import * as Sentry from '@sentry/nextjs';
import logger from '../../../lib/logger';

const allowedOrigins = [
	'http://localhost:3000',
	'https://animedia.vercel.app',
	'https://studio.apollographql.com',
];

const defaultHeaders = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
	'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
	'Access-Control-Allow-Credentials': 'true',
};

function createHeaders(origin: string | null) {
	const headers = new Headers(defaultHeaders);
	if (origin && allowedOrigins.includes(origin)) {
		headers.set('Access-Control-Allow-Origin', origin);
	}
	return headers;
}

export const runtime = 'nodejs';

export async function OPTIONS(request: Request) {
	return new Response(null, {
		status: 204,
		headers: createHeaders(request.headers.get('origin')),
	});
}

export async function POST(request: Request) {
	const origin = request.headers.get('origin');
	const headers = createHeaders(origin);

	try {
		const body = await request.json();
		const result = await graphql({
			schema,
			source: body.query,
			variableValues: body.variables,
			operationName: body.operationName,
			contextValue: await context(),
		});

		return new Response(JSON.stringify(result), {
			status: 200,
			headers,
		});
	} catch (error) {
		logger.error('GraphQL Handler Error', {
			error: error instanceof Error ? error.message : String(error),
		});
		Sentry.captureException(error);
		return new Response(
			JSON.stringify({
				success: false,
				error: {
					code: 'INTERNAL_SERVER_ERROR',
					message: 'An unexpected error occurred',
				},
				timestamp: new Date().toISOString(),
			}),
			{
				status: 500,
				headers,
			}
		);
	}
}
