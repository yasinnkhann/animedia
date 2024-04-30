import { DefaultSession, type Account, Profile, JWT } from 'next-auth';

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user?: {
			id: string;
			created_at: Date;
			emailVerified: Date | null;
			password: string | null;
		} & DefaultSession['user'];
		account?: Account;
		profile?: Profile;
	}
}
