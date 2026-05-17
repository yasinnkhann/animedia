import { NextRequest, NextResponse } from 'next/server';
import { CLIENT_BASE_URL } from '../../../utils/constants';
import { httpClient, APIError } from '@lib/api';
import logger from '@lib/logger';

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

interface FetchUsersResponse {
	success: boolean;
	users?: any[];
	error?: string;
}

export async function POST(_req: NextRequest): Promise<NextResponse<FetchUsersResponse>> {
	try {
		const graphqlUrl = `${CLIENT_BASE_URL}/api/graphql`;

		logger.info('Fetching users from GraphQL endpoint', { url: graphqlUrl });

		const users = await httpClient.post(
			graphqlUrl,
			{ query: USERS },
			{
				timeout: 30000,
				retries: 2,
			}
		);

		const userData = users?.data?.users;

		if (!userData || !Array.isArray(userData)) {
			throw new Error('Invalid response structure: expected users array');
		}

		logger.info('Successfully fetched users', {
			count: userData.length,
		});

		return NextResponse.json({
			success: true,
			users: userData,
		});
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		const statusCode = err instanceof APIError ? err.statusCode || 500 : 500;

		logger.error('Error fetching users', {
			error: errorMessage,
			statusCode,
		});

		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch users. Please try again later.',
			},
			{ status: statusCode }
		);
	}
}
