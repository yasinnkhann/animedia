export { default } from 'next-auth/middleware';

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
