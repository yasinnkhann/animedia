'use server';

import { igdbClient } from '../api';

export async function getGameDetailsAction(gameId: string) {
  try {
    const res = await igdbClient.getGameDetails(gameId);
    return (res as any)?.results?.[0] || null;
  } catch (error) {
    console.error('Error fetching game details:', error);
    return null;
  }
}
