import { NextResponse } from 'next/server';
import { fetchUserMedia } from '@/app/actions/userMediaActions';

export const maxDuration = 60;

export async function GET() {
  try {
    const data = await fetchUserMedia();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/user/media:', error);
    return NextResponse.json({ userMovies: [], userShows: [], userGames: [] }, { status: 200 });
  }
}
