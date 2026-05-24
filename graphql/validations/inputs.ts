import { z } from 'zod';

/**
 * Input validation schemas for GraphQL arguments
 * These ensure data integrity at the resolver level
 */

// Movie resolver inputs
export const MovieSearchInput = z.object({
	q: z.string().min(1, 'Search query required').max(100),
	page: z.number().int().min(1).optional().default(1),
});

export const MovieDetailsInput = z.object({
	movieDetailsId: z.string().min(1, 'Movie ID required'),
	page: z.number().int().min(1).optional().default(1),
});

export const PaginationInput = z.object({
	page: z.number().int().min(1).optional().default(1),
});

// Show resolver inputs
export const ShowSearchInput = z.object({
	q: z.string().min(1, 'Search query required').max(100),
	page: z.number().int().min(1).optional().default(1),
});

export const ShowDetailsInput = z.object({
	showDetailsId: z.string().min(1, 'Show ID required'),
});

// Game resolver inputs
export const GameSearchInput = z.object({
	q: z.string().min(1, 'Search query required').max(100),
	limit: z.number().int().min(1).max(50).optional().default(10),
	page: z.number().int().min(1).optional().default(1),
});

export const GameDetailsInput = z.object({
	gameId: z.string().min(1, 'Game ID required'),
});

// Person resolver inputs
export const PersonSearchInput = z.object({
	q: z.string().min(1, 'Search query required').max(100),
	page: z.number().int().min(1).optional().default(1),
});

export const PersonDetailsInput = z.object({
	personDetailsId: z.string().min(1, 'Person ID required'),
});

export const GameLimitInput = z.object({
	limit: z.number().int().min(1).max(500).optional().default(500),
});

export const GamePaginationInput = z.object({
	limit: z.number().int().min(1).max(50).optional().default(10),
	page: z.number().int().min(1).optional().default(1),
});

export const GameGenreInput = z.object({
	genreId: z.string().min(1, 'Genre ID required'),
	limit: z.number().int().min(1).max(50).optional().default(10),
	page: z.number().int().min(1).optional().default(1),
});

export const GameIdsInput = z.object({
	gameIds: z.array(z.string().min(1)).min(1, 'At least one game ID required'),
	limit: z.number().int().min(1).max(500).optional().default(500),
});

export const GameCharacterInput = z.object({
	gameId: z.string().min(1, 'Game ID required'),
	limit: z.number().int().min(1).max(100).optional().default(20),
});

export const GameCharacterSearchInput = z.object({
	name: z.string().min(1, 'Character name required').max(100),
	limit: z.number().int().min(1).max(500).optional().default(500),
});

// User resolver inputs
const WatchStatusInput = z.enum([
	'NOT_WATCHING',
	'WATCHING',
	'PLAN_TO_WATCH',
	'COMPLETED',
	'ON_HOLD',
	'DROPPED',
]);

const RatingInput = z.number().int().min(1).max(10).nullish();

export const UserIdInput = z.object({
	id: z.string().min(1, 'User ID required'),
});

export const UserMediaInput = z.object({
	movieId: z.string().min(1, 'Media ID required'),
});

export const UserShowInput = z.object({
	showId: z.string().min(1, 'Show ID required'),
});

export const UserGameInput = z.object({
	gameId: z.string().min(1, 'Game ID required'),
});

export const TokenVerificationInput = z.object({
	token: z.string().min(1, 'Token required'),
	userId: z.string().min(1, 'User ID required'),
});

export const EmailVerificationInput = z.object({
	email: z.string().email('Valid email required'),
});

export const TokenInput = z.object({
	token: z.string().min(1, 'Token required'),
});

export const AddMovieInput = z.object({
	movieId: z.string().min(1, 'Movie ID required'),
	movieName: z.string().min(1, 'Movie name required').max(200),
	watchStatus: WatchStatusInput,
});

export const AddShowInput = z.object({
	showId: z.string().min(1, 'Show ID required'),
	showName: z.string().min(1, 'Show name required').max(200),
	watchStatus: WatchStatusInput,
	currentEpisode: z.number().int().min(0).optional(),
});

export const AddGameInput = z.object({
	gameId: z.string().min(1, 'Game ID required'),
	gameName: z.string().min(1, 'Game name required').max(200),
	wishlist: z.boolean().optional(),
	rating: z.number().int().min(1).max(10).optional(),
});

export const UpdateMovieInput = z.object({
	movieId: z.string().min(1, 'Movie ID required'),
	watchStatus: WatchStatusInput,
	movieRating: RatingInput,
});

export const UpdateShowInput = z.object({
	showId: z.string().min(1, 'Show ID required'),
	watchStatus: WatchStatusInput,
	showRating: RatingInput,
	currentEpisode: z.number().int().min(0).nullish(),
});

export const UpdateGameInput = z.object({
	gameId: z.string().min(1, 'Game ID required'),
	wishlist: z.boolean().optional(),
	rating: z.number().int().min(1).max(10).optional(),
});

export const RegisterUserInput = z.object({
	name: z.string().min(1, 'Name required').max(100),
	email: z.string().email('Valid email required'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const ChangePasswordInput = z.object({
	userId: z.string().min(1, 'User ID required'),
	newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const EmailInput = z.object({
	email: z.string().email('Valid email required'),
});

/**
 * Helper to validate and parse input
 */
export function parseInput<T>(schema: z.ZodSchema<T>, data: any): T {
	try {
		return schema.parse(data);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const messages = error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
			throw new Error(`Validation error: ${messages}`);
		}
		throw error;
	}
}
