import { DefaultSession, type Account, Profile, User } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user?: User & {
      id?: string;
      emailVerified?: Date | null;
      password?: string;
    };
    account?: Account;
    profile?: Profile & {
      email_verified?: boolean;
    };
  }
}

declare module 'next-auth' {
  interface Profile {
    email_verified?: boolean;
  }
  interface User {
    id?: string;
    created_at?: Date;
    emailVerified?: Date | null;
  }
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      created_at: Date;
      emailVerified: Date | null;
    } & DefaultSession['user'];
    account?: Account;
    profile?: Profile;
  }
}
