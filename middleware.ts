import { next } from '@vercel/edge';

/**
 * Vercel Edge Middleware — runs before every response.
 * Adds Content-Security-Policy: frame-ancestors * so the app
 * can be embedded in iframes (e.g. Canva).
 */
export default function middleware() {
  const response = next();
  response.headers.set('Content-Security-Policy', 'frame-ancestors *');
  return response;
}

export const config = {
  matcher: '/:path*',
};
