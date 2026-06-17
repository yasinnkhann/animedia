import { withAuth } from 'next-auth/middleware';

export default function middleware(req: any, event: any) {
  return withAuth({
    pages: {
      signIn: '/auth/login',
    },
  })(req, event);
}

export const config = {
  matcher: [
    '/my-movies/:path*',
    '/my-shows/:path*',
    '/my-games/:path*',
    '/stats/:path*',
    '/users/:path*',
    '/auth/change-password/:path*',
  ],
};
