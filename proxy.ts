import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.JWT_SECRET,
});

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
