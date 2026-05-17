import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(_req: NextRequest) {
	const session = await getServerSession(authOptions);

	if (session) {
		return NextResponse.json({
			content: 'This is protected content. You can access this api because you are signed in.',
		});
	} else {
		return NextResponse.json(
			{
				error: 'You must be signed in to view the protected api on this page.',
			},
			{ status: 401 }
		);
	}
}
